import os
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY", "").strip("'").strip('"')

# Load the dynamic variables from .env
MINIMAX_BASE_URL = os.getenv("MINIMAX_BASE_URL", "https://api.minimax.io/v1").strip("'").strip('"')
LLM_MODEL = os.getenv("LLM_MODEL", "MiniMax-M2.5").strip("'").strip('"')
MINIMAX_GROUP_ID = os.getenv("MINIMAX_GROUP_ID", "").strip("'").strip('"')

# Fallback to OpenRouter key if Minimax key is not set to prevent crashing
if not MINIMAX_API_KEY:
    MINIMAX_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

def _minimax_chat(messages, model=None):
    if not MINIMAX_API_KEY:
        # Prevent crash if key isn't provided, just return mock
        return "Please configure MINIMAX_API_KEY in the backend .env"
        
    url = f"{MINIMAX_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Some minimax interfaces require GroupId in the header
    if MINIMAX_GROUP_ID:
        headers["GroupId"] = MINIMAX_GROUP_ID
        
    data = {
        "model": model or LLM_MODEL,
        "messages": messages
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    result = response.json()
    return result["choices"][0]["message"]["content"]

def generate_animation_plan(question: str) -> str:
    """
    Call 1: Understand physics and generate a plan.
    """
    prompt = f"""
    You are an expert physics educator and animator.
    A user has asked the following physics question: "{question}"
    
    Please explain the physics concept simply and clearly, and then provide a step-by-step plan for how to animate this concept using the Manim Python library.
    Break down the animation into distinct scenes or actions.
    """
    
    messages=[
        {"role": "system", "content": "You are a helpful physics animation assistant."},
        {"role": "user", "content": prompt}
    ]
    
    return _minimax_chat(messages)

def generate_manim_code(plan: str) -> str:
    """
    Call 2: Generate Manim code based on the plan.
    """
    prompt = f"""
    Based on the following animation plan, write a complete, standalone Python script using the Manim library.
    
    Plan:
    {plan}
    
    Requirements for the Manim code:
    1. Import manim: `from manim import *`
    2. Create a single class that inherits from `Scene` named `PhysicsAnimation`.
    3. IMPORTANT: DO NOT hallucinate shapes or objects that do not exist in standard Manim Community Edition. Do not use `Spring`, `Wall`, etc. Stick to standard primitives like `Line`, `DashedLine`, `Circle`, `Dot`, `Rectangle`, `Arrow`, `Text`, and compose them using `VGroup`.
    4. CRITICAL: DO NOT use `MathTex` or `Tex` anywhere in the code. The system does not have LaTeX installed. You MUST use standard `Text("...")` for all text and math labels.
    5. The code must be clean, bug-free, and directly executable.
    6. ONLY output the Python code. Do not include markdown code block formatting like ```python. Just the raw text of the code.
    7. No explanation, just code.
    """
    
    messages=[
        {"role": "system", "content": "You are a Manim expert. You only output raw python code."},
        {"role": "user", "content": prompt}
    ]
    
    code = _minimax_chat(messages)
    return _clean_python_code(code)

def fix_manim_code(plan: str, failing_code: str, error_trace: str) -> str:
    """
    Call 3: Fix Manim code based on the error.
    """
    prompt = f"""
    You previously generated Manim code based on the following plan:
    {plan}
    
    This was the code you generated:
    ```python
    {failing_code}
    ```
    
    When we tried to execute it, it failed with the following error:
    ```
    {error_trace}
    ```
    
    Please fix the code. Output the COMPLETE corrected script.
    
    Requirements for the Manim code:
    1. Import manim: `from manim import *`
    2. Create a single class that inherits from `Scene` named `PhysicsAnimation`.
    3. IMPORTANT: DO NOT hallucinate shapes or objects that do not exist in standard Manim Community Edition. Do not use `Spring`, `Wall`, etc. Stick to standard primitives like `Line`, `DashedLine`, `Circle`, `Dot`, `Rectangle`, `Arrow`, `Text`, and compose them using `VGroup`.
    4. CRITICAL: DO NOT use `MathTex` or `Tex` anywhere in the code. The system does not have LaTeX installed. You MUST use standard `Text("...")` for all text and math labels.
    5. The code must be clean, bug-free, and directly executable.
    6. ONLY output the Python code. Do not include markdown code block formatting like ```python. Just the raw text of the code.
    7. No explanation, just code.
    """
    
    messages=[
        {"role": "system", "content": "You are a Manim expert. You fix bugs and only output raw python code."},
        {"role": "user", "content": prompt}
    ]
    
    code = _minimax_chat(messages)
    return _clean_python_code(code)

def _clean_python_code(code: str | None) -> str:
    if not code:
        return ""
    code = code.strip()
    # Clean up standard markdown code blocks if the LLM adds them despite instructions
    if code.startswith("```python"):
        code = code.removeprefix("```python")
    elif code.startswith("```"):
        code = code.removeprefix("```")
    if code.endswith("```"):
        code = code.removesuffix("```")
        
    return code.strip()
