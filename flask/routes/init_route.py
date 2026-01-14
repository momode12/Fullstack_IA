from routes.auth import auth_bp
from routes.document_route import bp as documents_bp

def init_routes(app):
    """Enregistre tous les blueprints de l'application"""
    
    # Routes d'authentification
    app.register_blueprint(auth_bp, url_prefix="/auth")
    
    # Routes pour les documents
    app.register_blueprint(documents_bp, url_prefix="/api/documents")
    
    print("✅ Routes enregistrées:")
    print("   - /auth/register (POST)")
    print("   - /auth/login (POST)")
    print("   - /api/documents/upload (POST)")