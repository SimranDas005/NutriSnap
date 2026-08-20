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

| 🍕 | 🧪 | 📊 | ⚡ |
| --- | --- | --- | --- |
| **AI Food Detection** | **Detailed Breakdown** | **Smart Estimates** | **Fast & Frictionless** |
| Gemini vision identifies the dish *and* every ingredient on the plate | Calories, macros, fiber, sugar, sodium, vitamins & minerals per item | Gemini fills the gaps for foods not in the database | No logging, no searching — just upload and go |

</div>

- 🖼️ Drag-and-drop photo upload (JPG / PNG)
- 🧠 Google Gemini 2.5 Flash vision model
- 🍽️ Per-ingredient nutrition: protein, carbs, fat, fiber, sugar, sodium, vitamin A, vitamin C, calcium, iron
- 🥧 Gemini-powered estimates for anything missing from the database
- 📏 Portion-based adjustments (small / medium / large)
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

### 2️⃣ Start the frontend

```bash
cd frontend
npm install
npm run dev
```

> 🌐 App runs at `http://localhost:3000`

---

## 🔬 How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Upload    │ ──▶ │  Gemini Vision   │ ──▶ │   Nutrition Engine  │
│    Photo    │     │  Dish Detection  │     │  (DB + AI fallback) │
└─────────────┘     └──────────────────┘     └─────────┬───────────┘
                                                       ▼
                                              ┌─────────────────────┐
                                              │   Results Screen    │
                                              │ 🏗️ per-ingredient  │
                                              └─────────────────────┘
```

---

## 🔌 API

### `POST /analyze`
Upload a meal image — get back detected foods.

```bash
curl -F "image=@my-meal.jpg" http://localhost:8080/analyze
```

### `POST /nutrition`
Send detected foods + portions — get full nutrition totals.

```bash
curl -X POST http://localhost:8080/nutrition \
  -H "Content-Type: application/json" \
  -d '{"foods":[{"name":"pizza","portion":"medium"}]}'
```

---

## 🗂️ Project Structure

```
NutriSnap/
├── 📦 backend/               # Go API
│   ├── cmd/server/           # Entry point
│   ├── internal/
│   │   ├── handlers/         # HTTP handlers
│   │   ├── models/           # Data models
│   │   └── services/         # Gemini + nutrition logic
│   └── assets/
│       └── nutrition-db.json # 💾 Static nutrition database
│
└── 🎨 frontend/              # Next.js app
    └── src/
        ├── components/       # UploadBox, FoodCard, NutritionCard…
        ├── pages/            # Home (upload) + Results
        ├── services/         # API clients
        └── types/            # TypeScript types
```

---

## 🛠️ Tech Stack

| Layer     | Tech                                          |
| --------- | --------------------------------------------- |
| 🖥️ Frontend | Next.js · React · TailwindCSS · TypeScript   |
| ⚙️ Backend  | Go · `net/http`                              |
| 🧠 AI       | Google Gemini Vision API                     |
| 💾 Storage  | Static JSON database (in-memory & stateless) |

---

<div align="center">

**Made with 🧡 for people who just want to eat.**

[![Star](https://img.shields.io/github/stars/SimranDas005/NutriSnap?style=social)](https://github.com/SimranDas005/NutriSnap)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

</div>