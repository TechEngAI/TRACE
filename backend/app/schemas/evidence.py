"""Evidence ingestion and pack export schemas."""

from datetime import datetime
from typing import Any, Dict, List
from uuid import UUID
from pydantic import BaseModel, Field

from app.schemas.enums import InstitutionPartyEnum


class EvidenceUploadResponse(BaseModel):
    """Result of evidence log upload."""

    source_file_id: UUID = Field(description="Unique source file UUID")
    case_id: UUID = Field(description="Associated case identifier")
    filename: str = Field(description="Original filename uploaded")
    records_ingested: int = Field(description="Count of raw records extracted")
    sha256_hash: str = Field(description="Cryptographic checksum of original file")
    status: str = Field(default="INGESTED", description="Ingestion processing status")


class RawFileHashItem(BaseModel):
    """File checksum metadata in evidence pack."""

    institution: InstitutionPartyEnum = Field(description="Originating institution")
    filename: str = Field(description="File name")
    sha256: str = Field(description="SHA-256 hash")


class EvidencePackResponse(BaseModel):
    """Exportable tamper-evident evidence pack response."""

    pack_id: UUID = Field(description="Evidence pack unique identifier")
    case_id: UUID = Field(description="Case identifier")
    generated_at: datetime = Field(description="Time of evidence pack packaging")
    audit_hash: str = Field(description="Cryptographic aggregate audit hash")
    rule_version: str = Field(description="Rules version used for analysis")
    analysis: Dict[str, Any] = Field(description="Snapshot of latest frozen analysis")
    raw_file_hashes: List[RawFileHashItem] = Field(
        default_factory=list,
        description="Source file hashes establishing chain of custody",
    )
    event_count: int = Field(description="Total canonical events included")
