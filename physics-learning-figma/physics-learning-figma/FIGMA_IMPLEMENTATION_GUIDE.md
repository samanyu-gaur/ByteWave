# Figma Implementation Guide – Physics Learning Platform

Step-by-step instructions to build the frontend design in Figma. Audience: high school students (e.g. physics). Topic example: Slope (position–time, velocity–time, ramp). UI: clear, friendly, skill map + case-based practice + LLM feedback + Netflix-like scoring.

Reference files in this folder: `design-tokens.md`, `design-tokens.json`, `component-specs.md`, `screen-specs.md`.

---

## Flow diagram (student journey)

```
Student → Skill map → Choose case → Assess (answer questions) → LLM analysis
    → Feedback + updated scores/recommendations → Choose next case or skill (back to map)
```

---

## Step 1: Create the Figma file

1. In Figma, create a **New design file**.
2. Name it e.g. **“Physics Learning Platform”** or **“RevisionDojo – Slope”**.
3. Create **pages**:
   - **Foundation** (design tokens)
   - **Components**
   - **Screens**
   - **Spec** (optional – documentation frame)

---

## Step 2: Set up design tokens

### 2.1 Color styles

1. Go to **Foundation** page.
2. **Design** panel → **Local styles** → **Color styles** (or **Fill**).
3. Create each color from `design-tokens.md`:

   **Primary**
   - **Primary/Text** → `#1A1A2E`
   - **Primary/Text Muted** → `#5C5C6E`
   - **Primary/Background** → `#F8F9FC`
   - **Primary/Background Secondary** → `#FFFFFF`

   **Accent**
   - **Accent/Main** → `#6366F1`
   - **Accent/Hover** → `#4F46E5`
   - **Accent/Success** → `#10B981`
   - **Accent/Warning** → `#F59E0B`
   - **Accent/Neutral** → `#94A3B8`

   **Skill states**
   - **Skill/Not started** → `#94A3B8`
   - **Skill/In progress** → `#F59E0B`
   - **Skill/Mastered** → `#10B981`

   **Border**
   - **Border/Light** → `#E2E8F0`
   - **Border/Medium** → `#CBD5E1`

   **Recommendation**
   - **Recommendation/High** → `#6366F1`
   - **Recommendation/Mid** → `#8B5CF6`
   - **Recommendation/Low** → `#A78BFA`

### 2.2 Text styles

1. Add **Inter** (and optionally **DM Sans**) via Figma → Resources → Add font (Google Fonts).
2. **Local styles** → **Text** → create:

   - **Headline 1**: Inter, 24px, Bold (700), line height 32px  
   - **Headline 2**: Inter, 20px, Semibold (600), line height 28px  
   - **Headline 3**: Inter, 18px, Semibold (600), line height 24px  
   - **Body**: Inter, 16px, Regular (400), line height 24px  
   - **Body Small**: Inter, 14px, Regular, line height 20px  
   - **Caption**: Inter, 12px, Regular, line height 16px  
   - **Label**: Inter, 12px, Semibold (600), letter spacing 0.5px  
   - **Button**: Inter, 16px, Semibold (600), line height 24px  
   - **Score/Number**: Inter, 20px, Bold (700), line height 28px  

3. Apply **Primary/Text** or **Primary/Text Muted** to styles as needed.

---

## Step 3: Create components

Work on the **Components** page. Use **Auto layout** (Shift+A) for all.

### 3.1 Skill Map Node

1. Frame with auto layout **Horizontal**, padding 12–16, corner radius 12, min height 48.
2. Add text (Headline 3): e.g. “Slope from graph.”
3. Duplicate for **Not started** (border + muted), **In progress** (amber border + badge), **Mastered** (green border + checkmark).
4. **Create component** → **Skill Map Node**. Add **Component set** with **State**: Not started | In progress | Mastered.

### 3.2 Case Card

1. Frame: auto layout **Vertical**, padding 16, corner radius 12, fill Primary/Background Secondary, border 1px Border/Light. Width ~180 or full.
2. Add optional thumbnail (e.g. 64×64), title (Headline 3), subtitle (Caption, muted), “Start” (Button style, Accent/Main).
3. **Create component** → **Case Card**. Optional: variant with “85% match” (Score/Number + Caption).

### 3.3 Question Block (Assess)

1. Frame: vertical auto layout, gap 12, padding 16, fill Primary/Background Secondary, corner radius 12.
2. Question text (Body), input rectangle (height 48, corner radius 10, stroke Border/Medium), placeholder “Your answer…”.
3. **Create component** → **Question Block**.

### 3.4 Button Primary (Submit)

1. Frame: padding 16 H / 12 V, corner radius 10, fill Accent/Main. Text “Submit” or “Get feedback” (Button, white).
2. **Create component** → **Button/Primary**.

### 3.5 Feedback Card

1. Frame: vertical auto layout, padding 16, gap 12, corner radius 12, fill Primary/Background Secondary, left border 4px Accent/Main.
2. “Feedback” (Headline 3), body placeholder (Body), “Suggested next” + compact Case Card + “Try it” (Button/Text).
3. **Create component** → **Feedback Card**.

### 3.6 Recommendation Card

1. Frame: horizontal auto layout, padding 12–16, gap 12, corner radius 12. Left: Case Card compact or title; right: “85%” (Score/Number, Recommendation/High) + “match” (Caption).
2. **Create component** → **Recommendation Card**.

### 3.7 Mastery Score

