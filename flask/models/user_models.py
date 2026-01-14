from models.init_models import mongo
import bcrypt

class UserModel:
    @staticmethod
    def collection():
        if mongo.db is None:
            raise Exception("MongoDB non initialisé")
        return mongo.db.users

    @staticmethod
    def find_by_email(email):
        return UserModel.collection().find_one({"email": email})

    @staticmethod
    def find_by_username(username):
        return UserModel.collection().find_one({"username": username})

    @staticmethod
    def insert_user(user_data):
        # Hash le mot de passe avant l'insertion
        if "password" in user_data:
            hashed = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())
            user_data["password"] = hashed.decode('utf-8')
        return UserModel.collection().insert_one(user_data)

    @staticmethod
    def verify_password(email, password):
        user = UserModel.find_by_email(email)
        if not user:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8'))