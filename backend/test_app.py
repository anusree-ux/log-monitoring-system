import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from app import app
from models import db


@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()

        yield client


def test_ingest_log(client):

    response = client.post(
        "/api/logs",
        json={
            "service_name": "payment-api",
            "log_level": "ERROR",
            "message": "Payment failed"
        }
    )

    assert response.status_code == 201


def test_get_logs(client):

    client.post(
        "/api/logs",
        json={
            "service_name": "auth-service",
            "log_level": "INFO",
            "message": "User logged in"
        }
    )

    response = client.get("/api/logs")

    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["service_name"] == "auth-service"
