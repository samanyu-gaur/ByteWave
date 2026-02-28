from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    
    # Progress and relations
    progress = relationship("UserProgress", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g. "Slope from graph", "Slope in physics"
    description = Column(String)
    
    cases = relationship("Case", back_populates="skill")
    progress = relationship("UserProgress", back_populates="skill")

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    title = Column(String) # e.g. "Ramp and block", "Position vs time"
    description = Column(Text)
    question = Column(Text) # "What is the slope? What does it represent?"
    
    skill = relationship("Skill", back_populates="cases")
    assessments = relationship("Assessment", back_populates="case")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    
    status = Column(String, default="Not started") # "Not started", "In progress", "Mastered"
    mastery_score = Column(Float, default=0.0) # e.g., 0.72 for 72%
    
    user = relationship("User", back_populates="progress")
    skill = relationship("Skill", back_populates="progress")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    case_id = Column(Integer, ForeignKey("cases.id"))
    
    user_answer = Column(Text)
    llm_feedback = Column(Text)
    llm_score = Column(Float) # Score assigned by LLM based on answer
    
    user = relationship("User", back_populates="assessments")
    case = relationship("Case", back_populates="assessments")
