from flask import request, jsonify
from model.config import db  # Assuming db is initialized in config.py

def forgot_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400

    user = db.userprofile.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.userprofile.update_one({"email": email}, {"$set": {"password": new_password}})

    return jsonify({"message": "Password updated successfully"}), 200
