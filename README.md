<div align="center">

# 📸 NutriSnap

**Snap a photo. Know your meal.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go&logoColor=white&style=for-the-badge)](https://golang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=googlegemini&logoColor=white&style=for-the-badge)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)

AI-powered food detection → instant, detailed nutrition breakdown for every bite you take.

</div>

---

## ✨ Features

<div align="center">

| 🍕 | 🧪 | ⚖️ | 📊 |
| --- | --- | --- | --- |
| **AI Dish Detection** | **Ingredient Breakdown** | **Weight-Based Estimates** | **Deep Nutrition Data** |
| Gemini vision identifies the *main dish* on the plate | Detects every major component & ingredient | Enter the dish weight in grams and we scale each nutrient to it | Calories, macros, fiber, sugar, sodium, vitamins & minerals |

</div>

- 🖼️ Drag-and-drop photo upload (JPG / PNG) with live preview
- 🧠 Google Gemini **2.5 Flash** vision model
- 🍽️ Identifies the **main dish** *and* its **major components/ingredients** (with confidence scores)
- ⚖️ Weight-based nutrition — type the total dish weight, nutrients are split across the components
- 📚 Static nutrition database fallback (small / medium / large portions) when no weight is given
- 📈 Full nutrient panel: calories, protein, carbs, fat, fiber, sugar, sodium, vitamin A, vitamin C, calcium, iron
- 🥧 Macro distribution bars + expandable per-component breakdown
- 🚦 Graceful quota handling (clear `429` message when the Gemini free tier is exhausted)
- 📱 Mobile-first, clean UI with TailwindCSS

---

## 🚀 Quick Start

### Prerequisites

> ✅ Go 1.21+ &nbsp;·&nbsp; ✅ Node.js 18+ &nbsp;·&nbsp; ✅ Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

### 1️⃣ Start the backend

```bash
cd backend
cp .env.example .env    # ✍️ add your GEMINI_API_KEY
go run ./cmd/server/main.go
```

> 🌐 Server runs at `http://localhost:8080`
>
> ⚠️ Run from the `backend/` directory — the server loads `.env` and `assets/nutrition-db.json` relative to the working directory.

### 2️⃣ Start the frontend

```bash
cd frontend
npm install
npm run dev
```

> 🌐 App runs at `http://localhost:3000`
>
> 🔌 Point the frontend at a different backend with `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`).

---

## 🔬 How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Upload    │ ──▶ │  Gemini Vision   │ ──▶ │    Weight Input     │
│    Photo    │     │  Dish + Parts    │     │   (grams of dish)   │
└─────────────┘     └──────────────────┘     └─────────┬───────────┘
                                                       ▼
                                              ┌─────────────────────┐
                                              │   Nutrition Engine  │
                                              │ (Gemini + static DB)│
                                              └─────────┬───────────┘
                                                        ▼
                                               ┌─────────────────────┐
                                               │   Results Screen    │
                                               │ 🏗️ per-ingredient  │
                                               └─────────────────────┘
```

1. **Upload** a meal photo.
2. **Analyze** — Gemini identifies the main dish and its major components, each with a confidence score and an estimated relative portion.
3. **Weigh** — you enter the total weight of the dish in grams (image-based gram estimation is unreliable).
4. **Calculate** — the weight is split across the components and Gemini estimates nutrition for each part; a static database provides a portion-based fallback.
5. **Review** — see totals, macro distribution, detailed nutrients, and a per-component breakdown.

---

## 🔌 API

### `POST /analyze`

Upload a meal image — get back the detected dish and its components.

```bash
curl -F "image=@my-meal.jpg" http://localhost:8080/analyze
```

```json
{
  "dish": "pizza",
  "parts": [
    { "name": "cheese", "confidence": 0.95, "portion": "medium" },
    { "name": "tomato sauce", "confidence": 0.88, "portion": "small" },
    { "name": "basil", "confidence": 0.80, "portion": "small" }
  ]
}
```

### `POST /nutrition`

Send the dish, its weight, and its components — get full nutrition totals.

```bash
curl -X POST http://localhost:8080/nutrition \
  -H "Content-Type: application/json" \
  -d '{
    "dish": "pizza",
    "weight_grams": 350,
    "foods": [
      { "name": "cheese", "portion": "medium" },
      { "name": "tomato sauce", "portion": "small" }
    ]
  }'
```

```json
{
  "items": [
    { "name": "cheese", "calories": 240, "protein": 14, "carbs": 2, "fat": 19, "...": "..." },
    { "name": "tomato sauce", "calories": 40, "protein": 1, "carbs": 7, "fat": 1, "...": "..." }
  ],
  "totals": {
    "calories": 280,
    "protein": 15,
    "carbs": 9,
    "fat": 20,
    "fiber": 2,
    "sugar": 5,
    "sodium": 600,
    "vitamin_a": 120,
    "vitamin_c": 6,
    "calcium": 180,
    "iron": 1.6
  }
}
```

> 💡 When `weight_grams` is omitted or `0`, the API falls back to the static portion database (`small` / `medium` / `large`).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Success |
| `400` | Invalid image, form data, or request body |
| `405` | Method not allowed |
| `429` | Gemini quota exceeded — try again later |
| `500` | Analysis failed — try another photo |

---

## 🗂️ Project Structure

```
Nutri/
├── 📦 backend/                 # Go API
│   ├── cmd/server/             # Entry point (main.go)
│   ├── internal/
│   │   ├── handlers/           # HTTP handlers + CORS + JSON helpers
│   │   ├── models/             # Request/response data models
│   │   └── services/
│   │       ├── gemini.go       # Gemini vision + nutrition estimation
│   │       └── nutrition.go    # Nutrition engine (weight + DB fallback)
│   ├── assets/
│   │   └── nutrition-db.json   # 💾 Static nutrition database
│   └── .env.example            # GEMINI_API_KEY, PORT
│
└── 🎨 frontend/                # Next.js app
    └── src/
        ├── components/         # UploadBox, LoadingScreen, NutritionCard…
        ├── pages/              # index (upload/weight) + results
        ├── services/           # analyze.ts, nutrition.ts API clients
        └── types/              # TypeScript types
```

---

## 🛠️ Tech Stack

| Layer     | Tech                                          |
| --------- | --------------------------------------------- |
| 🖥️ Frontend | Next.js · React · TailwindCSS · TypeScript   |
| ⚙️ Backend  | Go · `net/http`                              |
| 🧠 AI       | Google Gemini 2.5 Flash (vision + text)      |
| 💾 Storage  | Static JSON database (in-memory & stateless) |

---

<div align="center">

**Made with 🧡 for people who just want to eat.**

[![Star](https://img.shields.io/github/stars/SimranDas005/NutriSnap?style=social)](https://github.com/SimranDas005/NutriSnap)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

</div>
