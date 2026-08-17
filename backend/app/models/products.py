from pydantic import BaseModel


class WholesaleTier(BaseModel):
    min_qty: int
    price_per_unit: float


class ProductVariation(BaseModel):
    id: int
    size: str | None = None
    density_mkm: int | None = None
    sku: str
    price: float
    stock: int
    wholesale_tiers: list[WholesaleTier] = []


class Product(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: str | None = None
    variations: list[ProductVariation] = []


class Category(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: int | None = None
