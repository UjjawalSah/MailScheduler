import datetime
import logging
import re
import urllib.parse
import smtplib
from bson import ObjectId
import markdown
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from email.mime.image import MIMEImage


from apscheduler.schedulers.background import BackgroundScheduler
from model.config import db, fs  # 'fs' is your GridFS instance
from controller.email_config import EMAIL_CONFIG

# Use the configuration from EMAIL_CONFIG
SMTP_SERVER = EMAIL_CONFIG.get("smtp_server", "smtp.gmail.com")
SMTP_PORT = EMAIL_CONFIG.get("smtp_port", 587)
DEFAULT_SENDER = EMAIL_CONFIG.get("sender_email", "help.mailscheduler@gmail.com")
SMTP_PASSWORD = EMAIL_CONFIG.get("sender_password", "")

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Initialize BackgroundScheduler
scheduler = BackgroundScheduler()
scheduler.start()

# MongoDB collections
forms_collection = db['userdata']
email_schedules_collection = db['emailSchedules']


def schedule_email_from_form(form_id, account_email):
    logging.info(f"[INFO] Attempting to schedule email for formId: {form_id}")
    form_data = forms_collection.find_one({"formId": form_id})
    if not form_data:
        logging.error(f"[ERROR] No form data found for formId: {form_id}")
        return None

    if not account_email:
        logging.error("[ERROR] No account email provided.")
        return None

    form_data["accountEmail"] = account_email

    # Get sender from form data. Even if the key exists but is empty, fallback to DEFAULT_SENDER.
    sender = form_data.get("senderEmail", "").strip()
    if not sender:
        logging.warning("[WARNING] No sender provided in form data, using default SMTP sender.")
        sender = DEFAULT_SENDER

    recipient_emails = form_data.get("recipientEmails", [])
    if isinstance(recipient_emails, str):
        recipient_emails = [recipient_emails]

    if not recipient_emails:
        logging.error("[ERROR] Recipient emails are missing or invalid.")
        return None

    logging.info(f"[INFO] Recipient emails extracted: {recipient_emails}")

    schedule_dt_str = form_data.get("scheduledDateTime")
    if not schedule_dt_str:
        logging.error("[ERROR] No valid scheduled datetime provided in form data.")
        return None

    try:
        # Parse datetime string with 12-hour format (e.g., "2025-02-17 7:34 AM")
        schedule_dt = datetime.datetime.strptime(schedule_dt_str, "%Y-%m-%d %I:%M %p")
    except ValueError as e:
        logging.error(f"[ERROR] Error parsing scheduled datetime: {e}")
        return None

    if schedule_dt < datetime.datetime.now():
        logging.error("[ERROR] Scheduled time must be in the future.")
        return None

    # Generate a unique job id based on form_id and the schedule datetime.
    job_id = f"email_{form_id}_{schedule_dt.strftime('%Y%m%d%H%M%S')}"
    form_data["job_id"] = job_id

    try:
        # Schedule the job with the BackgroundScheduler
        scheduler.add_job(
            send_schedule_email,
            trigger="date",
            run_date=schedule_dt,
            args=[sender, recipient_emails, form_data],
            id=job_id,
            replace_existing=True
        )
        logging.info(f"[SUCCESS] Email scheduled for {schedule_dt_str} with job id: {job_id}")

        # Update or insert a record in the emailSchedules collection.
        email_schedules_collection.update_one(
            {"formId": form_id, "accountEmail": account_email},
            {
                "$set": {
                    "formId": form_id,
                    "emailStatus": "Scheduled",
                    "sender": sender,
                    "primaryRecipient": recipient_emails[0],
                    "openRate": 0,
                    "clickThroughRate": 0,
                    "accountEmail": account_email,
                    "job_id": job_id,
                    "scheduledDateTime": schedule_dt_str  # Save scheduled date/time as provided
                }
            },
            upsert=True
        )
        return job_id
    except Exception as e:
        logging.error(f"[ERROR] Scheduling failed: {e}")
        return None


