import urllib.parse
import logging
from flask import Blueprint, request, redirect, Response
from model.config import db

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

tracking_bp = Blueprint('tracking', __name__)

# Use the emailSchedules collection for updating tracking counters.
email_schedules_collection = db['emailSchedules']

@tracking_bp.route('/track_open')
def track_open():
    """
    Increments the openRate counter for the email with the provided job_id,
    then returns the custom track.gif. If there's no job_id or no matching job,
    it logs 'no open rates response'.
    """
    job_id = request.args.get('job_id')
    if not job_id:
        logging.error("track_open: No job_id provided. No open rates response")
    else:
        try:
            result = email_schedules_collection.update_one(
                {"job_id": job_id},
                {"$inc": {"openRate": 1}}
            )
            if result.matched_count > 0:
                logging.info(f"track_open: Email opened - job_id {job_id}. Matched: {result.matched_count}, Modified: {result.modified_count}")
            else:
                logging.warning(f"track_open: Email not found for job_id {job_id}. Matched: {result.matched_count}. No open rates response")
        except Exception as e:
            logging.error(f"track_open: Error updating openRate for job_id {job_id}: {e}")
            logging.info("track_open: No open rates response")

    # Return the custom track.gif for email open tracking.
    try:
        with open("controller/track.gif", "rb") as gif_file:
            gif_data = gif_file.read()
        return Response(gif_data, mimetype='image/gif')
    except FileNotFoundError:
        logging.error("track_open: track.gif file not found")
        return "Error: track.gif not found", 404
    except Exception as e:
        logging.error(f"track_open: Error reading track.gif: {e}")
        return "Error reading track.gif", 500


@tracking_bp.route('/track_click')
def track_click():
    """
    Increments the clickThroughRate counter for the email with the provided job_id,
    then decodes the destination URL and redirects the user to it.
    """
    job_id = request.args.get('job_id')
    encoded_url = request.args.get('url')
    if not job_id or not encoded_url:
        logging.error("track_click: Missing job_id or url")
        return "Invalid request", 400

    try:
        result = email_schedules_collection.update_one(
            {"job_id": job_id},
            {"$inc": {"clickThroughRate": 1}}
        )
        logging.info(f"track_click: job_id {job_id} - Matched: {result.matched_count}, Modified: {result.modified_count}")
    except Exception as e:
        logging.error(f"track_click: Error updating clickThroughRate for job_id {job_id}: {e}")
        return "Error tracking click", 500

    actual_url = urllib.parse.unquote(encoded_url)
    logging.info(f"track_click: Redirecting to {actual_url}")
    return redirect(actual_url)
