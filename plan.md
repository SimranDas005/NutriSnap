NutriSnap - MVP Design Document

Overview

NutriSnap is a web application that allows users to upload a photo of a meal and receive an approximate nutritional analysis.

The primary goal is to eliminate manual calorie logging and provide a low-friction way for users to understand what they are eating.

This is an MVP intended to be built within 24 hours and therefore prioritizes simplicity and perceived intelligence over nutritional precision.

⸻

Problem Statement

Tracking calories and macros is tedious because users have to:

1. Search for foods manually
2. Estimate quantities
3. Log every meal

Many users abandon nutrition tracking because of this friction.

NutriSnap aims to reduce this process to:

Take photo → Receive nutrition estimate.

⸻

Product Goals

Primary Goals

* Upload a food image
* Identify dishes present in the image
* Estimate calories and macronutrients
* Allow users to correct mistakes
* Display results within a few seconds

Non-Goals (V1)

* Medical-grade accuracy
* Precise gram estimation
* User authentication
* Meal history
* Personalized recommendations
* Diet plans
* Weight tracking
* Barcode scanning
* Custom machine learning models

⸻

Success Criteria

A user should be able to:

1. Open application
2. Upload meal photo
3. Receive nutritional estimate
4. Finish flow in less than 30 seconds

⸻

User Flow

Landing Page
↓
Upload Image
↓
AI Analysis
↓
Detected Foods
↓
User Corrections
↓
Portion Selection
↓
Nutrition Calculation
↓
Results Page

⸻

Functional Requirements

Feature 1: Image Upload

Description

User can upload an image of a meal.

Supported Inputs

* JPG
* JPEG
* PNG

Acceptance Criteria

* User can drag and drop image
* User can browse local files
* Uploaded image preview is displayed
* Invalid file type shows error

⸻

Feature 2: Food Identification

Description

Image is sent to an LLM Vision API.

The model returns:

* Detected food items
* Confidence score
* Short explanation

Example Response

{
“foods”: [
{
“name”: “Chicken Biryani”,
“confidence”: 0.92
},
{
“name”: “Boiled Egg”,
“confidence”: 0.97
}
]
}

Acceptance Criteria

* Analysis completes in under 5 seconds
* Multiple dishes can be detected
* Confidence score displayed

⸻

Feature 3: Edit Detected Foods

Description

Users can modify AI output.

Examples:

Chicken Biryani
→ Veg Biryani

Fried Rice
→ Pulao

Acceptance Criteria

* Food names editable
* User can remove foods
* User can add new foods manually

⸻

Feature 4: Portion Selection

Description

Since image-based portion estimation is difficult, user supplies approximate serving size.

Portion Options

Small
Medium
Large

Alternative representation:

1 bowl
1 plate
2 plates

Implementation should use:

Small
Medium
Large

Acceptance Criteria

Every food item requires portion selection.

⸻

Feature 5: Nutrition Calculation

Description

Calculate nutritional estimates using a static food database.

Each food item contains:

* Calories
* Protein
* Carbohydrates
* Fat

Example Database Entry

{
“chicken biryani”: {
“small”: {
“calories”: 400,
“protein”: 18,
“carbs”: 45,
“fat”: 15
},
“medium”: {
“calories”: 650,
“protein”: 25,
“carbs”: 65,
“fat”: 22
},
“large”: {
“calories”: 850,
“protein”: 32,
“carbs”: 90,
“fat”: 30
}
}
}

Acceptance Criteria

Application displays:

Per-item nutrition
Total nutrition

⸻

Feature 6: Results Screen

Display

For each food:

Food Name
Calories
Protein
Carbohydrates
Fat

Display aggregated totals:

Total Calories
Total Protein
Total Carbohydrates
Total Fat

Example

Chicken Biryani
650 kcal
Protein: 25 g
Carbs: 65 g
Fat: 22 g

