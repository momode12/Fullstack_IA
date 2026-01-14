from models.document_models import DocumentModel
from datetime import datetime

def save_document(file_name: str, content: str, user_email: str):
    document_data = {
        "filename": file_name,
        "content": content,
        "uploaded_by": user_email,
        "created_at": datetime.utcnow()
    }
    result = DocumentModel.insert_document(document_data)
    return str(result.inserted_id)

def get_documents_for_user(user_email: str):
    return DocumentModel.find_all_by_user(user_email)
