from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from gemini_service import analyze_video

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Freedom Sky Command Backend is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Analyze with Gemini
        result = analyze_video(file_location, prompt)
        
        # Clean up (optional, maybe keep for debug)
        # os.remove(file_location)
        
        return {"filename": file.filename, "analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
