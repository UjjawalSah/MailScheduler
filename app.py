from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.contact_c import submit_contact
from controller.signup_c import sign_up
from controller.otp_controller import otp_bp
from controller.signin_c import sign_in
from controller.userdata_controller import submit_form
from controller.bot import query_huggingface
from controller.track import tracking_bp
from controller.email_history import email_history_bp
from controller.dashboard_data import get_email_summary
from controller.forget_password import forgot_password
import pandas as pd
import pickle

app = Flask(__name__)

# Enable CORS for your desired origin
CORS(app, supports_credentials=True)

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
app.route('/api/signup', methods=['POST'])(sign_up)
app.register_blueprint(otp_bp)
app.route("/api/signin", methods=["POST"])(sign_in)
app.route("/api/submit-form", methods=["POST"])(submit_form)
app.register_blueprint(tracking_bp)
# Register the generate endpoint with its function
app.route('/api/generate', methods=['POST', 'OPTIONS'])(lambda: generate())
app.register_blueprint(email_history_bp)
app.route('/api/dashboard-data', methods=['GET'])(get_email_summary)
app.add_url_rule('/api/forgot-password', view_func=forgot_password, methods=['POST'])

# Load the processed DataFrame from df_model.pkl (for analytics)
df = pd.read_pickle('controller/df_model.pkl')

# Load the trained RandomForestRegressor model from rf_reg_model.pkl (for predictions)
with open('controller/rf_reg_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/analytics', methods=['GET'])
def analytics():
    # 1. Engagement by Day (using 'day_of_week' column)
    engagement_by_day = df.groupby('day_of_week')['click_rate'].mean().reset_index().to_dict(orient='records')
    
    # 2. Engagement by Time using one-hot encoded times of day
    engagement_by_time = []
    if 'times_of_day_Morning' in df.columns:
        morning = df[df['times_of_day_Morning'] == 1]['click_rate'].mean()
        engagement_by_time.append({'times_of_day': 'Morning', 'click_rate': morning})
    if 'times_of_day_Noon' in df.columns:
        noon = df[df['times_of_day_Noon'] == 1]['click_rate'].mean()
        engagement_by_time.append({'times_of_day': 'Noon', 'click_rate': noon})
    
    # 3. Subject Length vs. Click Rate (sample 100 rows)
    subject_vs_click = df[['subject_len', 'click_rate']].sample(n=100, random_state=42).to_dict(orient='records')
    
    # 4. Sender Analysis: Check if 'sender' exists; if not, return an empty list.
    if 'sender' in df.columns:
        sender_stats = df.groupby('sender').agg({'click_rate': ['mean', 'count']})
        sender_stats.columns = ['avg_click_rate', 'campaign_count']
        sender_stats = sender_stats.reset_index().to_dict(orient='records')
    else:
        sender_stats = []
    
    # 5. Category Engagement: Compute for each one-hot encoded category column.
    category_cols = [col for col in df.columns if col.startswith("category_")]
    category_engagement = []
    for col in category_cols:
        avg_click = df[df[col] == 1]['click_rate'].mean()
        # Remove the prefix to get the actual category value.
        category_engagement.append({'category': col.replace("category_", ""), 'click_rate': avg_click})
    
    # 6. Product Engagement: Compute for each one-hot encoded product column.
    product_cols = [col for col in df.columns if col.startswith("product_")]
    product_engagement = []
    for col in product_cols:
        avg_click = df[df[col] == 1]['click_rate'].mean()
        product_engagement.append({'product': col.replace("product_", ""), 'click_rate': avg_click})
    
    analytics_data = {
        'engagement_by_day': engagement_by_day,
        'engagement_by_time': engagement_by_time,
        'subject_vs_click': subject_vs_click,
        'sender_stats': sender_stats,
        'category_engagement': category_engagement,
        'product_engagement': product_engagement
    }
    return jsonify(analytics_data)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    features = data.get('features')
    if features is None:
        return jsonify({'error': 'No features provided'}), 400
    
    # Expect features to be a list of numbers in the same order as used in training.
    prediction = model.predict([features])
    return jsonify({'prediction': prediction[0]})

def generate():
    # Handle OPTIONS preflight requests
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json() or {}
    input_text = data.get("input_text", "")
    response_text = query_huggingface(input_text)
    return jsonify({"response": response_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
