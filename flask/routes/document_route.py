from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import tempfile
from services import document_service
from utils.file_utils import extract_text_from_pdf, extract_text_from_docx

bp = Blueprint('documents', __name__)

@bp.route('/upload', methods=['POST', 'OPTIONS'])
@jwt_required()
def upload_document():
    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return '', 200
    
    # Récupérer l'email de l'utilisateur depuis le JWT (claim 'sub')
    user_email = get_jwt_identity()
    print(f"✅ JWT valide pour l'utilisateur: {user_email}")
    
    if 'file' not in request.files:
        return jsonify(success=False, message='Fichier manquant'), 400

    file = request.files['file']
    if not file.filename:
        return jsonify(success=False, message='Nom de fichier vide'), 400
        
    filename = file.filename.lower()

    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        file.save(tmp_file.name)
        tmp_path = tmp_file.name

    try:
        if filename.endswith('.pdf'):
            content = extract_text_from_pdf(tmp_path)
        elif filename.endswith('.docx'):
            content = extract_text_from_docx(tmp_path)
        elif filename.endswith('.txt'):
            with open(tmp_path, 'r', encoding='utf-8') as f:
                content = f.read()
        else:
            return jsonify(success=False, message='Format de fichier non supporté. Formats acceptés: PDF, DOCX, TXT'), 400

        print(f"📄 Document: {filename}")
        print(f"👤 Utilisateur: {user_email}")
        print(f"📝 Contenu extrait: {len(content)} caractères")

        document_id = document_service.save_document(filename, content, user_email)
        print(f"✅ Document enregistré avec ID: {document_id}")

        return jsonify(
            success=True, 
            document_id=document_id, 
            message='Document téléversé avec succès'
        ), 200
        
    except Exception as e:
        print(f"❌ Erreur lors du traitement du fichier: {e}")
        import traceback
        traceback.print_exc()
        return jsonify(success=False, message=f'Erreur serveur: {str(e)}'), 500
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)