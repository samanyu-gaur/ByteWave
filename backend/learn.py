"""
PhysiMate Learning Engine
─────────────────────────
Bridges PhysiMate's animation engine with a Bytewave-style adaptive learning loop:

  Skill Map → Choose Case → Assess (Q&A) → LLM Gap Analysis
      → Mastery Update → Netflix-style Recommendation Rows

Uses:
  • SQLite (stdlib) for per-student mastery/session persistence
  • DeepSeek-chat for question generation and answer evaluation
  • PhysiMate's /api/quick_render for remediation animations
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Any

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(override=True)
logger = logging.getLogger(__name__)

# ── LLM client (same DeepSeek endpoint as agent.py) ──────────────────────────
_client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com",
    timeout=60.0,
)
_CHAT_MODEL = "deepseek-chat"

# ── Database ──────────────────────────────────────────────────────────────────
_DB_PATH = Path(__file__).resolve().parent / "learn.db"


@contextmanager
def _db():
    conn = sqlite3.connect(str(_DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with _db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS students (
                id   TEXT PRIMARY KEY,
                name TEXT DEFAULT 'Student',
                created_at REAL
            );
            CREATE TABLE IF NOT EXISTS mastery (
                student_id   TEXT,
                skill        TEXT,
                score        INTEGER DEFAULT 0,
                attempts     INTEGER DEFAULT 0,
                last_updated REAL,
                gaps         TEXT DEFAULT '[]',
                PRIMARY KEY (student_id, skill)
            );
            CREATE TABLE IF NOT EXISTS sessions (
                id           TEXT PRIMARY KEY,
                student_id   TEXT,
                skill        TEXT,
                case_id      TEXT,
                started_at   REAL,
                completed_at REAL,
                score        INTEGER
            );
            CREATE TABLE IF NOT EXISTS answers (
                id             TEXT PRIMARY KEY,
                session_id     TEXT,
                question_text  TEXT,
                student_answer TEXT,
                correct        INTEGER,
                gap_label      TEXT,
                feedback       TEXT
            );
        """)
    logger.info("Learning DB initialised at %s", _DB_PATH)


# ── Skills / Cases catalogue (aligned with Bytewave topic IDs) ───────────────

