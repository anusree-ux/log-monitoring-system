import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///logs.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost"
    )

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-key"
    )

    FLASK_DEBUG = os.getenv(
        "FLASK_DEBUG",
        "false"
    ).lower() == "true"
