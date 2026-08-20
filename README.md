# NutriSnap

Snap a photo of your meal and get instant nutrition analysis with AI-powered food detection.

## How it works

1. **Upload** a photo of your meal
2. **AI detection** (Google Gemini vision) identifies the dish and all its parts/ingredients
3. **Review** the detected foods, adjust portions if needed
4. **Get results** — full nutrition breakdown per ingredient: calories, protein, carbs, fat, fiber, sugar, sodium, vitamin A, vitamin C, calcium, and iron

## Features

- AI food detection from photos (Gemini 2.5 Flash)
- Detailed nutrition breakdown per ingredient
- Gemini-powered nutrition estimates for foods not in the local database
- Portion-based adjustments (small / medium / large)
- Mobile-first UI with drag-and-drop upload

## Tech Stack

| Layer     | Tech                                         |
| --------- | -------------------------------------------- |
| Frontend  | Next.js, React, TailwindCSS, TypeScript      |
| Backend   | Go (`net/http`)                              |
| AI        | Google Gemini Vision API                     |
| Storage   | Static JSON nutrition database (in-memory)   |

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- A Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

### 1. Start the backend

```bash
cd backend
cp .env.example .env   # add your GEMINI_API_KEY
go run ./cmd/server/main.go
```

Server runs at `http://localhost:8080`.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## API

### `POST /analyze`

Upload a meal image (`multipart/form-data`, field: `image`) and get detected foods.

### `POST /nutrition`

Send detected food names with portions and get full nutrition totals.

## Project Structure

```
backend/
  cmd/server/          # Go entry point
  internal/
    handlers/          # HTTP handlers
    models/            # Data models
    services/          # Gemini + nutrition logic
  assets/
    nutrition-db.json  # Static nutrition database
frontend/
  src/
    components/        # UploadBox, FoodCard, NutritionCard, etc.
    pages/             # Home (upload) + Results
    services/          # API client functions
    types/             # TypeScript types
```

## License

MIT