def cancel_scheduled_email(form_id, account_email):
    """
    Cancels a scheduled email based on `formId` and `accountEmail`.
    """
    logging.info(f"[INFO] Attempting to cancel scheduled email for formId: {form_id}, accountEmail: {account_email}")

    if not form_id or not account_email:
        logging.error("[ERROR] Missing formId or accountEmail for cancellation.")
        return False

    # Find the job id associated with the given form and account.
    job_record = email_schedules_collection.find_one(
        {"formId": form_id, "accountEmail": account_email},
        {"job_id": 1}
    )

    if not job_record:
        logging.warning(f"[WARNING] No scheduled job found for formId: {form_id}, accountEmail: {account_email}")
        return False

    job_id = job_record.get("job_id")

    if job_id in [job.id for job in scheduler.get_jobs()]:
        scheduler.remove_job(job_id)
        email_schedules_collection.update_one(
            {"formId": form_id, "accountEmail": account_email},
            {"$set": {"emailStatus": "Cancelled"}}
        )
        logging.info(f"[SUCCESS] Email scheduling cancelled for formId: {form_id}, accountEmail: {account_email}")
        return True

    logging.warning(f"[WARNING] No active job found for formId: {form_id}, accountEmail: {account_email}")
    return False


def wrap_links_with_tracking(body, job_id):
    """
    Rewrites anchor tag hrefs in the HTML email body so that clicks are tracked.
    The original URL is URL‑encoded and passed as a parameter to the tracking endpoint.
    """
    def link_replacer(match):
        original_url = match.group(1)
        encoded_url = urllib.parse.quote(original_url, safe='')
        # Tracking URL that will record the click.
        tracking_url = f"http://localhost:5001/track_click?job_id={job_id}&url={encoded_url}"
        return f'href="{tracking_url}"'
    
    return re.sub(r'href="(http[s]?://[^"]+)"', link_replacer, body)


 

def send_schedule_email(sender, recipients, form_data):
    try:
        logging.info(f"[INFO] Preparing to send email to {recipients} from {sender}")

        if not sender:
            logging.warning("[WARNING] No sender email provided, using default SMTP sender.")
            sender = DEFAULT_SENDER

        subject = form_data.get("title", "No Subject")
        # Get the raw content (in markdown) from form_data.
        raw_content = form_data.get("content", "No Content Provided")
        # Convert markdown to HTML.
        converted_content = markdown.markdown(raw_content)

        job_id = form_data.get("job_id", "default_job_id")

        # Use a 1x1 pixel, fully transparent image for tracking.
        tracking_gif_tag = (
            '<img src="cid:track.gif" alt="" style="width:1px; height:1px; border:0; '
            'margin:0; padding:0; opacity:0;" />'
        )
        # Append the tracking image to the converted content.
        converted_content += tracking_gif_tag

        # Wrap the converted HTML content in a full HTML structure.
        html_body = f"""<html>
  <body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; margin: 20px;">
    <div>
      {converted_content}
    </div>
  </body>
</html>"""

        # Create a multipart message.
        msg = MIMEMultipart()
        msg["From"] = sender
        msg["To"] = ", ".join(recipients)
        msg["Subject"] = subject

        # Attach the formatted HTML body.
        msg.attach(MIMEText(html_body, "html"))

        # ... (rest of your code to attach images, files, etc.)

        logging.info(f"[INFO] Connecting to SMTP server: {SMTP_SERVER}")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            logging.info("[INFO] SMTP connection secured with STARTTLS")
            server.login(DEFAULT_SENDER, SMTP_PASSWORD)
            logging.info("[INFO] Logged into SMTP server successfully")
            server.sendmail(sender, recipients, msg.as_string())

        logging.info(f"[SUCCESS] Email successfully sent to {recipients} from {sender}")

        email_schedules_collection.update_one(
            {"job_id": job_id},
            {"$set": {"emailStatus": "Sent", "sentDateTime": datetime.datetime.now()}}
        )

        return True

    except Exception as e:
        logging.error(f"[ERROR] Email sending failed: {e}")
        job_id = form_data.get("job_id", "default_job_id")
        email_schedules_collection.update_one(
            {"job_id": job_id},
            {"$set": {"emailStatus": "Failed", "sentDateTime": datetime.datetime.now()}}
        )
        return False
