import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta

app = Flask(__name__)
CORS(app)

# --- Database Configuration ---
# NEW: This line now looks for PostgreSQL first, but falls back to SQLite if running locally!
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///logs.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Models ---
class Log(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    service_name = db.Column(db.String(255), nullable=False)
    log_level = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    log_metadata = db.Column(db.JSON, default={})

class AlertRule(db.Model):
    __tablename__ = 'alert_rules'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    target_service = db.Column(db.String(255), nullable=False)
    target_level = db.Column(db.String(50), nullable=False)
    threshold_count = db.Column(db.Integer, nullable=False)
    time_window_minutes = db.Column(db.Integer, nullable=False)
    email_notification = db.Column(db.String(255), nullable=False)

with app.app_context():
    db.create_all()

# --- Routes ---
@app.route('/api/rules', methods=['POST', 'GET'])
def manage_rules():
    """Endpoint to create and fetch alert rules."""
    if request.method == 'POST':
        data = request.json
        new_rule = AlertRule(
            name=data['name'],
            target_service=data['target_service'],
            target_level=data['target_level'].upper(),
            threshold_count=int(data['threshold_count']),
            time_window_minutes=int(data['time_window_minutes']),
            email_notification=data['email_notification']
        )
        db.session.add(new_rule)
        db.session.commit()
        return jsonify({"status": "success", "id": new_rule.id}), 201

    if request.method == 'GET':
        rules = AlertRule.query.all()
        result = [{
            "id": r.id, "name": r.name, "target_service": r.target_service,
            "target_level": r.target_level, "threshold_count": r.threshold_count,
            "time_window_minutes": r.time_window_minutes, "email": r.email_notification
        } for r in rules]
        return jsonify(result), 200

@app.route('/api/logs', methods=['POST'])
def ingest_log():
    data = request.json
    if not data or not data.get('service_name') or not data.get('message'):
        return jsonify({"error": "Missing required fields"}), 400

    new_log = Log(
        service_name=data['service_name'],
        log_level=data.get('log_level', 'INFO').upper(),
        message=data['message'],
        log_metadata=data.get('metadata', {})
    )
    db.session.add(new_log)
    db.session.commit()

    # Alert Evaluation Logic
    active_rules = AlertRule.query.filter_by(
        target_service=new_log.service_name,
        target_level=new_log.log_level
    ).all()

    for rule in active_rules:
        time_threshold = datetime.now(timezone.utc) - timedelta(minutes=rule.time_window_minutes)

        recent_logs_count = Log.query.filter(
            Log.service_name == rule.target_service,
            Log.log_level == rule.target_level,
            Log.timestamp >= time_threshold
        ).count()

        if recent_logs_count >= rule.threshold_count:
            print("\n" + "="*50)
            print(f"🚨 ALERT TRIGGERED: {rule.name} 🚨")
            print(f"Condition: {recent_logs_count} {rule.target_level}s from {rule.target_service} in the last {rule.time_window_minutes} mins.")
            print(f"Action: Sending email to {rule.email_notification}")
            print("="*50 + "\n")

    return jsonify({"status": "success", "id": new_log.id}), 201

@app.route('/api/logs', methods=['GET'])
def get_logs():
    service = request.args.get('service')
    level = request.args.get('level')
    limit = request.args.get('limit', 100, type=int)

    query = Log.query
    if service: query = query.filter_by(service_name=service)
    if level: query = query.filter_by(log_level=level.upper())

    logs = query.order_by(Log.timestamp.desc()).limit(limit).all()

    result = [{
        "id": log.id, "timestamp": log.timestamp.isoformat() + "Z",
        "service_name": log.service_name, "log_level": log.log_level,
        "message": log.message, "metadata": log.log_metadata
    } for log in logs]
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
