# email_utils.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from controller.email_config import EMAIL_CONFIG
import logging

def send_thank_you_email(name, recipient_email):
    # Email configuration
    sender_email = EMAIL_CONFIG['sender_email']
    sender_password = EMAIL_CONFIG['sender_password']
    smtp_server = EMAIL_CONFIG['smtp_server']
    smtp_port = EMAIL_CONFIG['smtp_port']

    print(f"Preparing to send thank-you email to {recipient_email}...")  # Logging
    print(f"Sender: {sender_email}, SMTP Server: {smtp_server}, Port: {smtp_port}")  # Logging

    # Create the email content
    subject = "Thank You for Contacting Us"
    body = f"""
    <html>
    <head>
      <style>
        .email-container {{
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }}
        .email-header {{
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-align: center;
        }}
        .email-body {{
          padding: 20px;
        }}
        .email-footer {{
          background-color: #f1f1f1;
          padding: 10px;
          text-align: center;
          font-size: 12px;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Thank You, {name}!</h1>
        </div>
        <div class="email-body">
          <p>Dear {name},</p>
          <p>Thank you for reaching out to us. We appreciate your interest and will get back to you as soon as possible.</p>
          <p>Best regards,<br>MailScheduler</p>
        </div>
        <div class="email-footer">
          <p>© 2025 MailScheduler. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    """

    # Set up the MIME message
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))

    # Send the email
    try:
        print("Connecting to SMTP server...")  # Logging
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        print("Logging in to SMTP server...")  # Logging
        server.login(sender_email, sender_password)
        print("Sending thank-you email...")  # Logging
        server.send_message(message)
        server.quit()
        print(f"Thank-you email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"Failed to send thank-you email to {recipient_email}. Error: {str(e)}")


def send_otp_email(name, recipient_email, otp):
    """
    Sends an OTP email to the user for email verification.
    Generates a random OTP and sends it to the recipient's email.
    :param name: The name of the user.
    :param recipient_email: The recipient's email address.
    :return: The generated OTP.
    """
    

    # Email configuration
    sender_email = EMAIL_CONFIG['sender_email']
    sender_password = EMAIL_CONFIG['sender_password']
    smtp_server = EMAIL_CONFIG['smtp_server']
    smtp_port = EMAIL_CONFIG['smtp_port']

    print(f"Preparing to send OTP email to {recipient_email}...")  # Logging
    print(f"Sender: {sender_email}, SMTP Server: {smtp_server}, Port: {smtp_port}")  # Logging

    # Create the email content for OTP verification
    subject = "Your OTP Code for Email Verification"
    body = f"""
    <html>
    <head>
      <style>
        .email-container {{
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }}
        .email-header {{
          background-color: #FFA500;
          color: white;
          padding: 10px;
          text-align: center;
        }}
        .email-body {{
          padding: 20px;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h2>Email Verification</h2>
        </div>
        <div class="email-body">
          <p>Hello, {name}</p>
          <p>Your OTP code for email verification is: <strong>{otp}</strong></p>
          <p>Please use this code to complete your email verification.</p>
        </div>
      </div>
    </body>
    </html>
    """

    # Set up the MIME message
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))

    # Send the OTP email
    try:
        print("Connecting to SMTP server for OTP email...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        print("Logging in to SMTP server for OTP email...")
        server.login(sender_email, sender_password)
        print("Sending OTP email...")
        server.send_message(message)
        server.quit()
        print(f"OTP email sent successfully to {recipient_email}")
        return otp
    except Exception as e:
        print(f"Failed to send OTP email to {recipient_email}. Error: {str(e)}")
        raise
def send_account_create_mail(name: str, recipient_email: str):
    """
    Sends a congratulatory account creation email to the recipient.
    
    :param name: The recipient's name.
    :param recipient_email: The recipient's email address.
    """
    # === Email and SMTP server configuration ===
    sender_email = EMAIL_CONFIG['sender_email']
    sender_password = EMAIL_CONFIG['sender_password']
    smtp_server = EMAIL_CONFIG['smtp_server']
    smtp_port = EMAIL_CONFIG['smtp_port']                               

    # === Email Subject ===
    subject = "Congratulations on Creating Your Account!"

    # === Create the MIMEMultipart message ===
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = recipient_email

    # === Create an HTML version of your message ===
    html_content = f"""
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }}
          .container {{
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }}
          .header {{
            text-align: center;
            color: #4CAF50;
          }}
          .content {{
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
          }}
          .footer {{
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777777;
          }}
          .button {{
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="header">Congratulations, {name}!</h2>
          <div class="content">
            <p>Thank you for creating an account with us. We are excited to have you on board and look forward to providing you with the best service possible.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Enjoy your experience!</p>
          </div>
          <div class="footer">
            <p>Best Regards,<br>Your Company Team</p>
          </div>
        </div>
      </body>
    </html>
    """

    # Create a MIMEText object for the HTML content.
    mime_text = MIMEText(html_content, "html")
    message.attach(mime_text)

    # === Send the email using SMTP with TLS ===
    try:
        # Connect to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        print("Account creation email sent successfully to", recipient_email)
    except Exception as e:
        print("Error sending account creation email:", e)
# Example usage:
# send_thank_you_email("John Doe", "john.doe@example.com")
# send_otp_email("John Doe", "john.doe@example.com", 123456)
# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
DEFAULT_SENDER = EMAIL_CONFIG.get("sender_email", "")
SMTP_PASSWORD = EMAIL_CONFIG.get("sender_password", "")

 