import re
import unicodedata

from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.services.sheets_client import fetch_sheet_stock

router = APIRouter(prefix="/admin", tags=["admin"])


_TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
    "ж": "zh", "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
    "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}


def _slugify(text: str) -> str:
    """Превращает русское название в слаг вида «kurerskie-pakety»."""
    text = text.lower().strip()
    text = "".join(_TRANSLIT.get(ch, ch) for ch in text)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "item"


def _get_or_create_category(supabase, name: str, cache: dict) -> int:
    if name in cache:
        return cache[name]
    existing = supabase.table("categories").select("id").eq("name", name).execute()
    if existing.data:
        cache[name] = existing.data[0]["id"]
        return cache[name]
    slug = _slugify(name)
    inserted = supabase.table("categories").insert({"name": name, "slug": slug}).execute()
    cache[name] = inserted.data[0]["id"]
    return cache[name]


def _get_or_create_product(supabase, category_id: int, name: str, is_active: bool, cache: dict) -> int:
    key = (category_id, name)
    if key in cache:
        return cache[key]
    existing = (
        supabase.table("products")
        .select("id")
        .eq("category_id", category_id)
        .eq("name", name)
        .execute()
    )
    if existing.data:
        cache[key] = existing.data[0]["id"]
        return cache[key]
    slug = _slugify(name)
    inserted = supabase.table("products").insert(
        {"category_id": category_id, "name": name, "slug": slug, "is_active": is_active}
    ).execute()
    cache[key] = inserted.data[0]["id"]
    return cache[key]


def _set_wholesale_tiers(supabase, variation_id: int, tier_100, tier_1000) -> None:
    supabase.table("wholesale_tiers").delete().eq(
        "product_variation_id", variation_id
    ).execute()
    tiers_to_insert = []
    if tier_100:
        tiers_to_insert.append(
            {"product_variation_id": variation_id, "min_qty": 100, "price_per_unit": tier_100}
        )
    if tier_1000:
        tiers_to_insert.append(
            {"product_variation_id": variation_id, "min_qty": 1000, "price_per_unit": tier_1000}
        )
    if tiers_to_insert:
        supabase.table("wholesale_tiers").insert(tiers_to_insert).execute()


@router.post("/sync-stock")
def sync_stock():
    """
    Читает лист «Остатки» из Google Таблицы и приводит Supabase в
    соответствие с ним:
      - существующий SKU -> обновляются цена/остаток/оптовые цены;
      - новый SKU -> автоматически создаются категория (если её ещё нет),
        товар (если его ещё нет) и сама вариация с этим SKU.

    Пока запускается вручную (POST-запрос на этот адрес) — TODO: подключить
    по расписанию вместо ручного вызова.
    """
    supabase = get_supabase()
    rows = fetch_sheet_stock()

    category_cache: dict[str, int] = {}
    product_cache: dict[tuple[int, str], int] = {}

    updated, created, skipped = [], [], []

    for row in rows:
        sku = row.get("SKU")
        if not sku:
            continue

        category_name = (row.get("Категория") or "").strip()
        product_name = (row.get("Товар") or "").strip()
        size = row.get("Размер")
        density = row.get("Плотность,мкм") or row.get("Плотность, мкм")
        price = row.get("Цена")
        stock = row.get("Остаток, шт") or row.get("Остаток,шт")
        is_active = str(row.get("Активен", "")).strip().upper() in ("TRUE", "1", "ДА")
        tier_100 = row.get("Цена от 100 шт,₽")
        tier_1000 = row.get("Цена от 1000 шт,₽")

        existing = (
            supabase.table("product_variations")
            .select("id")
            .eq("sku", sku)
            .execute()
        )

        if existing.data:
            variation_id = existing.data[0]["id"]
            supabase.table("product_variations").update(
                {"price": price, "stock": stock}
            ).eq("id", variation_id).execute()
            _set_wholesale_tiers(supabase, variation_id, tier_100, tier_1000)
            updated.append(sku)
            continue

        if not category_name or not product_name:
            # Без названия категории/товара новую позицию не создать —
            # пропускаем, чтобы не плодить записи-заглушки.
            skipped.append(sku)
            continue

        category_id = _get_or_create_category(supabase, category_name, category_cache)
        product_id = _get_or_create_product(
            supabase, category_id, product_name, is_active, product_cache
        )

        inserted = (
            supabase.table("product_variations")
            .insert(
                {
                    "product_id": product_id,
                    "sku": sku,
                    "size": size,
                    "density_mkm": density,
                    "price": price,
                    "stock": stock,
                }
            )
            .execute()
        )
        variation_id = inserted.data[0]["id"]
        _set_wholesale_tiers(supabase, variation_id, tier_100, tier_1000)
        created.append(sku)

    return {"updated": updated, "created": created, "skipped_no_category_or_product": skipped}
