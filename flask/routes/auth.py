from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    success, message = register_user(data)
    status_code = 201 if success else 400
    return jsonify({"message": message}), status_code

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    token, message = login_user(data)
    if token:
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": message}), 401