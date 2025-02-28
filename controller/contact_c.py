from flask import request, jsonify
from model.contact import ContactModel
from controller.emailer import send_thank_you_email

def submit_contact():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'Missing required fields'}), 400

        # Save data via Model
        ContactModel.save_contact({
            'name': name,
            'email': email,
            'message': message
        })

        print(f"Data saved successfully for {name}. Sending email...")  # Add logging

        # Send thank you email
        send_thank_you_email(name, email)

        print("Email sent (or failed). Returning response...")  # Add logging

        return jsonify({'success': True, 'message': 'Message received successfully'}), 200
    except Exception as e:
        print(f"Error in submit_contact: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 500
