export interface FoodDetection {
  name: string
  confidence: number
}

export interface AnalyzeResponse {
  dish: string
  parts: FoodDetection[]
}

export interface FoodSelection {
  name: string
}

export interface NutritionRequest {
  dish: string
  weight_grams: number
  foods: FoodSelection[]
}

export interface NutritionEntry {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  vitamin_a: number
  vitamin_c: number
  calcium: number
  iron: number
}

export interface NutritionItem extends NutritionEntry {
  name: string
}

export interface NutritionResponse {
  items: NutritionItem[]
  totals: NutritionEntry
}
