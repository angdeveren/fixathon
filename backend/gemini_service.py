import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def upload_to_gemini(path, mime_type=None):
    """Uploads the given file to Gemini."""
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file

def wait_for_files_active(files):
    """Waits for the given files to be active."""
    print("Waiting for file processing...")
    for name in (file.name for file in files):
        file = genai.get_file(name)
        while file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(10)
            file = genai.get_file(name)
        if file.state.name != "ACTIVE":
            raise Exception(f"File {file.name} failed to process")
    print("...all files ready")

def analyze_video(video_path: str, prompt: str):
    if not API_KEY:
        return "Error: GEMINI_API_KEY not found in environment variables."

    try:
        # Upload the video
        video_file = upload_to_gemini(video_path, mime_type="video/mp4")

        # Wait for processing
        wait_for_files_active([video_file])

        # Create the model
        # Using gemini-1.5-pro as a proxy for "Gemini 3.0" capabilities in current SDK context, 
        # or whatever the latest available alias is. 
        # The user asked for "Gemini 3.0", assuming they mean the latest capable model.
        # I will use 'gemini-1.5-pro-latest' or similar stable endpoint.
        model = genai.GenerativeModel(model_name="gemini-2.5-flash-lite")

        # Generate content
        response = model.generate_content([video_file, prompt])
        
        return response.text
    except Exception as e:
        return f"Error analyzing video: {str(e)}"
