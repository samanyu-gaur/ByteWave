# ByteWave - AI Physics Tutor

This is a full-stack web application containing a React Vite frontend and a Python FastAPI backend that renders physics animations using Manim via the Deepseek LLM.

## Repository Structure

- `/frontend` 
  - Contains the entire React application (Vite).
  - **Deploy to Vercel**: Set Vercel's **Root Directory** setting to `frontend` so it knows where to build.
- `/backend`
  - Contains the FastAPI + Manim python application.
  - Powered by Deepseek for code generation.
  - **Deploy to Render**: Deploy this folder as a **Docker** web service using the provided Dockerfile, because Manim needs system libraries (ffmpeg, LaTeX).
- `/archive`
  - Old, deprecated files.
- `/media_output`
  - Where the backend temporally saves generated `.mp4` Manim videos. Ignored in Git.

## Running Locally

**1. Backend**
```bash
cd backend
# Make sure DEEPSEEK_API_KEY is placed inside backend/.env
# On windows, sometimes you need to run using the python module:
$env:PYTHONPATH = ".\"; .\venv\Scripts\python -m uvicorn main:app --reload
```

**2. Frontend**
```bash
cd frontend
npm run dev
```
