import httpx
from app.core.config import settings


def fetch_sheet_stock() -> list[dict]:
    """
    Запрашивает у Apps Script веб-приложения текущее содержимое листа
    «Остатки» — список словарей вида:
    {SKU, Категория, Товар, Размер, "Плотность,мкм", Цена, "Остаток, шт",
     Активен, "Цена от 100 шт,₽", "Цена от 1000 шт,₽"}
    """
    if not settings.google_sheets_webapp_url:
        return []
    response = httpx.get(
        settings.google_sheets_webapp_url,
        params={"token": settings.google_sheets_token},
        timeout=15,
        follow_redirects=True,
    )
    response.raise_for_status()
    return response.json()


def push_order_to_sheet(order: dict) -> None:
    """
    Отправляет данные нового заказа в Apps Script веб-приложение — тот
    дописывает строку в лист «Заказы». Если Google Таблица ещё не
    настроена (нет ссылки в .env) — просто ничего не делает, чтобы не
    ломать оформление заказа.
    """
    if not settings.google_sheets_webapp_url:
        return
    payload = {**order, "token": settings.google_sheets_token}
    try:
        httpx.post(settings.google_sheets_webapp_url, json=payload, timeout=15, follow_redirects=True)
    except httpx.HTTPError:
        # Заказ в Supabase уже создан к этому моменту — ошибка записи в
        # таблицу не должна ронять оформление заказа для покупателя.
        # TODO: добавить лог/уведомление менеджеру, если это будет
        # происходить часто.
        pass
