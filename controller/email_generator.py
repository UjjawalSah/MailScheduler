from flask import Blueprint, request, jsonify
import requests

email_generator_bp = Blueprint("email_generator", __name__, url_prefix="/api")

# Hugging Face API configuration.
HF_API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it"
HF_API_TOKEN = "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"  # Replace with your actual token.

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}"
}

@email_generator_bp.route("/generate-email", methods=["POST"])
def generate_email():
    data = request.get_json()
    user_prompt = data.get("prompt", "").strip()  # User enters the complete prompt

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Use the user-provided prompt directly.
    payload = {"inputs": user_prompt}

    # Log the prompt being sent.
    print("DEBUG: Sending prompt to Hugging Face API:")
    print(user_prompt)

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        print("DEBUG: Received response with status code:", response.status_code)
        print("DEBUG: Response text:", response.text)
    except Exception as e:
        print("ERROR: Exception when calling Hugging Face API:", str(e))
        return jsonify({"error": "Error calling Hugging Face API", "details": str(e)}), 500

    if response.status_code == 200:
        result = response.json()
        print("DEBUG: Parsed JSON result:", result)
        if isinstance(result, list) and result and "generated_text" in result[0]:
            generated_text = result[0]["generated_text"]
            print("DEBUG: Generated text:", generated_text)

            # Remove any additional notes if present.
            note_delimiters = ["**Notes:**", "**Please note**:"]
            delimiter_index = None
            for delimiter in note_delimiters:
                index = generated_text.find(delimiter)
                if index != -1:
                    if delimiter_index is None or index < delimiter_index:
                        delimiter_index = index
            if delimiter_index is not None:
                generated_text = generated_text[:delimiter_index].strip()
                print("DEBUG: Removed text after note delimiter; cleaned text:", generated_text)

            # Remove subject line if present.
            subject_delimiter = "Subject:"
            if generated_text.startswith(subject_delimiter):
                lines = generated_text.splitlines()
                # Skip the subject line and any following blank lines.
                i = 0
                if lines and lines[0].startswith(subject_delimiter):
                    i = 1
                    while i < len(lines) and lines[i].strip() == "":
                        i += 1
                email_body = "\n".join(lines[i:]).strip()
                print("DEBUG: Removed subject line; email body:", email_body)
            else:
                # Fallback: if "Dear" exists, use it to start the email body.
                index = generated_text.find("Dear")
                if index != -1:
                    email_body = generated_text[index:].strip()
                    print("DEBUG: Found 'Dear'; email body:", email_body)
                else:
                    email_body = generated_text.strip()
                    print("DEBUG: 'Dear' not found; using full generated text as email body:", email_body)

            return jsonify({"generatedContent": email_body})
        else:
            print("ERROR: Unexpected response structure from Hugging Face API:", result)
            return jsonify({"error": "Unexpected response from Hugging Face API", "data": result}), 500
    else:
        print("ERROR: Failed to generate email; response status code:", response.status_code)
        return jsonify({
            "error": "Failed to generate email",
            "status_code": response.status_code,
            "data": response.text
        }), response.status_code
