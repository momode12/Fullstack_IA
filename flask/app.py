from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.init_models import init_models, mongo
from routes.init_route import init_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Activer CORS
    CORS(app)

    # Initialiser JWT avec l'application Flask
    JWTManager(app)

    # Initialiser MongoDB avec l'application Flask
    init_models(app)
    print("MongoDB initialized:", mongo.db is not None)
    import models.user_models 

    # Enregistrer les blueprints/routes
    init_routes(app)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
