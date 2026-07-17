from flask import Flask
from flask_cors import CORS

from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

CORS(app, origins=[Config.FRONTEND_URL])

import routes

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=Config.FLASK_DEBUG
    )
