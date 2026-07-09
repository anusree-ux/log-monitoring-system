import urllib.request
import json
import time
import random

SERVICES = ['payment-api', 'auth-service', 'user-dashboard', 'inventory-db']
LEVELS = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'] # Weighted towards INFO
MESSAGES = [
    "User logged in successfully.",
    "Database connection timeout.",
    "Payment processed.",
    "High memory usage detected.",
    "Invalid token received.",
    "Failed to fetch user profile."
]

print("Sending dummy logs to your platform... Press Ctrl+C to stop.")

while True:
    log_data = {
        "service_name": random.choice(SERVICES),
        "log_level": random.choice(LEVELS),
        "message": random.choice(MESSAGES),
        "metadata": {"source": "log-generator", "region": "us-east-1"}
    }

    req = urllib.request.Request(
        'http://localhost/api/logs',
        data=json.dumps(log_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Sent {log_data['log_level']} from {log_data['service_name']}")
    except Exception as e:
        print(f"Failed to send log: {e}")

    # Wait between 0.5 and 2.5 seconds before sending the next log
    time.sleep(random.uniform(0.5, 2.5))
