# controllers.py
from flask import request, jsonify, redirect, url_for
from model.signup_user import UserModel
 
from controller.emailer import send_account_create_mail

# --- Traditional Signup Endpoint ---
def sign_up():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        existing_profile = UserModel.get_user_by_email(email)
        if existing_profile:
            return jsonify({"error": "Email already exists. Please sign in."}), 400

        # Create user data dict
        user_data = {
            "name": name,
            "email": email,
            "password": password
        }
        send_account_create_mail(name,email)
        profile_id = UserModel.create_user(user_data)
        return jsonify({
            "success": True,
            "message": "User created successfully.",
            "profile_id": profile_id
        }), 200

    except Exception as e:
        # Log the exception details to the console
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

 