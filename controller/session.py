from flask import session

def set_session_email(email):
    """Stores the given email in session."""
    session.permanent = True  # Makes session persist
    session['email'] = email

def get_session_email():
    """Retrieves the email from session."""
    return session.get('email')
