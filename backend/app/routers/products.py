from fastapi import APIRouter, HTTPException
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def list_products():
    """
    Список товаров каталога вместе с названием категории и всеми вариациями.
    TODO: добавить настоящую фильтрацию по категории на уровне запроса к базе
    (сейчас фильтрация по категории делается на фронтенде после получения
    полного списка — приемлемо, пока ассортимент небольшой).
    """
    supabase = get_supabase()
    response = (
        supabase.table("products")
        .select("*, categories(name, slug), product_variations(*)")
        .eq("is_active", True)
        .execute()
    )
    return response.data


@router.get("/{product_slug}")
def get_product(product_slug: str):
    """Карточка одного товара со всеми вариациями (размер × плотность) и остатками."""
    supabase = get_supabase()
    response = (
        supabase.table("products")
        .select("*, categories(name, slug), product_variations(*, wholesale_tiers(*))")
        .eq("slug", product_slug)
        .single()
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return response.data
