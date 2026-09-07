from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("")
def list_categories():
    """Список категорий каталога (используется на главной и в сайдбаре каталога)."""
    supabase = get_supabase()
    response = supabase.table("categories").select("*").order("sort_order").execute()
    return response.data
