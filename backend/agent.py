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

MANIM_EXAMPLE_DIR = os.path.join(os.path.dirname(__file__), "manim_examples")

def get_premade_animation(question: str) -> dict:
    """
    Classify the user's physics question into one of our predefined manim examples,
    and return the associated text, code, and video URL.
    """
    
    PREMADE_VIDEOS = {
        "kinematics": {
            "description": "2D Kinematics, projectile motion, parabolic trajectory, angles, gravity, throw, launch",
            "video_url": "/videos/clips/ProjectileMotion.mp4",
            "plan": "Plan: I will illustrate projectile motion, showing the parabolic trajectory of an object under the influence of gravity.",
            "code_file": "kinematics.py"
        },
        "energy": {
            "description": "Conservation of energy, kinetic energy, potential energy conversion, simple pendulum",
            "video_url": "/videos/clips/EnergyPendulum.mp4",
            "plan": "Plan: I will show a simple pendulum highlighting the continuous conversion between kinetic and potential energy to illustrate the conservation of energy.",
            "code_file": "energy.py"
        },
        "gravity": {
            "description": "Gravity, inclined plane, ball rolling down or sliding down a slope, acceleration down an incline, forces on surface",
            "video_url": "/videos/clips/InclineFallingBall.mp4",
            "plan": "Plan: I will illustrate kinematics and gravity by showing how an object accelerates down an inclined plane.",
            "code_file": "gravity.py"
        },
        "oscillation": {
            "description": "Simple harmonic motion, springs, Hooke's Law, restoring force, oscillations, waves",
            "video_url": "/videos/clips/SpringOscillation.mp4",
            "plan": "Plan: I will animate a mass on a spring to illustrate Hooke's law and simple harmonic motion.",
            "code_file": "oscilation.py"
        },
        "pulley": {
            "description": "Tension, Atwood machine, pulley systems, coupled masses, Newton's laws of motion, force balance",
            "video_url": "/videos/clips/PulleySystem.mp4",
            "plan": "Plan: I will display a pulley system to explain tension and Newton's laws governing coupled masses.",
            "code_file": "trolley.py"
        },
        "dbpendulum": {
            "description": "Double pendulum, chaos theory, complex motion, non-linear dynamics, unpredictable paths",
            "video_url": "/videos/clips/DoublePendulum.mp4",
            "plan": "Plan: I will illustrate the chaotic and complex motion of a double pendulum, highlighting its sensitive dependence on initial conditions.",
            "code_file": "dbpendulum.py"
        },
        "magnetism": {
            "description": "magnetic field of a magnet, magnet, north south",
            "video_url": "/videos/clips/BarMagnetField.mp4",
            "plan": "Plan: I will visualize the magnetic field of a magnet bar, which is from North to South",
            "code_file": "magnetism.py"
        },
        "sericircuit": {
            "description": "series circuit, parallel circuit, resistors, current, voltage",
            "video_url": "/videos/clips/CircuitComparison.mp4",
            "plan": "Plan: I will illustrate a series circuit, showing how current flows through resistors in series.",
            "code_file": "sericircuit.py"
        }
    }

    options_text = ""
    for key, data in PREMADE_VIDEOS.items():
        options_text += f"- {key}: {data['description']}\n"
        
    prompt = f"""
You are an intelligent physics assistant. A user has asked the following physics question:
"{question}"

We have the following pre-made animation videos categorized by key:
{options_text}

Which of these categories best matches the user's question?
Respond ONLY with the exact key (e.g. 'kinematics', 'energy', etc.). If none perfectly match, choose the closest or default to 'kinematics'.
"""
    
    messages=[
        {"role": "system", "content": "You only output the exact category key, nothing else."},
        {"role": "user", "content": prompt}
    ]
    
    result = _minimax_chat(messages).strip().lower()
    
    # Remove <think> blocks if present
    import re
    result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL).strip()
    
    # clean up quotes or punctuation
    for char in ["'", '"', ".", "!", "?", "\n"]:
        result = result.replace(char, "")
        
    matched_key = "kinematics"
    if result in PREMADE_VIDEOS:
        matched_key = result
    else:
        for key in PREMADE_VIDEOS:
            if key in result:
                matched_key = key
                break
                
    selected = PREMADE_VIDEOS[matched_key]
    
    # Try to load the code file
    code_content = "# Code not found"
    code_path = os.path.join(MANIM_EXAMPLE_DIR, selected["code_file"])
    try:
        with open(code_path, "r", encoding="utf-8") as f:
            code_content = f.read()
    except Exception:
        pass
        
    return {
        "plan": selected["plan"],
        "code": code_content,
        "video_url": selected["video_url"]
    }

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