SKILLS: dict[str, dict] = {
    "motion": {
        "label": "Motion & Kinematics",
        "icon": "↗️",
        "description": "Position, velocity, acceleration, graphs and 2D motion",
        "cases": [
            {"id": "motion-1", "label": "Ball on a slope",      "desc": "Calculate acceleration down an inclined plane using v = u + at",
             "question": "A ball starts from rest and rolls down a slope, reaching the bottom in 2 s with a final speed of 8 m/s. (a) Calculate the acceleration. (b) How long is the slope?",
             "hint": "Use v = u + at for (a), then s = ut + ½at² for (b)."},
            {"id": "motion-2", "label": "Car braking distance", "desc": "Use kinematics to find stopping distance",
             "question": "A car travelling at 20 m/s applies its brakes and decelerates uniformly at 4 m/s². How far does the car travel before stopping? Use v² = u² + 2as.",
             "hint": "Final velocity v = 0. Rearrange v² = u² + 2as to find s."},
            {"id": "motion-3", "label": "Projectile launch",    "desc": "Resolve initial velocity into components",
             "question": "A ball is kicked horizontally at 15 m/s from the top of a 20 m cliff. (a) How long does it take to land? (b) How far from the base does it land? (g = 10 m/s²)",
             "hint": "Vertical motion: h = ½gt². Horizontal distance = horizontal speed × time."},
        ],
    },
    "forces": {
        "label": "Forces & Newton's Laws",
        "icon": "⚖️",
        "description": "Forces and motion — Newton's three laws in real contexts",
        "cases": [
            {"id": "forces-1", "label": "Tug of war",          "desc": "Find resultant force and predict acceleration",
             "question": "Team A pulls 600 N right, Team B pulls 450 N left. The rope has mass 5 kg. (a) Find the resultant force. (b) Calculate the rope's acceleration.",
             "hint": "Net force = 600 − 450 = 150 N. Use F = ma."},
            {"id": "forces-2", "label": "Box on rough surface", "desc": "Apply Newton's 2nd law with friction",
             "question": "A 10 kg box is pushed with 80 N. The friction force is 30 N. (a) Find the net force. (b) Calculate the acceleration. (c) Speed after 4 s from rest?",
             "hint": "Net F = Applied − Friction. Then a = F/m. v = u + at."},
            {"id": "forces-3", "label": "Elevator ride",        "desc": "Normal force during lift acceleration",
             "question": "A 60 kg person stands in a lift accelerating upward at 2 m/s². (a) Draw a free-body diagram. (b) Calculate the normal force. (g = 10 m/s²)",
             "hint": "N − mg = ma. Solve for N."},
        ],
    },
    "energy": {
        "label": "Work, Energy & Power",
        "icon": "⚡",
        "description": "Energy forms, conservation and power",
        "cases": [
            {"id": "energy-1", "label": "Rollercoaster drop",  "desc": "Convert gravitational PE to KE",
             "question": "A 500 kg rollercoaster starts from rest at 40 m height. Assuming no friction, find its speed at the bottom. (g = 10 m/s²)",
             "hint": "PE = mgh = KE = ½mv². The m cancels — solve for v."},
            {"id": "energy-2", "label": "Pushing a crate",     "desc": "Calculate work done and power",
             "question": "A worker pushes a 200 kg crate 15 m with 400 N in 20 s. (a) Calculate the work done. (b) Calculate the power output.",
             "hint": "W = F × d. P = W / t."},
            {"id": "energy-3", "label": "Spring launcher",     "desc": "Elastic PE converts to kinetic energy",
             "question": "A spring (k = 500 N/m) is compressed 0.1 m and launches a 0.05 kg ball. Find the launch speed assuming all spring PE becomes KE.",
             "hint": "½kx² = ½mv². Solve for v."},
        ],
    },
    "waves": {
        "label": "Waves & Sound",
        "icon": "〰️",
        "description": "Transverse and longitudinal waves, frequency and sound",
        "cases": [
            {"id": "waves-1", "label": "Ripple tank",           "desc": "Measure wavelength and frequency to find wave speed",
             "question": "Water waves have frequency 4 Hz and wavelength 3 cm. (a) Calculate wave speed. (b) If frequency doubles, what happens to speed and wavelength?",
             "hint": "v = fλ. Wave speed in a medium is fixed — so λ halves when f doubles."},
            {"id": "waves-2", "label": "Echo sounder",          "desc": "Use time delay to calculate depth",
             "question": "A sonar pulse returns in 0.6 s. Speed of sound in water = 1500 m/s. Calculate the depth of the seabed.",
             "hint": "Distance = speed × time. The pulse travels there AND back, so halve the time."},
            {"id": "waves-3", "label": "Guitar string",         "desc": "Identify fundamental and harmonic frequencies",
             "question": "A guitar string has fundamental frequency 220 Hz. (a) Frequency of the 2nd harmonic? (b) If string length is 65 cm, calculate wave speed.",
             "hint": "2nd harmonic = 2 × fundamental. v = fλ; for fundamental λ = 2L."},
        ],
    },
    "light": {
        "label": "Light & Radiation",
        "icon": "💡",
        "description": "Optics and electromagnetic waves",
        "cases": [
            {"id": "light-1", "label": "Glass prism",           "desc": "Apply Snell's law at air-glass boundary",
             "question": "A ray hits glass (n = 1.5) at 40° incidence. (a) Find the angle of refraction using Snell's law. (b) Does it bend towards or away from the normal?",
             "hint": "n₁ sin θ₁ = n₂ sin θ₂. n_air = 1."},
            {"id": "light-2", "label": "Mirror reflection",     "desc": "Locate image in a plane mirror",
             "question": "A student stands 2 m from a plane mirror. (a) Where is the image? (b) Is it real or virtual, upright or inverted? (c) Student walks 0.5 m closer — how far is image from student?",
             "hint": "Image distance = object distance behind the mirror."},
            {"id": "light-3", "label": "Fibre optic cable",     "desc": "Calculate critical angle for TIR",
             "question": "Glass fibre has n = 1.6. (a) Calculate the critical angle. (b) Explain why TIR is essential for fibre optic communication.",
             "hint": "sin(c) = 1/n. Use sin⁻¹ to find the angle."},
        ],
    },
    "electricity": {
        "label": "Electricity & Circuits",
        "icon": "🔌",
        "description": "Charges, fields and circuits",
        "cases": [
            {"id": "elec-1", "label": "Simple circuit",         "desc": "Ohm's law: V = IR",
             "question": "A 12 V battery connects to a resistor with 0.5 A current. (a) Calculate resistance. (b) Charge in 2 minutes. (c) Power dissipated.",
             "hint": "R = V/I. Q = It. P = IV."},
            {"id": "elec-2", "label": "Series resistors",       "desc": "Total resistance and voltage drops",
             "question": "10 Ω, 20 Ω, 30 Ω in series across 12 V. (a) Total resistance. (b) Current. (c) Voltage drop across 20 Ω.",
             "hint": "R_total = R₁ + R₂ + R₃. I = V/R_total. V₂ = I × 20."},
            {"id": "elec-3", "label": "Parallel circuit",       "desc": "Branch currents in parallel",
             "question": "6 Ω and 12 Ω in parallel across 12 V. (a) Current through each. (b) Total current. (c) Combined resistance.",
             "hint": "V same across both branches. I = V/R for each. 1/R_total = 1/R₁ + 1/R₂."},
        ],
    },
    "magnetism": {
        "label": "Magnetism",
        "icon": "🧲",
        "description": "Magnets and electromagnetic induction",
        "cases": [
            {"id": "mag-1", "label": "Bar magnet field",        "desc": "Describe magnetic field lines",
             "question": "Sketch the magnetic field around a bar magnet. (a) Direction outside the magnet? (b) Where is the field strongest? (c) What happens when two north poles face each other?",
             "hint": "Field lines run from N to S outside the magnet. Closely spaced lines = strong field."},
            {"id": "mag-2", "label": "Solenoid",                "desc": "Calculate field inside a current-carrying solenoid",
             "question": "A solenoid has 500 turns, 0.25 m long, 2 A current. Use B = μ₀nI to find the field (μ₀ = 4π × 10⁻⁷ T·m/A). How does B change if current doubles?",
             "hint": "n = N/L (turns per metre). B ∝ I so doubling current doubles B."},
            {"id": "mag-3", "label": "Motor effect",            "desc": "Fleming's left-hand rule for force on wire",
             "question": "Wire carries 3 A in a 0.05 T field at 90°, wire length 0.2 m. (a) Calculate the force. (b) Use Fleming's left-hand rule to find the direction.",
             "hint": "F = BIL. For direction: thumb = force, index = field, middle = current."},
        ],
    },
    "heat": {
        "label": "Heat & Thermodynamics",
        "icon": "🌡️",
        "description": "Temperature and heat transfer",
        "cases": [
            {"id": "heat-1", "label": "Heating water",          "desc": "Q = mcΔT for temperature change",
             "question": "How much energy is needed to heat 2 kg of water from 20°C to 100°C? Specific heat capacity of water = 4200 J/(kg·°C).",
             "hint": "Q = mcΔT. ΔT = 100 − 20 = 80°C."},
            {"id": "heat-2", "label": "Melting ice",            "desc": "Specific latent heat for change of state",
             "question": "500 g of ice at 0°C is melted then heated to 60°C. Latent heat of fusion = 334,000 J/kg; specific heat of water = 4200 J/(kg·°C). Find total energy.",
             "hint": "Total energy = energy to melt (Q = mL) + energy to heat (Q = mcΔT)."},
            {"id": "heat-3", "label": "Insulation test",        "desc": "Compare heat loss through different materials",
             "question": "Three cups start at 80°C. After 10 min: uninsulated → 50°C, wool → 60°C, foam → 65°C. (a) Best insulator? (b) Rate of cooling for uninsulated? (c) Why does foam slow heat transfer?",
             "hint": "Least temperature drop = best insulator. Rate = ΔT / time."},
        ],
    },
    "gravity": {
        "label": "Gravity & Orbits",
        "icon": "🌍",
        "description": "Gravitational force and orbits",
        "cases": [
            {"id": "grav-1", "label": "Falling object",         "desc": "Free fall: speed and distance",
             "question": "A stone drops from rest off an 80 m cliff. (a) Time to reach the ground? (b) Speed just before it hits? (g = 10 m/s²)",
             "hint": "h = ½gt². Then v = gt."},
            {"id": "grav-2", "label": "Satellite orbit",        "desc": "Orbital speed and period",
             "question": "A satellite orbits 400 km above Earth. R_Earth = 6.4 × 10⁶ m, g = 8.7 m/s² at that height. (a) Calculate orbital speed. (b) Estimate the orbital period.",
             "hint": "Centripetal acceleration = g. v = √(g × r). T = 2πr/v."},
            {"id": "grav-3", "label": "Weight on Mars",         "desc": "Gravitational field strength comparison",
             "question": "Mars has g = 3.7 N/kg. Astronaut mass = 75 kg. (a) Weight on Mars? (b) Weight on Earth? (c) Does mass change between planets? Explain.",
             "hint": "W = mg. Mass is a fixed property — weight depends on g."},
        ],
    },
    "quantum": {
        "label": "Atoms & Nuclei",
        "icon": "⚛️",
        "description": "Atomic structure, nuclear decay and energy levels",
        "cases": [
            {"id": "atom-1", "label": "Rutherford scattering",  "desc": "Interpret gold foil experiment",
             "question": "In Rutherford's experiment, most alpha particles passed through, but few were deflected at large angles. (a) What did undeflected particles show? (b) What did large deflections reveal? (c) How does this disprove the plum pudding model?",
             "hint": "Most empty space → most particles pass through. Dense positive nucleus → rare large deflections."},
            {"id": "atom-2", "label": "Alpha decay",            "desc": "Write and balance a nuclear decay equation",
             "question": "Uranium-238 (²³⁸₉₂U) undergoes alpha decay. (a) Write the balanced nuclear equation. (b) Properties of an alpha particle? (c) Why does the nucleus become more stable?",
             "hint": "Alpha particle = ⁴₂He. Both mass number and atomic number must balance."},
            {"id": "atom-3", "label": "Half-life calculation",  "desc": "Use the half-life formula to find remaining activity",
             "question": "Half-life = 6 hours, initial activity = 3200 Bq. (a) Activity after 24 hours? (b) Time for activity to fall below 100 Bq? (c) What does half-life mean for undecayed atoms?",
             "hint": "After each half-life the activity halves. 24 h = 4 half-lives."},
        ],
    },
}

