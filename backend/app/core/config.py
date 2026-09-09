from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_key: str = ""

    google_sheets_webapp_url: str = ""
    google_sheets_token: str = ""

    yookassa_shop_id: str = ""
    yookassa_secret_key: str = ""

    dadata_api_key: str = ""
    dadata_secret_key: str = ""

    smsru_api_key: str = ""

    cors_allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
