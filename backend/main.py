from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import models, schemas
from database import engine, get_db
from llm_service import llm_service

from fastapi.staticfiles import StaticFiles
import os
from agent import generate_animation_plan, generate_manim_code, fix_manim_code, get_premade_animation
from manim_runner import run_manim_script, ManimExecutionError

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Physics Platform API")

# Mount media directories
os.makedirs("media_output/media", exist_ok=True)
os.makedirs("Manim video", exist_ok=True)

app.mount("/media", StaticFiles(directory="media_output/media"), name="media")
app.mount("/manim_videos", StaticFiles(directory="Manim video"), name="manim_videos")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH API ---

@app.post("/api/signup", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user and initialize blank progress for all skills."""
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = models.User(username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Initialize blank progress for all skills
    skills = db.query(models.Skill).all()
    for s in skills:
        db.add(models.UserProgress(user_id=new_user.id, skill_id=s.id, status="Not started", mastery_score=0.0))
    db.commit()
    
    return new_user

@app.post("/api/login", response_model=schemas.UserResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Simple login by checking if user exists."""
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- SKILLS API ---

@app.get("/api/skills", response_model=List[schemas.Skill])
def read_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve skill map"""
    skills = db.query(models.Skill).offset(skip).limit(limit).all()
    # Seed data if empty for demo purposes
    if not skills:
        demo_skills = [
            models.Skill(name="Slope from graph", description="Calculating slope using rise over run from a given graph."),
            models.Skill(name="Slope in physics", description="Understanding what slope represents (e.g., velocity from position-time graph)."),
            models.Skill(name="Differentiation Basics", description="Connecting the concept of slope to the mathematical derivative.")
        ]
        db.add_all(demo_skills)
        db.commit()
        skills = db.query(models.Skill).offset(skip).limit(limit).all()
        
    # Always ensure test user exists and has mock varied data for the UI
    user = db.query(models.User).filter(models.User.username == "student1").first()
    if not user:
        user = models.User(username="student1")
        db.add(user)
        db.commit()
        db.refresh(user)
        
    progresses = db.query(models.UserProgress).filter(models.UserProgress.user_id == user.id).all()
    mock_progress_data = [
        {"status": "Mastered", "score": 0.95},
        {"status": "In progress", "score": 0.60},
        {"status": "Not started", "score": 0.0},
    ]
    
    if not progresses:
        for i, s in enumerate(skills):
            mp = mock_progress_data[i % len(mock_progress_data)]
            db.add(models.UserProgress(user_id=user.id, skill_id=s.id, status=mp["status"], mastery_score=mp["score"]))
        db.commit()
    else:
        # If progress exists but is completely empty (from old code), update it to show UI examples
        if all(p.status == "Not started" for p in progresses):
            for i, p in enumerate(progresses):
                mp = mock_progress_data[i % len(mock_progress_data)]
                p.status = mp["status"]
                p.mastery_score = mp["score"]
            db.commit()
            
    return skills

# --- USER PROGRESS ---

@app.get("/api/progress/{user_id}", response_model=List[schemas.UserProgressResponse])
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Get the mastery scores and status for all skills for a user"""
    progress_records = db.query(models.UserProgress).filter(models.UserProgress.user_id == user_id).all()
    
    result = []
    for p in progress_records:
        result.append(schemas.UserProgressResponse(
            skill_id=p.skill_id,
            skill_name=p.skill.name,
            status=p.status,
            mastery_score=p.mastery_score
        ))
    return result

# --- CASES API ---

@app.get("/api/cases/{skill_id}", response_model=List[schemas.Case])
def get_cases_for_skill(skill_id: int, db: Session = Depends(get_db)):
    """Get cases based on chosen skill"""
    cases = db.query(models.Case).filter(models.Case.skill_id == skill_id).all()
    
    # Seed data if empty
    if not cases:
        skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
            
        demo_cases = [
            models.Case(skill_id=skill_id, title="Position vs time", description="A car moves away from a stoplight.", question="What is the slope of this line? What does it represent?"),
            models.Case(skill_id=skill_id, title="Velocity vs time", description="A rocket accelerates upwards.", question="Calculate the slope. What physical quantity is this?")
        ]
        if "physics" not in skill.name.lower():
            demo_cases = [
                 models.Case(skill_id=skill_id, title="Two points on a line", description="Points are (2, 4) and (5, 10).", question="What is the slope between these two points?"),
                 models.Case(skill_id=skill_id, title="Ramp and block", description="A block sliding down a 30 degree incline.", question="What is the horizontal rate of change of the block's given trajectory?")
            ]
        db.add_all(demo_cases)
        db.commit()
        cases = db.query(models.Case).filter(models.Case.skill_id == skill_id).all()

    return cases

# --- ASSESSMENTS API ---

@app.post("/api/assess", response_model=schemas.AssessmentResponse)
def assess_answer(assessment: schemas.AssessmentSubmit, db: Session = Depends(get_db)):
    """Submit an answer to a case, triggers LLM gap analysis"""
    case = db.query(models.Case).filter(models.Case.id == assessment.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    user = db.query(models.User).filter(models.User.id == assessment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Trigger LLM analysis
    analysis_result = llm_service.analyze_answer(
        case_title=case.title,
        question=case.question,
        user_answer=assessment.user_answer
    )
    
    # Save assessment record
    db_assessment = models.Assessment(
        user_id=assessment.user_id,
        case_id=assessment.case_id,
        user_answer=assessment.user_answer,
        llm_feedback=analysis_result["feedback"],
        llm_score=analysis_result["score"]
    )
    db.add(db_assessment)
    
    # Update user progress based on LLM score
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == assessment.user_id,
        models.UserProgress.skill_id == case.skill_id
    ).first()
    
    if progress:
        # Simple algorithm to update mastery: EMA (Exponential Moving Average)
        progress.mastery_score = (progress.mastery_score * 0.7) + (analysis_result["score"] * 0.3)
        
        if progress.mastery_score >= 0.8:
            progress.status = "Mastered"
        elif progress.mastery_score > 0:
            progress.status = "In progress"
            
    db.commit()
    db.refresh(db_assessment)
    
    return db_assessment

class ChatMessage(BaseModel):
    role: str
    content: str
    name: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    """Generic chat completion using OpenRouter"""
    # Convert Pydantic models to dicts for the service
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    
    # We strictly omit 'name' from the message payload because some OpenRouter 
    # models will reject the request if it contains unexpected fields.
            
    reply = llm_service.chat(messages)
    return {"reply": reply}

# --- RECOMMENDATIONS API ---

@app.get("/api/recommendations/{user_id}", response_model=List[schemas.RecommendationResponse])
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Get Netflix-like scoring recommendations for a user"""
    user_progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == user_id).all()
    skills = db.query(models.Skill).all()
    
    if not user_progress or not skills:
        return []
        
    recommendations = llm_service.generate_recommendations(user_progress, cases=[], skills=skills)
    return recommendations

# --- AI ANIMATION CHATBOT API ---

class QuestionRequest(BaseModel):
    question: str
    
class RenderRequest(BaseModel):
    code: str
    plan: str

@app.post("/api/generate_plan")
async def generate_plan(request: QuestionRequest):
    try:
        plan = generate_animation_plan(request.question)
        return {"plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate_code")
async def generate_code(request: QuestionRequest):
    try:
        code = generate_manim_code(request.question)
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/render_video")
async def render_video(request: RenderRequest):
    current_code = request.code
    plan = request.plan
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            video_path = run_manim_script(current_code)
            # Convert local path to a URL path
            path_parts = video_path.split("media_output")[-1].replace("\\", "/")
            return {"video_url": path_parts, "final_code": current_code, "retries": attempt}
        except ManimExecutionError as e:
            print(f"Attempt {attempt + 1} failed. Error: {e.stderr}")
            if attempt < max_retries - 1:
                print("Attempting LLM self-correction...")
                try:
                    current_code = fix_manim_code(plan, current_code, e.stderr)
                except Exception as llm_e:
                    raise HTTPException(status_code=500, detail=f"LLM Self-correction failed: {str(llm_e)}")
            else:
                raise HTTPException(status_code=500, detail=f"Failed to render after {max_retries} attempts. Last error: {e.stderr}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/get_animation")
async def get_animation(request: QuestionRequest):
    try:
        result = get_premade_animation(request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