# Flat case ID → (skill_id, case_dict) lookup for O(1) retrieval
_CASE_LOOKUP: dict[str, tuple[str, dict]] = {
    c["id"]: (sid, c)
    for sid, skill in SKILLS.items()
    for c in skill["cases"]
}

# Maps case_id → a PhysiMate question that generates a good remediation animation
_REMEDIATION_PROMPTS: dict[str, str] = {
    "motion-1": "Show a ball accelerating down a slope. Label initial velocity, final velocity, acceleration and distance.",
    "motion-2": "Show a car decelerating to rest. Label initial speed, deceleration and stopping distance using v squared = u squared + 2as.",
    "motion-3": "Show projectile motion with horizontal and vertical velocity components at launch angle 30 degrees.",
    "forces-1": "Explain Newton's second law with a block on a surface. Show F=ma with resultant force arrow.",
    "forces-2": "Show a block on a rough surface with applied force and friction force arrows. Show net force and acceleration.",
    "forces-3": "Show a person in an accelerating elevator. Label weight, normal force and net force upward.",
    "energy-1": "Show conservation of energy: ball rolling down a ramp. Label PE at top and KE at bottom.",
    "energy-2": "Show the work-energy theorem: net work equals change in kinetic energy for a pushed crate.",
    "energy-3": "Show spring potential energy PE = half k x squared and conversion to kinetic energy of a ball.",
    "waves-1":  "Show a transverse wave with wavelength, frequency and wave speed labelled. Show v = f lambda.",
    "waves-2":  "Show a sonar pulse travelling to the seabed and reflecting back. Label distance and time.",
    "waves-3":  "Show a standing wave on a guitar string. Label fundamental frequency and second harmonic.",
    "light-1":  "Show refraction of light at an air-glass boundary. Label angle of incidence, refraction and Snell's law.",
    "light-2":  "Show reflection in a plane mirror. Label object, image, and angles of incidence and reflection.",
    "light-3":  "Show total internal reflection in a glass fibre. Label the critical angle.",
    "elec-1":   "Show a simple DC circuit with battery, resistor and ammeter. Label voltage, current and resistance.",
    "elec-2":   "Show three resistors in series with voltage drops labelled. Show V = IR for each.",
    "elec-3":   "Show two resistors in parallel. Label branch currents and combined resistance.",
    "mag-1":    "Show magnetic field lines around a bar magnet from north to south pole.",
    "mag-2":    "Show the magnetic field inside a solenoid. Label turns, length, current and field strength.",
    "mag-3":    "Show the motor effect: force on a current-carrying wire in a magnetic field using F = BIL.",
    "heat-1":   "Show energy required to heat water using Q = mcΔT. Label mass, specific heat and temperature change.",
    "heat-2":   "Show the heating curve for ice: solid, melting, liquid, heating. Label latent heat and specific heat stages.",
    "heat-3":   "Show heat transfer by conduction through three materials of different thickness and conductivity.",
    "grav-1":   "Show free fall with increasing velocity under gravity. Label g = 10 m/s squared and distance h = half g t squared.",
    "grav-2":   "Show a satellite in circular orbit. Label centripetal force, orbital speed and radius.",
    "grav-3":   "Show the same mass on Earth and on Mars with different weight arrows. Label W = mg.",
    "atom-1":   "Show Rutherford's gold foil experiment: alpha particles, thin gold foil and detector screen.",
    "atom-2":   "Show alpha decay of uranium-238. Label parent nucleus, alpha particle and daughter nucleus.",
    "atom-3":   "Show exponential radioactive decay graph with half-life intervals labelled.",
}


