"""Case investigator review schemas."""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

from app.schemas.enums import ReviewVerdictEnum


class ReviewCreateRequest(BaseModel):
    """Payload submitted by investigator to record case review."""

    analysis_id: UUID = Field(description="UUID of the deterministic analysis being reviewed")
    reviewer_id: str = Field(description="Identifier or badge of the human investigator")
    verdict: ReviewVerdictEnum = Field(description="Reviewer determination")
    notes: str = Field(description="Investigator rationale and audit notes")


class ReviewResponse(BaseModel):
    """Review confirmation record."""

    review_id: UUID = Field(description="Review unique identifier")
    case_id: UUID = Field(description="Associated case identifier")
    analysis_id: UUID = Field(description="Target analysis identifier")
    reviewer_id: str = Field(description="Reviewer identifier")
    verdict: ReviewVerdictEnum = Field(description="Review determination")
    notes: str = Field(description="Investigator notes")
    created_at: datetime = Field(description="Timestamp of review submission")
