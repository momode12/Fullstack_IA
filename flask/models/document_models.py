from models.init_models import mongo
from datetime import datetime
from bson import ObjectId

class DocumentModel:
    @staticmethod
    def collection():
        if mongo.db is None:
            raise Exception("MongoDB non initialisé")
        return mongo.db.documents

    @staticmethod
    def insert_document(document_data):
        # document_data exemple : {
        #   "filename": "doc1.pdf",
        #   "content": "texte extrait",
        #   "uploaded_by": "user_email_or_id",
        #   "created_at": datetime.utcnow()
        # }
        return DocumentModel.collection().insert_one(document_data)

    @staticmethod
    def find_by_id(doc_id):
        return DocumentModel.collection().find_one({"_id": ObjectId(doc_id)})

    @staticmethod
    def find_all_by_user(user_email):
        return list(DocumentModel.collection().find({"uploaded_by": user_email}))
