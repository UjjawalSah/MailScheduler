import uuid
from flask import request, jsonify, session
from model.userdata_model import save_to_mongodb
from model.config import db, fs  # MongoDB and GridFS instances
from controller.scheduler import schedule_email_from_form  # Function to trigger email scheduling
from controller.session import get_session_email

def submit_form():
    try:
        # Capture all form fields, ensuring correct formatting
        form_fields = request.form.to_dict(flat=False)
        form_data = {key: value[0] if len(value) == 1 else value for key, value in form_fields.items()}

        # Extract required fields from form data
        account_name = form_data.get("accountName")
        account_email = form_data.get("accountEmail")
        recipient_emails = request.form.getlist("recipientEmails[]")  # Ensure it's an array

        if not account_name or not account_email:
            return jsonify({"error": "User not logged in. Missing account details."}), 401

        # Debug: Print extracted recipient emails
        print(f"[DEBUG] Extracted recipientEmails: {recipient_emails}")

        if not recipient_emails or not all(recipient_emails):
            return jsonify({"error": "Recipient emails are missing or invalid."}), 400

        # Add recipient emails explicitly to form_data
        form_data["recipientEmails"] = recipient_emails  

        # Process file uploads using GridFS
        uploaded_files = []
        if "files" in request.files:
            for file in request.files.getlist("files"):
                if file.filename:
                    file_id = fs.put(file, filename=file.filename)
                    uploaded_files.append(str(file_id))
        form_data["files"] = uploaded_files

        # Generate a unique form ID and add it to form_data
        form_id = str(uuid.uuid4())
        form_data["formId"] = form_id

        # Debug: Print final form data before saving
        print(f"[DEBUG] Final form_data before saving: {form_data}")

        # Save the complete user data to MongoDB
        success, message = save_to_mongodb("userdata", form_data)
        if not success:
            return jsonify({"error": f"Failed to save form data: {message}"}), 500

        # Attempt to get the email from the session.
        # If it's not available, fall back to the account_email from the form.
        passed_email = get_session_email() or account_email

        # Now pass the email explicitly to the scheduler
        scheduler_response = schedule_email_from_form(form_id, passed_email)
        if not scheduler_response:
            return jsonify({"error": "Failed to schedule email"}), 500

        print(f"[INFO] Scheduler response for formId {form_id}: {scheduler_response}")

        return jsonify({
            "message": "Form submitted successfully",
            "formId": form_id,
            "schedulerResponse": scheduler_response
        }), 200

    except Exception as e:
        print(f"[ERROR] Exception occurred: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
