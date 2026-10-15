"""TRACE Backend Application Configuration."""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings read from environment variables or .env file."""

    ENVIRONMENT: str = Field(default="development", description="Runtime environment")
    DEBUG: bool = Field(default=False, description="Debug mode")
    PORT: int = Field(default=8000, description="Server port")
    HOST: str = Field(default="0.0.0.0", description="Server host")

    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173"],
        description="Allowed CORS origins",
    )

    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/trace_db",
        description="PostgreSQL / Supabase connection string",
    )

    DEFAULT_RULE_VERSION: str = Field(
        default="2026.1.0",
        description="Active deterministic rules engine version",
    )

    CLOCK_SKEW_TOLERANCE_SECONDS: float = Field(
        default=5.0,
        description="Allowable inter-party timestamp variance before capping strength",
    )

    MAX_UPLOAD_SIZE_BYTES: int = Field(
        default=5 * 1024 * 1024,
        description="Maximum file upload size in bytes (default 5MB)",
    )

    MAX_UPLOAD_ROWS: int = Field(
        default=2000,
        description="Maximum rows/records permitted in a single upload batch",
    )

    SUPPORTED_CURRENCIES: List[str] = Field(
        default=["NGN", "USD", "EUR", "GBP"],
        description="Permitted ISO currency codes",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
