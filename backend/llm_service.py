import os
import random
import requests
import json
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("MINIMAX_API_KEY", "").strip("'").strip('"')
        
        base_url = os.getenv('MINIMAX_BASE_URL', 'https://api.minimax.io/v1').strip("'").strip('"')
        self.api_url = f"{base_url}/chat/completions"
        
        self.default_model = os.getenv("LLM_MODEL", "MiniMax-M2.5").strip("'").strip('"')
        self.group_id = os.getenv("MINIMAX_GROUP_ID", "").strip("'").strip('"')
        
        # Fallback for backwards compatibility
        if not self.api_key:
            self.api_key = os.getenv("OPENROUTER_API_KEY", "").strip("'").strip('"')
        
    def analyze_answer(self, case_title: str, question: str, user_answer: str):
        """
        Calls OpenRouter API for gap analysis if API key is present.
        Otherwise falls back to mock logic.
        """
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            return self._mock_analyze_answer(user_answer)
            
        system_prompt = (
            "You are an expert high school physics tutor. "
            "A student is answering a question about a physics case. "
            "Evaluate their answer, provide targeted feedback finding their knowledge gap, "
            "and assign a mastery score between 0.0 and 1.0. "
            "Respond ONLY in valid JSON format with two keys: 'score' (float) and 'feedback' (string)."
        )
        
        user_prompt = f"Case: {case_title}\nQuestion: {question}\nStudent Answer: {user_answer}"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        if self.group_id:
            headers["GroupId"] = self.group_id
            
        payload = {
            "model": self.default_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            
            # Find JSON block if wrapped in markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            parsed_content = json.loads(content)
            
            score = float(parsed_content.get("score", 0.5))
            feedback = str(parsed_content.get("feedback", "No feedback provided by AI."))
            
            return {
                "score": min(max(score, 0.0), 1.0),
                "feedback": feedback
            }
        except Exception as e:
            print(f"Minimax API Error: {e}")
            print("Falling back to mock analysis...")
            return self._mock_analyze_answer(user_answer)
            
    def chat(self, messages: list):
        """
        Generic chat completion endpoint for the frontend using Minimax.
        """
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            return "Please add your MINIMAX_API_KEY to the backend Environment Variables on Render to use the chatbot."
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        if self.group_id:
            headers["GroupId"] = self.group_id
            
        payload = {
            "model": self.default_model,
            "messages": messages,
            "temperature": 0.8
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=20)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Minimax Chat API Error: {e}")
            return "Sorry, I am having trouble connecting to my brain right now."

    def _mock_analyze_answer(self, user_answer: str):
        keywords = ["slope", "rate of change", "velocity", "acceleration", "derivative", "rise over run"]
        matches = sum(1 for k in keywords if k in user_answer.lower())
        
        score = min(max(matches * 0.3, 0.1), 1.0)
        
        if score > 0.7:
            feedback = "Great job! You perfectly identified the core mechanics behind the concept. Keep it up!"
        elif score > 0.4:
            feedback = "You're on the right track, but missed some key details. Remember that slope refers to the 'rate of change' or 'rise over run'."
        else:
            feedback = "It seems you might be confusing some concepts. Let's break it down further. The slope on this graph gives us important information about change."
            
        return {
            "score": score,
            "feedback": feedback
        }

    def generate_recommendations(self, user_progress, cases, skills):
        """
        Mock Netflix-like recommendations.
        """
        recommendations = []
        
        # A simple algorithm to generate 'Netflix' rows
        
        # Find something they haven't started (Next for you)
        not_started = [p for p in user_progress if p.status == "Not started"]
        if not_started:
            target = random.choice(not_started)
            skill = next((s for s in skills if s.id == target.skill_id), None)
            if skill:
                recommendations.append({
                    "recommendation_type": "Next for you",
                    "item_id": skill.id,
                    "item_name": skill.name,
                    "match_score": random.uniform(80.0, 95.0),
                    "reason": "Based on your general curriculum progress."
                })
        
        # Find something in progress (Review)
        in_progress = [p for p in user_progress if p.status == "In progress"]
        if in_progress:
            target = random.choice(in_progress)
            skill = next((s for s in skills if s.id == target.skill_id), None)
            if skill:
                recommendations.append({
                    "recommendation_type": "Review",
                    "item_id": skill.id,
                    "item_name": skill.name,
                    "match_score": random.uniform(70.0, 85.0),
                    "reason": "You recently practiced this but haven't mastered it yet."
                })
                
        # Find something almost mastered (Ready to master)
        almost_mastered = [p for p in user_progress if p.status == "In progress" and p.mastery_score > 0.7]
        if almost_mastered:
            target = random.choice(almost_mastered)
            skill = next((s for s in skills if s.id == target.skill_id), None)
            if skill:
                recommendations.append({
                    "recommendation_type": "Ready to master",
                    "item_id": skill.id,
                    "item_name": skill.name,
                    "match_score": random.uniform(90.0, 99.0),
                    "reason": "You are extremely close to mastering this skill!"
                })
        
        return recommendations

llm_service = LLMService()
