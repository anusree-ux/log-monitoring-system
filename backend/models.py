import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Log(db.Model):
    __tablename__ = "logs"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    timestamp = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    service_name = db.Column(
        db.String(255),
        nullable=False
    )

    log_level = db.Column(
        db.String(50),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    log_metadata = db.Column(
        db.JSON,
        default=dict
    )
