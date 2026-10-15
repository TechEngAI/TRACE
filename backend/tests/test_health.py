"""Health endpoint, route registration, and endpoint status tests."""

import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_health():
    """Verify that the root health endpoint returns 200 OK and valid payload."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "trace-backend"
    assert "version" in data
    assert "timestamp" in data


def test_v1_health():
    """Verify that the /api/v1/health endpoint returns 200 OK."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "trace-backend"
    assert data["version"] == "0.1.0"


def test_openapi_schema_generation():
    """Verify OpenAPI schema generation contains all planned routes."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    paths = schema.get("paths", {})

    expected_routes = [
        "/health",
        "/api/v1/health",
        "/api/v1/cases",
        "/api/v1/cases/{case_id}",
        "/api/v1/cases/{case_id}/evidence",
        "/api/v1/cases/{case_id}/correlation",
        "/api/v1/cases/{case_id}/analyze",
        "/api/v1/cases/{case_id}/evidence-pack",
        "/api/v1/cases/{case_id}/review",
    ]

    for route in expected_routes:
        assert route in paths, f"Expected route {route} not found in OpenAPI paths"


def test_future_business_endpoints_return_501():
    """Verify that future endpoints (analyze, evidence-pack, review) return HTTP 501 Not Implemented."""
    dummy_case_id = uuid.uuid4()

    # Analyze endpoint (Part 3)
    res_analyze = client.post(f"/api/v1/cases/{dummy_case_id}/analyze")
    assert res_analyze.status_code == 501

    # Evidence pack export (Part 3)
    res_pack = client.get(f"/api/v1/cases/{dummy_case_id}/evidence-pack")
    assert res_pack.status_code == 501

    # Human review endpoint (Part 4)
    dummy_review = {
        "analysis_id": str(uuid.uuid4()),
        "reviewer_id": "INV-001",
        "verdict": "CONCUR",
        "notes": "Verified.",
    }
    res_review = client.post(f"/api/v1/cases/{dummy_case_id}/review", json=dummy_review)
    assert res_review.status_code == 501
