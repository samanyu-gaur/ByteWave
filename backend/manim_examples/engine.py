import os
import json
from openai import OpenAI
from dotenv import load_dotenv

from prompts import PHYSICS_SOLVER_PROMPT, ANIMATION_EXPLAINER_PROMPT, MANIM_CODER_PROMPT
from context_loader import load_few_shot_context

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY", "sk-or-v1-dummy-key-for-testing")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

# We use Llama 3.3 70B as the open-source brain because of its excellent physics/coding benchmarks.
MODEL_NAME = "meta-llama/llama-3.3-70b-instruct:free"

def extract_python_code(markdown_text: str) -> str:
    try:
        if "```python" in markdown_text:
            return markdown_text.split("```python")[1].split("```")[0].strip()
        elif "```" in markdown_text:
            return markdown_text.split("```")[1].split("```")[0].strip()
        return markdown_text.strip()
    except Exception:
        return markdown_text

def generate_manim_simulation(user_prompt: str, project_dir: str = ".") -> str:
    """
    The orchestrator for the Three-Agent system (Solve -> Explain -> Code).
    """
    print(f"> Processing user request: '{user_prompt}'\n")
    
    # -----------------------------------------------------
    # Phase 1: The Physics Solver
    # -----------------------------------------------------
    print("[Agent 1] Solving Physics...")
    
    res1 = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": PHYSICS_SOLVER_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.0
    )
    physics_solution = res1.choices[0].message.content
    print("\n--- Physics Solution ---")
    print(physics_solution[:300] + "...\n------------------------\n")
    
    # -----------------------------------------------------
    # Phase 2: The Animation Explainer
    # -----------------------------------------------------
    print("[Agent 2] Explaining Animation Architecture...")
    
    res2 = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": ANIMATION_EXPLAINER_PROMPT},
            {"role": "user", "content": f"Physics Solution:\n{physics_solution}"}
        ],
        temperature=0.2
    )
    animation_explanation = res2.choices[0].message.content
    print("\n--- Animation Plan ---")
    print(animation_explanation[:300] + "...\n----------------------\n")
    
    # -----------------------------------------------------
    # Phase 3: The Code Writer
    # -----------------------------------------------------
    print("[Agent 3] Engineering Python Script...")
    
    few_shot_context = load_few_shot_context(project_dir)
    
    final_prompt = "Here is the layout and explanation of the animation you need to build:\n" + animation_explanation + "\n\n"
    if few_shot_context:
        final_prompt += "Here are examples of the precise styling requested by the user from their own code:\n"
        final_prompt += few_shot_context + "\n\n"
        
    final_prompt += "Using the math from the solution and the logic from the explanation, output the executable python code."
    
    res3 = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": MANIM_CODER_PROMPT},
            {"role": "user", "content": final_prompt}
        ],
        temperature=0.2
    )
    
    raw_code = res3.choices[0].message.content
    executable_python = extract_python_code(raw_code)
    
    return executable_python

if __name__ == "__main__":
    # Test Run
    prompt = "A simple block of mass m=5 on a flat table being pulled to the right by a string with tension T=20N, with a low friction mu=0.1. Show the free body diagram and make it accelerate."
    
    code = generate_manim_simulation(prompt)
    
    with open("generated_test.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("\n[Success] Wrote executed code to generated_test.py!")