# ── Student management ────────────────────────────────────────────────────────

def get_or_create_student(student_id: str, name: str = "Student") -> dict:
    with _db() as conn:
        row = conn.execute("SELECT * FROM students WHERE id=?", (student_id,)).fetchone()
        if row:
            return dict(row)
        conn.execute(
            "INSERT INTO students (id, name, created_at) VALUES (?,?,?)",
            (student_id, name, time.time()),
        )
        return {"id": student_id, "name": name, "created_at": time.time()}


# ── Mastery helpers ───────────────────────────────────────────────────────────

def get_mastery(student_id: str) -> dict[str, dict]:
    """Return {skill: {score, attempts, gaps, last_updated}} for a student."""
    with _db() as conn:
        rows = conn.execute(
            "SELECT * FROM mastery WHERE student_id=?", (student_id,)
        ).fetchall()
    result: dict[str, dict] = {}
    for row in rows:
        result[row["skill"]] = {
            "score": row["score"],
            "attempts": row["attempts"],
            "gaps": json.loads(row["gaps"] or "[]"),
            "last_updated": row["last_updated"],
        }
    return result


def _update_mastery(student_id: str, skill: str, delta: int, new_gaps: list[str]):
    with _db() as conn:
        row = conn.execute(
            "SELECT * FROM mastery WHERE student_id=? AND skill=?",
            (student_id, skill),
        ).fetchone()
        if row:
            existing_gaps = json.loads(row["gaps"] or "[]")
            # Keep unique gaps, max 10
            merged = list(dict.fromkeys(new_gaps + existing_gaps))[:10]
            new_score = max(0, min(100, row["score"] + delta))
            conn.execute(
                """UPDATE mastery
                   SET score=?, attempts=attempts+1, last_updated=?, gaps=?
                   WHERE student_id=? AND skill=?""",
                (new_score, time.time(), json.dumps(merged), student_id, skill),
            )
        else:
            initial = max(0, min(100, 50 + delta))  # first attempt seeds at 50 ± delta
            conn.execute(
                """INSERT INTO mastery (student_id, skill, score, attempts, last_updated, gaps)
                   VALUES (?,?,?,1,?,?)""",
                (student_id, skill, initial, time.time(), json.dumps(new_gaps[:10])),
            )


