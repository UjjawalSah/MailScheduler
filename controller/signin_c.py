from flask import request, jsonify, make_response, session
from model.config import db  # Importing db from config.py
from controller.session import set_session_email, get_session_email

user_collection = db["usersprofile"]

 

def sign_in():
    try:
        print("Received request to sign in.")

        # Parse request data
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return make_response(jsonify({"error": "Email and Password are required"}), 400)

        print(f"Checking credentials for email: {email}")

        # Query MongoDB for the user
        user_data = user_collection.find_one({"email": email})

        if not user_data:
            return make_response(jsonify({"error": "Invalid email or password"}), 401)

        # Retrieve stored password (since no hashing is used)
        stored_password = user_data.get("password")

        # Verify Password (Direct comparison)
        if stored_password != password:
            return make_response(jsonify({"error": "Invalid email or password"}), 401)

        # Retrieve the user name
        user_name = user_data.get("name", "User")
        set_session_email(email)
        print("session data:",get_session_email())  # This should now print the email you just set.


         

        # Return the user's details
        return make_response(jsonify({
            "message": "Sign-in successful",
            "user": {
                "fullName": user_name,
                "email": email
            }
        }), 200)

    except Exception as e:
        print(f"Error during sign-in: {str(e)}")
        return make_response(jsonify({"error": "An unexpected error occurred"}), 500)
