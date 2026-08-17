from fastapi import APIRouter, HTTPException
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def list_products(category_slug: str | None = None):
    """
    Список товаров каталога. Если передан category_slug — фильтрует по категории.
    TODO: когда в Supabase появятся реальные данные (после первой синхронизации
    с Google Таблицей), заменить на настоящий запрос через get_supabase().
    """
    supabase = get_supabase()
    query = supabase.table("products").select("*, product_variations(*)")
    if category_slug:
        query = query.eq("categories.slug", category_slug)
    response = query.execute()
    return response.data


@router.get("/{product_slug}")
def get_product(product_slug: str):
    """Карточка одного товара со всеми вариациями (размер × плотность) и остатками."""
    supabase = get_supabase()
    response = (
        supabase.table("products")
        .select("*, product_variations(*, wholesale_tiers(*))")
        .eq("slug", product_slug)
        .single()
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return response.data
