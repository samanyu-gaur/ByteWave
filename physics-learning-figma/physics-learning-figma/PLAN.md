# Physics Learning Platform – Final idea (locked)

This document is the **locked** product plan. Implementation follows the specs in this repo (screen-specs, component-specs, FIGMA_IMPLEMENTATION_GUIDE, etc.).

---

## One-line pitch

*A learning platform for high school physics: students pick cases (e.g. slope on a graph), assess the situation, and get LLM-powered gap analysis and feedback—with a Netflix-like scoring and recommendation system so they always know what to learn or review next.*

---

## Audience & topic

| | |
|---|---|
| **Audience** | High school students (e.g. physics). |
| **Topic example** | Slope (position–time, velocity–time, ramp, etc.); can extend to differentiation later. |
| **UI/UX** | Clear, friendly, built around a **skill map** and obvious next steps. |

---

## Five core mechanics

| # | Mechanic | Description |
|---|----------|-------------|
| 1 | **Skill map** | Concepts as nodes (e.g. “Slope from graph,” “Slope in physics”); **Not started / In progress / Mastered**; click node to open that skill. |
| 2 | **Case-based practice** | Student chooses among cases (e.g. “Ramp and block,” “Position vs time,” “Velocity vs time,” “Two points on a line”). |
| 3 | **Assess the situation** | In each case they answer questions (e.g. “What is the slope?” “What does it represent?”); answers go to the LLM. |
| 4 | **LLM gap analysis** | LLM (e.g. MiniMax) finds where they’re lacking and returns **targeted feedback** and a **suggested next case/skill**. |
| 5 | **Netflix-like scoring** | **Recommendation score:** e.g. “Recommended for you: Slope from graph (85% match)” in a card/row. **Mastery score:** e.g. “Slope: 72%” with a progress bar. **Personalised rows:** “Next for you,” “Review,” “Ready to master.” |

---

## Flow (e.g. slope)

1. **Skill map** → student sees concept nodes, clicks one.
2. **Choose case** → student picks a case (e.g. Ramp and block, Position vs time).
3. **Assess** → answer questions; submit to LLM.
4. **LLM analysis** → targeted feedback + suggested next case/skill.
5. **Feedback + scoring** → updated mastery % and recommendation rows.
6. **Back to map or dashboard** → student chooses next case or skill.

### Flow diagram

```
Student → Skill map → Choose case → Assess → LLM → Feedback + scores → next case/skill
```

```
┌──────────┐    ┌───────────┐    ┌────────┐    ┌─────┐    ┌──────────┐    ┌─────────────────────────┐
│ Student  │───▶│ Skill map │───▶│ Choose │───▶│Assess│───▶│   LLM    │───▶│ Feedback + scoring      │
│          │    │ (nodes)   │    │  case  │    │ (Q&A)│    │ (gap +   │    │ (mastery %, next case)  │
└──────────┘    └───────────┘    └────────┘    └──────┘    │  next)   │    └───────────┬─────────────┘
                                                           └──────────┘                │
                                                                                        ▼
                                                                              ┌─────────────────┐
                                                                              │ Back to map or  │
                                                                              │ choose next     │
                                                                              │ case/skill      │
                                                                              └─────────────────┘
```

---

## Award fit (reference)

| Award / partner | Fit |
|-----------------|-----|
| **RevisionDojo / OAX** | Adaptive learning, pedagogy. |
| **MiniMax** | LLM + optional audio/video. |
| **AWS** | Agent for “next case/skill” recommendations. |
| **HKUST** | EdTech, impact. |

---

## Where to build it

- **Figma:** Follow **FIGMA_IMPLEMENTATION_GUIDE.md** (tokens → components → screens → prototype).
- **Copy for Spec frame:** **spec-frame-content.md**.
- **Screen details:** **screen-specs.md**.
- **Component details:** **component-specs.md**.
- **Design tokens:** **design-tokens.md** / **design-tokens.json**.
