# Physics Platform Backend

This is the Python-based backend for the physics learning platform, built with FastAPI and SQLite. It provides the core APIs for the skill map, case-based learning, LLM gap analysis, and the Netflix-like scoring system.

## Stack
- **Python 3.9+**
- **FastAPI** (Web framework)
- **SQLAlchemy** (ORM)
- **SQLite** (Database)

## Setup Instructions

1. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   .\\venv\\Scripts\\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install requirements:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   # If the venv is active and correctly linked
   uvicorn main:app --reload
   
   # Or alternatively explicitly call the venv's uvicorn on Windows:
   .\\venv\\Scripts\\uvicorn.exe main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

## API Endpoints

Once running, you can explore and test the interactively documented API at [http://localhost:8000/docs](http://localhost:8000/docs).

- `GET /api/skills`: Fetches the skill map. Seeded with default skills on first run.
- `GET /api/progress/{user_id}`: Gets the mastery scores and statuses for a specific user.
- `GET /api/cases/{skill_id}`: Retrieves the cases (questions) available for a specific skill.
- `POST /api/assess`: Submits a user's answer to a case, mocking an LLM gap analysis (MiniMax/AWS) and updating their progress map with mastery score.
- `GET /api/recommendations/{user_id}`: Retrieves targeted "Netflix-like" recommendations for what to study next (Review, Next for you, Ready to master).

## Connecting to React Frontend

The API is configured with CORS enabled for all origins (`*`) by default to make local development painless.

Example React fetch call:
```javascript
fetch("http://localhost:8000/api/skills")
  .then(res => res.json())
  .then(data => console.log("Skills:", data));
```

## Next Steps for LLM Integation
To swap the mock LLM with an actual provider (like MiniMax), update the `LLMService.analyze_answer` method in `llm_service.py` to make actual API calls with your API keys.
