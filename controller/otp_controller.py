from flask import Blueprint, request, jsonify
import random
from controller.emailer import send_otp_email
from model.config import db  # Import db directly

users_collection = db["users"]  # Use the users collection

def generate_otp():
    """Generate a random 6-digit OTP."""
    return random.randint(100000, 999999)

# Create a Blueprint for OTP-related endpoints.
otp_bp = Blueprint("otp", __name__)

@otp_bp.route('/send_otp_email', methods=['POST'])
def send_otp_email_endpoint():
    """Handles OTP generation and email sending."""
    data = request.get_json()
    name, email = data.get("name"), data.get("email")

    if not name or not email:
        return jsonify({"success": False, "error": "Missing name or email"}), 400

    otp = generate_otp()
    send_otp_email(name, email, otp)

    user_data = {
        "name": name,
        "email": email,
        "otp": str(otp),
        "is_verified": False
    }
    users_collection.update_one({"email": email}, {"$set": user_data}, upsert=True)

    return jsonify({"success": True, "message": "OTP sent to your email"}), 200

@otp_bp.route('/verify_otp', methods=['POST'])
def verify_otp():
    """Verifies the OTP entered by the user."""
    data = request.get_json()
    email, otp_input = data.get("email"), data.get("otp")

    if not email or not otp_input:
        return jsonify({"error": "Missing email or OTP"}), 400

    user = users_collection.find_one({"email": email})
    if not user or str(user.get("otp")) != str(otp_input):
        return jsonify({"error": "Invalid OTP"}), 400

    users_collection.update_one({"email": email}, {"$set": {"is_verified": True, "otp": None}})

    return jsonify({"success": True, "message": "Email verified successfully"}), 200
