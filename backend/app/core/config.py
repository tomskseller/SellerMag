from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase
    supabase_url: str = ""
    supabase_service_key: str = ""

    # Google Sheets
    google_sheets_spreadsheet_id: str = ""
    google_service_account_json_path: str = "./google-credentials.json"

    # ЮKassa
    yookassa_shop_id: str = ""
    yookassa_secret_key: str = ""

    # DaData
    dadata_api_key: str = ""
    dadata_secret_key: str = ""

    # SMS.ru
    smsru_api_key: str = ""

    cors_allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
