import os
# NEW: We force the environment variable to memory BEFORE importing the app!
os.environ['DATABASE_URL'] = 'sqlite:///:memory:'

import pytest
from app import app, db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            # Drop everything and create fresh tables just to be 100% safe
            db.drop_all()
            db.create_all()
        yield client

def test_create_rule_and_ingest_log(client):
    # 1. Test creating an Alert Rule
    rule_response = client.post('/api/rules', json={
        "name": "Test Rule",
        "target_service": "test-service",
        "target_level": "ERROR",
        "threshold_count": 1,
        "time_window_minutes": 5,
        "email_notification": "admin@test.com"
    })
    assert rule_response.status_code == 201

    # 2. Test ingesting a Log that triggers the rule
    log_response = client.post('/api/logs', json={
        "service_name": "test-service",
        "log_level": "ERROR",
        "message": "This should trigger the alert!"
    })
    assert log_response.status_code == 201

    # 3. Verify the log actually saved
    get_response = client.get('/api/logs')
    
    # This should now perfectly equal 1!
    assert len(get_response.json) == 1
    assert get_response.json[0]['message'] == "This should trigger the alert!"