# ── Question generation ───────────────────────────────────────────────────────

def generate_questions(skill: str, case_id: str, mastery_score: int) -> list[dict]:
    """
    Ask the LLM to generate 3 short-answer questions for the given skill/case.
    Difficulty adapts to mastery score (0=beginner, 100=expert).

    Returns: [{"question": str, "hint": str, "answer": str, "misconception": str}, ...]
    """
    skill_label = SKILLS.get(skill, {}).get("label", skill)
    case_obj = next(
        (c for c in SKILLS.get(skill, {}).get("cases", []) if c["id"] == case_id), {}
    )
    case_label = case_obj.get("label", case_id)
    case_desc  = case_obj.get("desc", "")

    if mastery_score < 30:
        difficulty = "beginner — test basic definitions and direct formula application"
    elif mastery_score < 65:
        difficulty = "intermediate — test conceptual understanding and multi-step problems"
    else:
        difficulty = "advanced — test edge cases, misconceptions, and transfer to new contexts"

    prompt = f"""You are a physics assessment engine for high school students.

Generate EXACTLY 3 short-answer assessment questions for:
  Skill: {skill_label}
  Case: {case_label} — {case_desc}
  Difficulty: {difficulty} (student mastery: {mastery_score}%)

Rules:
- Questions should be answerable in 1–3 sentences
- Each question must target a SPECIFIC concept (not vague)
- Include the most common misconception students have on that question
- Return ONLY valid JSON — no markdown, no extra text

Return this exact JSON array:
[
  {{
    "question": "<question text>",
    "hint": "<a one-sentence conceptual hint, not the answer>",
    "answer": "<the correct concise answer>",
    "misconception": "<the most common wrong belief students have>"
  }},
  ...
]"""

    try:
        resp = _client.chat.completions.create(
            model=_CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=800,
        )
        raw = resp.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        questions = json.loads(raw)
        if isinstance(questions, list) and len(questions) >= 1:
            return questions[:3]
    except Exception as e:
        logger.error("Question generation failed: %s", e)

    # Fallback: deterministic questions if LLM fails
    return _fallback_questions(skill, case_id)


