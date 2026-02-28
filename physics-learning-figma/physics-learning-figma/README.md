# Physics Learning Platform – Figma Frontend

Figma design package for the high school physics learning platform: **skill map**, **case-based practice**, **assess → LLM feedback**, and **Netflix-like scoring**.

## One-line pitch

*A learning platform for high school physics: students pick cases (e.g. slope on a graph), assess the situation, and get LLM-powered gap analysis and feedback—with a Netflix-like scoring and recommendation system so they always know what to learn or review next.*

## What’s in this folder

| File | Purpose |
|------|--------|
| **FIGMA_IMPLEMENTATION_GUIDE.md** | Step-by-step instructions to build the UI in Figma (tokens → components → screens → prototype). |
| **design-tokens.md** | Color and typography styles for Figma (friendly, clear UI for high school students). |
| **design-tokens.json** | Same tokens in JSON for code or tooling. |
| **component-specs.md** | Specs for Skill Map Node, Case Card, Question Block, Feedback Card, Recommendation/Mastery cards, Section Row, Nav Bar. |
| **screen-specs.md** | Specs for Skill Map, Choose Case, Assess, Feedback, Home/Dashboard, and prototype flow. |
| **spec-frame-content.md** | Copy-paste content for a Figma Spec page (flow diagram, five mechanics, token summary). |

## Flow (student journey)

1. **Skill map** → student sees concept nodes (Not started / In progress / Mastered), clicks one.
2. **Choose case** → picks a case (e.g. Ramp and block, Position vs time).
3. **Assess** → answers questions; submit to LLM.
4. **LLM analysis** → targeted feedback + suggested next case/skill.
5. **Feedback** → updated mastery % and recommendations.
6. **Dashboard** → “Next for you,” “Review,” “Ready to master” rows; back to map or next case.

## How to use

1. Open **FIGMA_IMPLEMENTATION_GUIDE.md** and follow Step 1 (create file + pages).
2. Set up **design tokens** (Step 2) from `design-tokens.md`.
3. Build **components** (Step 3) from `component-specs.md`.
4. Build **screens** (Step 4) from `screen-specs.md`.
5. Add **prototype** links (Step 5).
6. Optionally add a **Spec** frame using `spec-frame-content.md`.

After the file is in Figma, use your Figma MCP (e.g. **get_figma_data**, **download_figma_images**) with the file key to pull structure and assets into your repo for implementation.
