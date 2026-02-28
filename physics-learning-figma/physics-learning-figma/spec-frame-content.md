# Physics Learning Platform – Spec Frame Content

Paste or adapt this on your Figma **Spec** page for documentation.

---

## Flow (student journey)

1. **Skill map** – Concepts as nodes (Not started / In progress / Mastered); click node to open that skill.
2. **Choose case** – Student picks a case (e.g. Ramp and block, Position vs time, Velocity vs time, Two points on a line).
3. **Assess** – Answer questions (“What is the slope?” “What does it represent?”); submit to LLM.
4. **LLM analysis** – Gap analysis returns targeted feedback and suggested next case/skill.
5. **Feedback + scoring** – Updated mastery % and recommendation rows (“Next for you,” “Review,” “Ready to master”).
6. **Back to map or dashboard** – Student chooses next case or skill.

```
Student → Skill map → Choose case → Assess → LLM → Feedback + scores → next case/skill
```

---

## Five core mechanics

| Mechanic | Description |
|----------|-------------|
| **Skill map** | Concepts as nodes; states: Not started / In progress / Mastered; click to open skill. |
| **Case-based practice** | Student chooses among cases (Ramp and block, Position vs time, Velocity vs time, Two points on a line). |
| **Assess the situation** | In each case, answer questions; answers sent to LLM. |
| **LLM gap analysis** | LLM (e.g. MiniMax) finds gaps, returns feedback and suggested next case/skill. |
| **Netflix-like scoring** | Recommendation score (“85% match”), mastery score (“Slope: 72%”), rows: “Next for you,” “Review,” “Ready to master.” |

---

## Design tokens (summary)

- **Colors:** Primary (text, muted, background), Accent (main, hover, success, warning, neutral), Skill states (not started, in progress, mastered), Border, Recommendation (high/mid/low).
- **Typography:** Headline 1–3, Body, Body Small, Caption, Label, Button, Score/Number (Inter).
- **Spacing:** 8pt grid; gap small 8, medium 12, large 16, section 24.
- **Radii:** Chip/node 12px, Card 12px, Button 10px.

---

## Key components

- **Skill Map Node** (3 states)
- **Case Card** (optional match %)
- **Question Block** (Assess)
- **Feedback Card** (LLM feedback + suggested next)
- **Recommendation Card** (Netflix-like “85% match”)
- **Mastery Score** (progress bar)
- **Section Row** (Next for you, Review, Ready to master)
- **Nav Bar** (back + title variants)

---

## Screens

- Skill Map | Choose Case | Assess | Feedback | Home/Dashboard | (Splash)

---

## Award fit (reference)

RevisionDojo/OAX (adaptive learning, pedagogy), MiniMax (LLM + optional audio/video), AWS (agent for “next case/skill” recommendations), HKUST (EdTech, impact).