def _fallback_questions(skill: str, case_id: str) -> list[dict]:
    """Hardcoded fallback questions for common cases."""
    _fallbacks: dict[str, list[dict]] = {
        "position_time": [
            {"question": "What does the slope of a position-time graph represent?",
             "hint": "Think about what changes in position over time gives you.",
             "answer": "The slope represents velocity — rise over run is Δx/Δt = v.",
             "misconception": "Students often think slope represents acceleration, not velocity."},
            {"question": "If a position-time graph is a horizontal line, what is the object doing?",
             "hint": "The position is not changing.",
             "answer": "The object is stationary — velocity is zero.",
             "misconception": "Students think horizontal means constant velocity, not zero velocity."},
            {"question": "How does a steeper slope on a position-time graph relate to speed?",
             "hint": "Steeper slope = faster rate of change of position.",
             "answer": "A steeper slope means greater speed (larger |v|).",
             "misconception": "Students confuse the direction of the slope (positive/negative) with speed magnitude."},
        ],
        "elastic": [
            {"question": "What two quantities are conserved in a perfectly elastic collision?",
             "hint": "Both a vector quantity and a scalar energy quantity.",
             "answer": "Both momentum (p = mv) and kinetic energy (KE = ½mv²) are conserved.",
             "misconception": "Students often say 'total energy' — but only kinetic energy is conserved, not potential."},
            {"question": "A 2 kg ball at 4 m/s hits a stationary 2 kg ball elastically. What happens?",
             "hint": "Equal masses in elastic collision — there's a neat result.",
             "answer": "The first ball stops completely and the second moves at 4 m/s (velocity transfer).",
             "misconception": "Students think both balls move at 2 m/s after — that violates kinetic energy conservation."},
            {"question": "Why can't two objects stick together in an elastic collision?",
             "hint": "Think about what 'elastic' means for kinetic energy.",
             "answer": "If they stick, kinetic energy is lost to deformation — that's inelastic, not elastic.",
             "misconception": "Students think any collision where objects touch is elastic."},
        ],
        "pendulum": [
            {"question": "What variables affect the period of a simple pendulum?",
             "hint": "T = 2π√(L/g) — look at what's in the formula.",
             "answer": "Only length (L) and gravitational acceleration (g) affect the period. Mass does not.",
             "misconception": "Students think heavier bobs swing slower — mass cancels out completely."},
            {"question": "If you triple the length of a pendulum, how does the period change?",
             "hint": "T is proportional to √L.",
             "answer": "The period increases by √3 ≈ 1.73×. It does NOT triple.",
             "misconception": "Students think tripling length triples the period — forgetting the square root."},
            {"question": "A pendulum on the Moon has the same length as one on Earth. Which has a longer period?",
             "hint": "g_Moon ≈ 1.6 m/s², g_Earth ≈ 9.8 m/s².",
             "answer": "The Moon pendulum has a longer period (T ∝ 1/√g, and g_Moon < g_Earth).",
             "misconception": "Students think gravity doesn't affect pendulums because 'gravity just pulls it back'."},
        ],
    }
    return _fallbacks.get(case_id, [
        {"question": f"Describe the key principle behind {case_id.replace('_', ' ')}.",
         "hint": "Think about the fundamental law or equation.",
         "answer": "See your textbook for a detailed explanation.",
         "misconception": "Common misconception: confusing this with a related but different concept."},
    ])


