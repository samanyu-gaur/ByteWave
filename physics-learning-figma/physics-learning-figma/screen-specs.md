# Physics Learning Platform – Screen Specs

Build each screen on the **Screens** page. Frame size: **390 × 844** (mobile) or **768 × 1024** (tablet). Reference `component-specs.md` and `design-tokens.md`.

---

## Flow (student journey)

1. **Skill map** → student sees nodes, clicks one  
2. **Choose case** → student picks a case (e.g. Ramp and block, Position vs time)  
3. **Assess** → answer questions; submit to LLM  
4. **LLM analysis** → feedback + suggested next case/skill  
5. **Back to map or dashboard** → updated scores and recommendations  

---

## 1. Skill Map

**Purpose:** Concepts as nodes; Not started / In progress / Mastered; click node to open that skill.

- **Frame:** 390×844, fill Primary/Background.
- **Nav Bar:** Title “Skill map” or “Slope – Concepts”; optional back to Home.
- **Content:** Vertical auto layout, padding 24, gap 16.
  - **Headline 2:** “Slope” (or current topic).
  - **Subtitle:** Body Small, muted – “Pick a concept to practice.”
  - **Skill nodes:** 4–6 **Skill Map Node** instances in a vertical list (or 2 columns on tablet), mix of states:
    - “Slope from graph” – In progress  
    - “Slope in physics” – Not started  
    - “Position–time graph” – Mastered  
    - “Velocity–time graph” – Not started  
    - “Two points on a line” – Not started  
    - “Ramp and block” – In progress  
  - Optional at bottom: **Mastery Score** block for “Slope: 72%” and **Button/Text** “Go to dashboard”.
- **Prototype:** Tap a node → navigate to **Choose case** (for that skill).

---

## 2. Choose Case

**Purpose:** Student chooses among cases (e.g. Ramp and block, Position vs time, Velocity vs time, Two points on a line).

- **Frame:** 390×844, fill Primary/Background.
- **Nav Bar:** Back (to Skill map), title “Choose a case” or “Slope from graph”.
- **Content:** Vertical auto layout, padding 24, gap 24.
  - **Headline 3:** “Pick a scenario to practice.”
  - **Body Small, muted:** “Answer questions and get personalised feedback.”
  - **Case list:** Vertical stack of **Case Card** (full width) or horizontal scroll row:
    - “Ramp and block” – “Slope on a ramp”
    - “Position vs time” – “Slope from graph”
    - “Velocity vs time” – “Slope from graph”
    - “Two points on a line” – “Slope from two points”
  - Each card tappable → **Assess**.
- **Prototype:** Tap Case Card → **Assess** screen.

---

## 3. Assess (questions)

**Purpose:** In each case, student answers questions (e.g. “What is the slope?” “What does it represent?”); answers go to LLM.

- **Frame:** 390×844 (or taller, e.g. 1200, to show scroll). Fill Primary/Background.
- **Nav Bar:** Back (to Choose case), title “Assess” or case name.
- **Optional:** **Progress Indicator** – step 2 of 4 (Map → Choose case → **Assess** → Feedback).
- **Content:** Vertical auto layout, padding 24, gap 24.
  - **Headline 3:** Case name (e.g. “Position vs time”).
  - **2–3 Question Block** instances:
    - “What is the slope of the line?”
    - “What does the slope represent in this graph?”
    - “If time is in seconds and position in metres, what are the units of slope?”
  - **Button/Primary** “Submit” or “Get feedback” at bottom.
- **Prototype:** Tap Submit → **Feedback** screen.

---

## 4. Feedback (LLM gap analysis)

**Purpose:** LLM returns targeted feedback and a suggested next case/skill; updated scores/recommendations.

- **Frame:** 390×844 (or scrollable). Fill Primary/Background.
- **Nav Bar:** Back (to Assess or Choose case), title “Feedback”.
- **Optional:** **Progress Indicator** – step 4 of 4.
- **Content:** Vertical auto layout, padding 24, gap 24.
  - **Feedback Card:** Placeholder text: “Focus on what slope represents in position–time graphs. You’re strong on reading values; try linking slope to velocity next.”
  - **Suggested next:** “Suggested next” + compact **Case Card** “Velocity vs time” + “Try it” (Button/Text).
  - **Mastery Score** block: “Slope: 72%” (updated).
  - **Button/Primary** “Back to skill map” or “Choose another case”.
- **Prototype:** “Back to skill map” → **Skill Map**; “Choose another case” → **Choose case**; “Try it” → **Assess** (for suggested case).

---

## 5. Home / Dashboard (Netflix-like)

**Purpose:** Recommendation score, mastery score, personalised rows so student always knows what to learn or review next.

- **Frame:** 390×844 (or 768×1024). Fill Primary/Background.
- **Nav Bar:** “Home” or “Physics” or app name; optional profile icon.
- **Content:** Vertical auto layout, scrollable, padding 24, gap 24.
  - **Welcome:** Headline 2 “Hi, [Name]” or “Your learning”; Body Small “Here’s what’s next.”
  - **Mastery summary:** One **Mastery Score** block: “Slope: 72%” with progress bar.
  - **Section Row – “Next for you”:** Horizontal row of **Recommendation Card** or **Case Card** with match %:
    - “Slope from graph – 85% match”
    - “Velocity vs time – 78% match”
  - **Section Row – “Review”:** Row of **Case Card** or **Skill Map Node** (in progress): e.g. “Position vs time”, “Ramp and block”.
  - **Section Row – “Ready to master”:** Row of concepts/cases close to mastery (e.g. 80%+).
  - **Button/Text** “Open full skill map” → **Skill Map**.
- **Prototype:** “Open full skill map” → **Skill Map**; tap any card → **Choose case** or **Assess**.

---

## 6. Splash / Onboarding (optional)

- **Frame:** 390×844. Logo, tagline (“Learn physics by doing”), **Button/Primary** “Get started” → **Home** or **Skill map**.

---

## Prototype flow summary

- **Splash** → Get started → **Home**
- **Home** → Open skill map → **Skill map**; tap card → **Choose case** or **Assess**
- **Skill map** → tap node → **Choose case**
- **Choose case** → tap case → **Assess**
- **Assess** → Submit → **Feedback**
- **Feedback** → Back to skill map → **Skill map**; Choose another case → **Choose case**; Try it → **Assess**

---

## Checklist

- [ ] Skill Map
- [ ] Choose Case
- [ ] Assess (questions + submit)
- [ ] Feedback (LLM card + suggested next + mastery)
- [ ] Home / Dashboard (Netflix-like rows)
- [ ] Splash (optional)
- [ ] All prototype links set
