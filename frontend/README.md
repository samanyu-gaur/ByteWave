# Byte Wave – Web App

**Byte Wave** is a runnable web app that matches the **Figma specs** and **PLAN.md**: skill map, case-based practice, assess → feedback, and Netflix-like scoring. Planet images are used as visual notes on skills and cases.

## Run locally

```bash
cd app
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). Landing is `/`, learning app is `/learn`, chatbot is `/chat`.

### Physics Chat (MiniMax)

To use the **Chat** page (`/chat`), add your MiniMax API key:

1. Copy `app/.env.example` to `app/.env`
2. Set `VITE_MINIMAX_API_KEY=your_key` (get a key at [platform.minimax.io](https://platform.minimax.io))

## Flow

- **Dashboard** (`/learn`) → **Skill map** or cards → **Choose case** / **Assess**
- **Skill map** → tap a node (with planet note) → **Choose case**
- **Choose case** → tap a case (with planet note) → **Assess**
- **Assess** → “Get feedback” → **Feedback**
- **Feedback** → “Back to skill map” / “Choose another case” / “Try it” (suggested case)
- **Chat** (`/chat`) → ask the MiniMax-powered physics tutor anything

## Stack

- Vite + React
- React Router
- Design tokens from `../design-tokens.json` (CSS variables in `src/index.css`)

## Optional: connect to Figma

If you build the same UI in Figma using **FIGMA_IMPLEMENTATION_GUIDE.md**, use the Figma MCP **get_figma_data** with your file key to pull structure and **download_figma_images** for assets.
