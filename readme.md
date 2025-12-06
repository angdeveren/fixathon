# Freedom Sky Command - Autonomous Surveillance System

This application is a containerized solution for autonomous video surveillance analysis using Google's Gemini 3.0 (via Gemini 1.5 Pro API) and a modern "Lovable" style UI.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (Dark, futuristic UI)
- **Backend**: FastAPI + Google Gemini AI SDK
- **Infrastructure**: Docker & Docker Compose

## Prerequisites

- Docker & Docker Compose installed.
- A Google Gemini API Key.

## Setup & Running

1.  **Configure API Key**:
    Open the `.env` file in the root directory and add your Gemini API Key:
    ```bash
    GEMINI_API_KEY=your_actual_api_key_here
    ```

2.  **Start the Application**:
    Run the following command in the root directory:
    ```bash
    docker compose up --build
    ```

3.  **Access the App**:
    - **Frontend (UI)**: Open [http://localhost:5173](http://localhost:5173) in your browser.
    - **Backend (API)**: Running at [http://localhost:8000](http://localhost:8000).

## Usage

1.  Open the UI.
2.  Upload a local video file (drag & drop or click to select).
3.  (Optional) Edit the analysis prompt.
4.  Click "Initialize Analysis".
5.  Wait for the AI to process the video and generate a surveillance report.

## Development

- **Frontend Code**: Located in `frontend/src/`.
- **Backend Code**: Located in `backend/`.
- **Videos**: Uploaded videos are temporarily stored in `backend/videos/`.

## Notes

- The application uses `gemini-1.5-pro` as the underlying model for high-reasoning video analysis.
- Ensure your API key has access to the Generative AI API.