# ── Answer evaluation ─────────────────────────────────────────────────────────

def evaluate_answers(
    skill: str,
    case_id: str,
    qa_pairs: list[dict],  # [{"question": str, "answer": str, "student_answer": str, "misconception": str}]
) -> dict:
    """
    Ask the LLM to grade the student's answers and identify gaps.

    Returns:
    {
      "results": [{"correct": bool, "gap": str, "feedback": str}, ...],
      "overall_score": int (0-100),
      "delta": int (-15 to +20),
      "gaps": [str, ...],
      "summary_feedback": str,
      "needs_remediation": bool,
      "remediation_concept": str,
    }
    """
    skill_label = SKILLS.get(skill, {}).get("label", skill)

    qa_text = "\n\n".join(
        f"Q{i+1}: {p['question']}\n"
        f"  Correct answer: {p['answer']}\n"
        f"  Common misconception: {p['misconception']}\n"
        f"  Student answered: {p['student_answer'] or '(no answer)'}"
        for i, p in enumerate(qa_pairs)
    )

    prompt = f"""You are a physics tutor grading a student's answers.

Skill: {skill_label} / {case_id.replace('_', ' ')}

{qa_text}

For each question:
1. Decide if the student is correct (boolean — allow partial credit as correct if they show understanding)
2. Identify the specific gap label if wrong (e.g. "confuses slope with y-intercept", "ignores square root in formula")
3. Write 1-2 sentences of targeted feedback

Then give:
- overall_score: 0-100 (100 = perfect, 0 = completely wrong)
- delta: mastery change from -15 to +20 (positive if they showed understanding, negative if misconceptions)
- needs_remediation: true if overall_score < 60
- remediation_concept: the single most important concept to re-teach (short phrase)
- summary_feedback: 2-3 sentences of overall feedback, encouraging but honest

Return ONLY valid JSON, no markdown:
{{
  "results": [
    {{"correct": true/false, "gap": "gap label or empty string", "feedback": "..."}}
  ],
  "overall_score": 75,
  "delta": 10,
  "gaps": ["gap label 1", "gap label 2"],
  "summary_feedback": "...",
  "needs_remediation": false,
  "remediation_concept": "slope represents velocity not acceleration"
}}"""

    try:
        resp = _client.chat.completions.create(
            model=_CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=700,
        )
        raw = resp.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        evaluation = json.loads(raw)
        return evaluation
    except Exception as e:
        logger.error("Answer evaluation failed: %s", e)
        # Safe fallback
        n = len(qa_pairs)
        return {
            "results": [{"correct": False, "gap": "", "feedback": "Unable to grade automatically."} for _ in range(n)],
            "overall_score": 0,
            "delta": 0,
            "gaps": [],
            "summary_feedback": "We couldn't grade your answers automatically. Please try again.",
            "needs_remediation": True,
            "remediation_concept": case_id.replace("_", " "),
        }


# ── Recommendation engine ─────────────────────────────────────────────────────

