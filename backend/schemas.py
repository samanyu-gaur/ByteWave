from pydantic import BaseModel
from typing import List, Optional

class SkillBase(BaseModel):
    name: str
    description: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    description: str
    question: str

class CaseCreate(CaseBase):
    skill_id: int

class Case(CaseBase):
    id: int
    skill_id: int

    class Config:
        from_attributes = True

class AssessmentSubmit(BaseModel):
    user_id: int
    case_id: int
    user_answer: str

class AssessmentResponse(BaseModel):
    id: int
    user_id: int
    case_id: int
    user_answer: str
    llm_feedback: str
    llm_score: float

    class Config:
        from_attributes = True

class ProgressBase(BaseModel):
    status: str
    mastery_score: float

class UserProgressResponse(ProgressBase):
    skill_id: int
    skill_name: str

    class Config:
        from_attributes = True
        
class RecommendationResponse(BaseModel):
    recommendation_type: str # "Next for you", "Review", "Ready to master"
    item_id: int # Could be skill_id or case_id
    item_name: str
    match_score: float # e.g. 0.85 for 85% match
    reason: str
