export interface FoodDetection {
  name: string
  confidence: number
}

export interface AnalyzeResponse {
  foods: FoodDetection[]
}

export interface FoodSelection {
  name: string
  portion: 'small' | 'medium' | 'large'
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