def get_recommendations(student_id: str) -> dict:
    """
    Build Netflix-style recommendation rows for a student.

    Returns:
    {
      "next_for_you":    [{"skill", "case_id", "label", "desc", "match_pct"}, ...],
      "review":          [...],
      "ready_to_master": [...],
      "mastery":         {skill: {score, attempts, gaps}},
      "overall_mastery": int,
    }
    """
    mastery = get_mastery(student_id)

    # Score each (skill, case) pair
    scored: list[dict] = []
    for skill_id, skill_data in SKILLS.items():
        skill_mastery = mastery.get(skill_id, {})
        score = skill_mastery.get("score", 0)
        attempts = skill_mastery.get("attempts", 0)
        gaps = skill_mastery.get("gaps", [])
        last_updated = skill_mastery.get("last_updated", 0)

        for case in skill_data["cases"]:
            rec_score = _recommendation_score(score, attempts, gaps, last_updated)
            scored.append({
                "skill": skill_id,
                "skill_label": skill_data["label"],
                "skill_icon": skill_data.get("icon", "📚"),
                "case_id": case["id"],
                "label": case["label"],
                "desc": case["desc"],
                "mastery": score,
                "attempts": attempts,
                "match_pct": rec_score,
            })

    scored.sort(key=lambda x: x["match_pct"], reverse=True)

    # Partition into rows
    not_started  = [c for c in scored if c["attempts"] == 0]
    in_progress  = [c for c in scored if 0 < c["attempts"] and c["mastery"] < 80]
    near_mastery = [c for c in scored if c["mastery"] >= 80 and c["mastery"] < 100]
    # Struggling: in_progress where mastery is low
    struggling   = [c for c in in_progress if c["mastery"] < 50]

    next_for_you = (struggling[:2] + in_progress[:2] + not_started[:4])[:6]
    # Deduplicate
    seen = set()
    deduped_next = []
    for item in next_for_you:
        key = (item["skill"], item["case_id"])
        if key not in seen:
            seen.add(key)
            deduped_next.append(item)

    overall = round(sum(m.get("score", 0) for m in mastery.values()) / max(len(SKILLS), 1))

    return {
        "next_for_you":    deduped_next[:6],
        "review":          in_progress[:6],
        "ready_to_master": near_mastery[:4],
        "mastery":         mastery,
        "overall_mastery": overall,
        "skills":          {sid: {"label": sd["label"], "icon": sd.get("icon", "📚")} for sid, sd in SKILLS.items()},
    }


def _recommendation_score(
    mastery: int, attempts: int, gaps: list, last_updated: float
) -> int:
    """
    Score how strongly to recommend a (skill, case) to a student.
    Higher = recommend more strongly.
    """
    score = 50  # base

    if attempts == 0:
        score += 20  # new content gets a boost

    # Struggling content gets highest priority
    if 0 < attempts and mastery < 50:
        score += 30

    # In-progress but not struggling
    elif 0 < attempts and mastery < 80:
        score += 15

    # Near mastery — gentle push to complete
    elif mastery >= 80:
        score -= 10

    # Recency penalty — recently attempted → lower priority (give it a rest)
    age_days = (time.time() - last_updated) / 86400 if last_updated else 9999
    if age_days < 1:
        score -= 20
    elif age_days > 7:
        score += 10

    # Gap penalty turns into boost (has gaps → needs more practice)
    score += min(len(gaps) * 5, 20)

    return max(0, min(100, score))


# ── Session management ────────────────────────────────────────────────────────

def start_session(student_id: str, skill: str, case_id: str) -> str:
    session_id = str(uuid.uuid4())
    with _db() as conn:
        conn.execute(
            "INSERT INTO sessions (id, student_id, skill, case_id, started_at) VALUES (?,?,?,?,?)",
            (session_id, student_id, skill, case_id, time.time()),
        )
    return session_id


def complete_session(
    session_id: str,
    student_id: str,
    skill: str,
    overall_score: int,
    delta: int,
    gaps: list[str],
    answer_rows: list[dict],
) -> None:
    with _db() as conn:
        conn.execute(
            "UPDATE sessions SET completed_at=?, score=? WHERE id=?",
            (time.time(), overall_score, session_id),
        )
        for row in answer_rows:
            conn.execute(
                """INSERT INTO answers
                   (id, session_id, question_text, student_answer, correct, gap_label, feedback)
                   VALUES (?,?,?,?,?,?,?)""",
                (
                    str(uuid.uuid4()),
                    session_id,
                    row.get("question", ""),
                    row.get("student_answer", ""),
                    1 if row.get("correct") else 0,
                    row.get("gap", ""),
                    row.get("feedback", ""),
                ),
            )
    _update_mastery(student_id, skill, delta, gaps)


# ── Remediation animation query ───────────────────────────────────────────────

def get_remediation_prompt(case_id: str, remediation_concept: str) -> str:
    """
    Return a PhysiMate animation prompt for the gap concept.
    Falls back to a generic prompt if case_id not in catalogue.
    """
    base = _REMEDIATION_PROMPTS.get(
        case_id,
        f"Explain {case_id.replace('_', ' ')} with a clear physics animation.",
    )
    if remediation_concept and remediation_concept.lower() not in base.lower():
        return f"{base} Focus specifically on: {remediation_concept}."
    return base
