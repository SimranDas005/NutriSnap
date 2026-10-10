package services

import (
	"fmt"
	"log"

	"github.com/simran/nutrisnap/internal/models"
)

type NutritionService struct {
	gemini *GeminiService
}

func NewNutritionService(gemini *GeminiService) *NutritionService {
	return &NutritionService{gemini: gemini}
}

// Calculate splits the total dish weight across its parts and estimates the
// nutrition of each part with Gemini.
func (s *NutritionService) Calculate(req *models.NutritionRequest) (*models.NutritionResponse, error) {
	if len(req.Foods) == 0 {
		return nil, fmt.Errorf("no foods provided")
	}
	if req.WeightGrams <= 0 {
		return nil, fmt.Errorf("dish weight is required")
	}

	perPart := req.WeightGrams / float64(len(req.Foods))

	var items []models.NutritionItem
	totals := models.NutritionEntry{}

	for _, selection := range req.Foods {
		entry, err := s.gemini.EstimateNutritionForWeight(selection.Name, perPart)
		if err != nil {
			log.Printf("Gemini weight estimation failed for %q: %v", selection.Name, err)
			entry = &models.NutritionEntry{}
		}

		items = append(items, models.NutritionItem{
			Name:     selection.Name,
			Calories: entry.Calories,
			Protein:  entry.Protein,
			Carbs:    entry.Carbs,
			Fat:      entry.Fat,
			Fiber:    entry.Fiber,
			Sugar:    entry.Sugar,
			Sodium:   entry.Sodium,
			VitaminA: entry.VitaminA,
			VitaminC: entry.VitaminC,
			Calcium:  entry.Calcium,
			Iron:     entry.Iron,
		})

		totals.Calories += entry.Calories
		totals.Protein += entry.Protein
		totals.Carbs += entry.Carbs
		totals.Fat += entry.Fat
		totals.Fiber += entry.Fiber
		totals.Sugar += entry.Sugar
		totals.Sodium += entry.Sodium
		totals.VitaminA += entry.VitaminA
		totals.VitaminC += entry.VitaminC
		totals.Calcium += entry.Calcium
		totals.Iron += entry.Iron
	}

	return &models.NutritionResponse{
		Items:  items,
		Totals: totals,
	}, nil
}
