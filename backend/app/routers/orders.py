import random
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderItemIn(BaseModel):
    product_variation_id: int
    product_name: str
    variant_label: str | None = None
    qty: int
    price_per_unit: float


class OrderIn(BaseModel):
    customer_name: str
    customer_phone: str
    delivery_method: str  # 'pickup' | 'courier' | 'transport_company'
    delivery_address: str | None = None
    payer_type: str = "person"  # 'person' | 'company'
    inn: str | None = None
    items: list[OrderItemIn]


def _generate_order_number() -> str:
    return f"СМ-{random.randint(10000, 99999)}"


@router.post("")
def create_order(order: OrderIn):
    """
    Создаёт заказ:
    1. Считает итоговую сумму по переданным позициям.
    2. Пишет заказ и его позиции в Supabase.
    3. TODO: списывает остаток у соответствующих product_variations.
    4. TODO: асинхронно дописывает строку в лист «Заказы» Google Таблицы
       (см. google-sheets/README.md) и вызывает ЮKassa/DaData по необходимости.
    """
    supabase = get_supabase()
    total = sum(item.qty * item.price_per_unit for item in order.items)
    order_number = _generate_order_number()

    order_row = {
        "order_number": order_number,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "delivery_method": order.delivery_method,
        "delivery_address": order.delivery_address,
        "payer_type": order.payer_type,
        "inn": order.inn,
        "total_amount": total,
    }
    inserted = supabase.table("orders").insert(order_row).execute()
    order_id = inserted.data[0]["id"]

    items_rows = [
        {
            "order_id": order_id,
            "product_variation_id": item.product_variation_id,
            "product_name": item.product_name,
            "variant_label": item.variant_label,
            "qty": item.qty,
            "price_per_unit": item.price_per_unit,
        }
        for item in order.items
    ]
    supabase.table("order_items").insert(items_rows).execute()

    return {"order_number": order_number, "total_amount": total}
