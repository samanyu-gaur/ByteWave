# Physics Learning Platform – Component Specs

Build these on the **Components** page with **Auto layout** (Shift+A). Reference `design-tokens.md` for colors and text styles.

---

## 1. Skill Map Node

**Purpose:** One concept node on the skill map (e.g. “Slope from graph,” “Slope in physics”). Click to open that skill.

- **Frame:** Auto layout **Horizontal** (or **Vertical** for stack), padding 12–16, corner radius 12, min height 48.
- **Content:** Icon (optional, 24×24) + **Text** (Headline 3 or Body, concept name).
- **States (variants):**
  - **Not started:** Fill Primary/Background Secondary, border 1px Skill/Not started, text Primary/Text Muted. Left border or dot: Accent/Neutral.
  - **In progress:** Border 2px Skill/In progress, fill light amber tint (e.g. #FFFBEB), text Primary/Text. Badge or dot: “In progress” (Label, Skill/In progress).
  - **Mastered:** Border 1px Skill/Mastered, fill light green tint (e.g. #ECFDF5), text Primary/Text. Checkmark icon or “Mastered” (Label, Skill/Mastered).
- **Create component** → **Skill Map Node**. Add **Component set** with property **State**: Not started | In progress | Mastered.
- Optional: property **Size**: Compact (padding 8) | Default.

---

## 2. Case Card

**Purpose:** One case the student can choose (e.g. “Ramp and block,” “Position vs time,” “Velocity vs time,” “Two points on a line”).

- **Frame:** Auto layout **Vertical**, padding 16, corner radius 12, fill Primary/Background Secondary, border 1px Border/Light. Width: e.g. 160–200 (card in a row) or full width in list.
- **Top:** Optional small **thumbnail** (e.g. 48×48 or 64×64) – graph/ramp illustration or placeholder.
- **Title:** Headline 3 or Body, bold – case name.
- **Subtitle (optional):** Caption, muted – e.g. “Slope from graph.”
- **Bottom row:** Label “Start” or “Continue” (Button or Label, Accent/Main) + optional chevron 16×16.
- **Create component** → **Case Card**. Variants: **State** Default | Hover (slight shadow). Optional: **Match score** – show “85% match” (Score/Number + Caption) when used in recommendation row.

---

## 3. Question Block (Assess)

**Purpose:** One question in the “Assess the situation” step (e.g. “What is the slope?” “What does it represent?”).

- **Frame:** Auto layout **Vertical**, gap 12, padding 16, fill Primary/Background Secondary, corner radius 12.
- **Question text:** Body or Headline 3 – the question.
- **Input area:** 
  - **Short answer:** Rectangle/frame, height 48, corner radius 10, stroke 1px Border/Medium, placeholder “Your answer…” (Body Small, muted).
  - **Multiple choice (optional variant):** Vertical list of options (frame + radio circle + Body). One option selected: border Accent/Main.
- **Create component** → **Question Block**. Variants: **Type** Short answer | Multiple choice. Optional: **State** Default | Filled | Correct | Incorrect (for feedback state).

---

## 4. Submit / Send to LLM Button

- **Frame:** Auto layout, padding 16 H / 12 V, corner radius 10, fill Accent/Main. Text “Submit” or “Get feedback” (Button style, white).
- **Create component** → **Button/Primary**. Variants: Default | Hover (Accent/Hover) | Loading (disabled + spinner placeholder) | Disabled (muted).

---

## 5. Feedback Card (LLM gap analysis)

**Purpose:** Shows LLM feedback and suggested next case/skill.

- **Frame:** Auto layout **Vertical**, padding 16, gap 12, corner radius 12, fill Primary/Background Secondary, border 1px Border/Light (or left border 4px Accent/Main).
- **Header:** “Feedback” or “Here’s what to focus on” (Headline 3).
- **Body:** 2–4 lines of **Body** text – targeted feedback from LLM (placeholder: “Focus on what slope represents in position–time graphs. Try the ‘Position vs time’ case next.”).
- **Suggested next:** Row with Label “Suggested next” + **Case Card** (compact) or **Skill Map Node** (compact) + “Try it” (Button/Text).
- **Create component** → **Feedback Card**. Optional variant: **Tone** Positive (green tint) | Neutral | Needs work (amber tint).

---

## 6. Recommendation Score Card (Netflix-like)

**Purpose:** “Recommended for you: Slope from graph (85% match)” in a card or row.

- **Frame:** Auto layout **Horizontal**, padding 12–16, gap 12, corner radius 12, fill Primary/Background Secondary. Align items center.
- **Left:** **Case Card** thumbnail + title (compact) or **Skill Map Node** (compact).
- **Right:** **Score/Number** “85%” (Recommendation/High color) + Caption “match” or “Recommended for you”.
- **Create component** → **Recommendation Card**. Variants: **Layout** Row | Card. Optional: **Match level** High (85%+) | Mid (60–84%) | Low (&lt;60%) for color.

---

## 7. Mastery Score Block

**Purpose:** “Slope: 72%” with progress bar.

- **Frame:** Auto layout **Vertical**, gap 8, padding 12–16.
- **Top row:** Label (e.g. “Slope”) (Body or Headline 3) + **Score/Number** “72%” (right-aligned).
- **Progress bar:** Rectangle, height 8, corner radius 4, fill Border/Light. Inner rectangle width 72% of parent, fill Accent/Success (or Accent/Warning if &lt;80%, Accent/Neutral if 0).
- **Create component** → **Mastery Score**. Variants: **Size** Compact | Default. Optional: **Show label** Yes | No.

---

## 8. Section Row (Netflix-like rows)

**Purpose:** Row title + horizontal scroll of cards (e.g. “Next for you,” “Review,” “Ready to master”).

- **Frame:** Auto layout **Vertical**, gap 12.
- **Row title:** Headline 3 – “Next for you” | “Review” | “Ready to master” | “Recommended for you.”
- **Horizontal scroll:** Frame with auto layout **Horizontal**, gap 12, clip content. Inside: 3–4 **Case Card** or **Recommendation Card** instances (so user sees scroll).
- **Create component** → **Section Row**. Variants: **Title** Next for you | Review | Ready to master | Recommended.

---

## 9. Top App Bar / Nav Bar

- **Frame:** Auto layout **Horizontal**, height 56, padding H 24, fill Primary/Background Secondary (or Primary/Background). Bottom border 1px Border/Light.
- **Left:** Back arrow (24×24) when applicable; else logo or “Physics” (Headline 3).
- **Center (optional):** Screen title (Body Small, muted).
- **Right:** Optional icon (e.g. profile or settings) 24×24 in 44×44 tap area.
- **Create component** → **Nav Bar**. Variants: **Back** Hidden | Visible. **Title**: None | Skill map | Choose case | Assess | Feedback | Home.

---

## 10. Bottom Tab Bar (optional)

- Same pattern as newspaper app: 4 items – e.g. **Home** (dashboard), **Skill map**, **Practice**, **Profile**. Icon + Caption. Variant **Selected** (Accent/Main) / Default (muted).
- **Create component** → **Bottom Tab Bar**.

---

## 11. Progress Indicator (optional)

- **Step indicator:** 3–4 dots or “1 – 2 – 3 – 4” for flow: Map → Choose case → Assess → Feedback. Active step: Accent/Main; done: Accent/Success; upcoming: Accent/Neutral.
- **Create component** → **Progress Indicator**. Property **Step**: 1 | 2 | 3 | 4.

---

## Checklist

- [ ] Skill Map Node (3 states)
- [ ] Case Card (optional match %)
- [ ] Question Block (short answer / multiple choice)
- [ ] Button/Primary (Submit)
- [ ] Feedback Card
- [ ] Recommendation Score Card
- [ ] Mastery Score Block (progress bar)
- [ ] Section Row (4 title variants)
- [ ] Nav Bar (back + title variants)
- [ ] Bottom Tab Bar (optional)
- [ ] Progress Indicator (optional)
