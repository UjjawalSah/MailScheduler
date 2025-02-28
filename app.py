from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.contact_c import submit_contact
from controller.signup_c import sign_up
from controller.otp_controller import otp_bp
from controller.signin_c import sign_in
from controller.forget_password import forgot_password
from controller.userdata_controller import submit_form



app = Flask(__name__)

# Enable CORS for your desired origin
CORS(app, supports_credentials=True, origins=["http://localhost:8080"])

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:8080"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

app.secret_key = "your_secret_key"  # Required for session management

# Define your routes
app.route('/api/submit_contact', methods=['POST'])(submit_contact)
app.route('/signup', methods=['POST'])(sign_up)
app.register_blueprint(otp_bp)
app.route("/api/signin", methods=["POST"])(sign_in)
app.route('/api/generate', methods=['POST', 'OPTIONS'])
app.add_url_rule('/forgot-password', view_func=forgot_password, methods=['POST'])
app.route('/api/submit-form', methods=['POST'])(submit_form)
 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
