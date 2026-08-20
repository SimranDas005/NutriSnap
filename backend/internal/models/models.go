package models

type FoodDetection struct {
	Name       string  `json:"name"`
	Confidence float64 `json:"confidence"`
}

type AnalyzeResponse struct {
	Foods []FoodDetection `json:"foods"`
}

type FoodSelection struct {
	Name    string `json:"name"`
	Portion string `json:"portion"`
}

type NutritionRequest struct {
	Foods []FoodSelection `json:"foods"`
}

type NutritionEntry struct {
	Calories float64 `json:"calories"`
	Protein  float64 `json:"protein"`
	Carbs    float64 `json:"carbs"`
	Fat      float64 `json:"fat"`
	Fiber    float64 `json:"fiber"`
	Sugar    float64 `json:"sugar"`
	Sodium   float64 `json:"sodium"`
	VitaminA float64 `json:"vitamin_a"`
	VitaminC float64 `json:"vitamin_c"`
	Calcium  float64 `json:"calcium"`
	Iron     float64 `json:"iron"`
}

type NutritionItem struct {
	Name string  `json:"name"`
	Calories float64 `json:"calories"`
	Protein  float64 `json:"protein"`
	Carbs    float64 `json:"carbs"`
	Fat      float64 `json:"fat"`
	Fiber    float64 `json:"fiber"`
	Sugar    float64 `json:"sugar"`
	Sodium   float64 `json:"sodium"`
	VitaminA float64 `json:"vitamin_a"`
	VitaminC float64 `json:"vitamin_c"`
	Calcium  float64 `json:"calcium"`
	Iron     float64 `json:"iron"`
}

type NutritionResponse struct {
	Items  []NutritionItem `json:"items"`
	Totals NutritionEntry  `json:"totals"`
}

type PortionSizes map[string]NutritionEntry

type NutritionDB map[string]PortionSizes

type ErrorResponse struct {
	Error string `json:"error"`
}