1. Frame: vertical auto layout, gap 8. Row: “Slope” (Body) + “72%” (Score/Number). Progress bar: height 8, corner radius 4, fill 72% Accent/Success.
2. **Create component** → **Mastery Score**.

### 3.8 Section Row

1. Frame: vertical auto layout, gap 12. Title (Headline 3) “Next for you”. Horizontal frame with 3–4 Case Cards (clip content for scroll).
2. **Create component** → **Section Row**. Duplicate for titles: “Review”, “Ready to master”, “Recommended for you”.

### 3.9 Nav Bar

1. Frame: horizontal auto layout, height 56, padding H 24, fill Primary/Background Secondary, bottom border 1px. Back arrow (optional), title (Headline 3 or Body Small), optional right icon.
2. **Create component** → **Nav Bar**. Variants: **Back** Hidden | Visible. **Title**: e.g. Skill map | Choose case | Assess | Feedback | Home.

### 3.10 Progress Indicator (optional)

1. 4 steps: 1 – 2 – 3 – 4 (or dots). Active: Accent/Main; done: Accent/Success; upcoming: Neutral.
2. **Create component** → **Progress Indicator**.

---

## Step 4: Build screens

Use **Screens** page. Each main screen: **Frame 390 × 844**.

### 4.1 Skill Map

1. Frame 390×844, fill Primary/Background.
2. **Nav Bar** “Skill map”.
3. Vertical layout: “Slope” (Headline 2), “Pick a concept to practice.” (Body Small, muted).
4. 4–6 **Skill Map Node** instances (mix Not started / In progress / Mastered) from `screen-specs.md`.
5. Optional: **Mastery Score** “Slope: 72%”, **Button/Text** “Go to dashboard”.

### 4.2 Choose Case

1. Frame 390×844. **Nav Bar** back + “Choose a case”.
2. “Pick a scenario to practice.” (Headline 3), short subtitle (Body Small, muted).
3. Vertical list or horizontal scroll of **Case Card**: Ramp and block, Position vs time, Velocity vs time, Two points on a line.

### 4.3 Assess

1. Frame 390×844 (or taller for scroll). **Nav Bar** back + “Assess”. Optional **Progress Indicator** step 2.
2. Case name (Headline 3), 2–3 **Question Block**, **Button/Primary** “Submit”.

### 4.4 Feedback

1. Frame 390×844. **Nav Bar** back + “Feedback”. Optional **Progress Indicator** step 4.
2. **Feedback Card** with placeholder LLM feedback and “Suggested next” case.
3. **Mastery Score** “Slope: 72%”.
4. **Button/Primary** “Back to skill map”, **Button/Text** “Choose another case”, “Try it” on suggested case.

### 4.5 Home / Dashboard

1. Frame 390×844. **Nav Bar** “Home”.
2. “Hi, [Name]” or “Your learning” (Headline 2), “Here’s what’s next.” (Body Small).
3. **Mastery Score** “Slope: 72%”.
4. **Section Row** “Next for you” with **Recommendation Card** (85% match, 78% match).
5. **Section Row** “Review” with **Case Card** instances.
6. **Section Row** “Ready to master” with cards.
7. **Button/Text** “Open full skill map”.

### 4.6 Splash (optional)

1. Frame 390×844. Logo, tagline “Learn physics by doing”, **Button/Primary** “Get started”.

---

## Step 5: Prototype

1. **Splash** → “Get started” → **Home**.
2. **Home** → “Open full skill map” → **Skill map**; tap a recommendation card → **Choose case** or **Assess**.
3. **Skill map** → tap a **Skill Map Node** → **Choose case**.
4. **Choose case** → tap **Case Card** → **Assess**.
5. **Assess** → “Submit” → **Feedback**.
6. **Feedback** → “Back to skill map” → **Skill map**; “Choose another case” → **Choose case**; “Try it” → **Assess**.

Use **Prototype** tab: On tap → Navigate to [frame]. Transition: e.g. Slide left or Instant.

---

## Step 6: Document (Spec page, optional)

1. On **Spec** page, create a frame with flow diagram and short notes:
   - **Flow:** Student → Skill map → Choose case → Assess → LLM → Feedback + scores → next case/skill.
   - **Five mechanics:** Skill map, Case-based practice, Assess the situation, LLM gap analysis, Netflix-like scoring.
   - List tokens and key components (see `spec-frame-content.md` in this folder).

---

## Checklist

- [ ] Foundation: All color and text styles from `design-tokens.md`.
- [ ] Components: Skill Map Node, Case Card, Question Block, Button/Primary, Feedback Card, Recommendation Card, Mastery Score, Section Row, Nav Bar (and optional Progress Indicator, Bottom Tab Bar).
- [ ] Screens: Skill Map, Choose Case, Assess, Feedback, Home/Dashboard, (optional Splash).
- [ ] Prototype: All flow links as in Step 5.
- [ ] Spec frame with flow + mechanics (optional).

---

## Using the Figma MCP later

Once the file is in Figma:

- **File key:** From the URL `figma.com/file/XXXXX/...` or `figma.com/design/XXXXX/...`, the file key is `XXXXX`.
- Use **get_figma_data** (Framelink or Figma MCP) with that `fileKey` to pull structure into your repo.
- Use **download_figma_images** with `fileKey` and node IDs to export assets.

---

## One-line pitch (for reference)

*“A learning platform for high school physics: students pick cases (e.g. slope on a graph), assess the situation, and get LLM-powered gap analysis and feedback—with a Netflix-like scoring and recommendation system so they always know what to learn or review next.”*