Boiled Egg
78 kcal
Protein: 6 g
Carbs: 1 g
Fat: 5 g

Total
728 kcal
Protein: 31 g
Carbs: 66 g
Fat: 27 g

⸻

Error Handling

Invalid Image

Message:
“Please upload a JPG or PNG image.”

AI Failure

Message:
“Unable to analyze image. Please try another photo.”

Unknown Food

Message:
“We could not confidently identify this food. Please enter it manually.”

⸻

Architecture

Frontend (Next.js)
↓
Backend API (Go)
↓
Gemini Vision API
↓
Nutrition Calculator
↓
Static Nutrition Database

No database required for V1.

Application should be completely stateless.

⸻

Tech Stack

Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

Backend

* Go
* Gin or net/http

AI

* Gemini Vision API

Storage

* In-memory only

Deployment

* Vercel (frontend)
* Render/Fly.io (backend)

⸻

API Design

POST /analyze

Purpose:
Analyze uploaded image.

Request

multipart/form-data

Fields:

image: file

Response

{
“foods”: [
{
“name”: “Chicken Biryani”,
“confidence”: 0.92
},
{
“name”: “Boiled Egg”,
“confidence”: 0.97
}
]
}

⸻

POST /nutrition

Purpose:
Calculate nutrition totals.

Request

{
“foods”: [
{
“name”: “Chicken Biryani”,
“portion”: “medium”
},
{
“name”: “Boiled Egg”,
“portion”: “small”
}
]
}

Response

{
“items”: [
{
“name”: “Chicken Biryani”,
“calories”: 650,
“protein”: 25,
“carbs”: 65,
“fat”: 22
}
],
“totals”: {
“calories”: 728,
“protein”: 31,
“carbs”: 66,
“fat”: 27
}
}

⸻

Internal Data Models

FoodDetection

{
“name”: “string”,
“confidence”: “number”
}

NutritionEntry

{
“calories”: “number”,
“protein”: “number”,
“carbs”: “number”,
“fat”: “number”
}

FoodSelection

{
“name”: “string”,
“portion”: “small | medium | large”
}

⸻

Gemini Prompt

You are a nutrition analysis assistant.

Analyze the uploaded meal image and identify all visible food items.

Return JSON only.

Schema:

{
“foods”: [
{
“name”: “string”,
“confidence”: “0.0-1.0”
}
]
}

Rules:

* Return common food names.
* Do not explain.
* Return valid JSON only.
* Include all visible dishes.
* If uncertain, provide best estimate.

⸻

Screens

Screen 1
Landing Page

* App logo
* Upload button
* Drag and drop zone

Screen 2
Analysis Loading

* Spinner
* “Analyzing your meal…”

Screen 3
Detected Foods

* Image preview
* Editable food list
* Confidence indicators
* Portion selectors
* Continue button

Screen 4
Results

* Macro cards
* Total calories
* Nutritional breakdown
* Analyze another meal button

⸻

Folder Structure

frontend/

src/
components/
UploadBox
FoodCard
PortionSelector
NutritionCard
LoadingScreen

pages/
index
results

services/
analyze.ts
nutrition.ts

types/

backend/

cmd/server
internal/
handlers
services
gemini
nutrition
models

assets/
nutrition-db.json

⸻

Build Order

Phase 1

* Project setup
* Upload page

Phase 2

* Gemini integration
* Parse response

Phase 3

* Editable food cards
* Portion selector

Phase 4

* Nutrition calculation service

Phase 5

* Results screen

Phase 6

* Error handling
* Deployment

⸻

Stretch Goals (Only If Time Permits)

* Camera capture
* Meal history in localStorage
* Share result as image
* Dark mode
* Daily calorie tracker

⸻

Definition of Done

A user can:

1. Upload meal photo
2. Receive detected foods
3. Correct foods if necessary
4. Select portions
5. View calories and macros
6. Complete the flow in less than 30 seconds

The application is deployed and usable from both desktop and mobile browsers.