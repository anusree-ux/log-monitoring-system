from flask import request, jsonify
from app import app
from models import db, Log


@app.route("/api/logs", methods=["POST"])
def ingest_log():

    data = request.json

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    if not data.get("service_name"):
        return jsonify({"error": "service_name is required"}), 400

    if not data.get("message"):
        return jsonify({"error": "message is required"}), 400

    new_log = Log(
        service_name=data["service_name"],
        log_level=data.get("log_level", "INFO").upper(),
        message=data["message"],
        log_metadata=data.get("metadata", {})
    )

    db.session.add(new_log)
    db.session.commit()

    return jsonify({
        "status": "success",
        "id": new_log.id
    }), 201


@app.route("/api/logs", methods=["GET"])
def get_logs():

    service = request.args.get("service")
    level = request.args.get("level")
    limit = request.args.get("limit", 100, type=int)

    query = Log.query

    if service:
        query = query.filter_by(service_name=service)

    if level:
        query = query.filter_by(log_level=level.upper())

    logs = (
        query.order_by(Log.timestamp.desc())
        .limit(limit)
        .all()
    )

    result = [
        {
             "id": log.id,
             "timestamp": log.timestamp.isoformat() + "Z",
             "service_name": log.service_name,
             "log_level": log.log_level,
             "message": log.message,
             "metadata": log.log_metadata,
        }
        for log in logs
    ]

    return jsonify(result), 200


@app.route("/health")
def health():

    return jsonify({
        "status": "healthy"
    }), 200
