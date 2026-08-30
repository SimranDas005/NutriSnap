package services

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/simran/nutrisnap/internal/models"
)

type NutritionService struct {
	db     models.NutritionDB
	gemini *GeminiService
}

func NewNutritionService(gemini *GeminiService) (*NutritionService, error) {
	data, err := os.ReadFile("assets/nutrition-db.json")
	if err != nil {
		return nil, fmt.Errorf("failed to read nutrition DB: %w", err)
	}

	var db models.NutritionDB
	if err := json.Unmarshal(data, &db); err != nil {
		return nil, fmt.Errorf("failed to parse nutrition DB: %w", err)
	}

	return &NutritionService{db: db, gemini: gemini}, nil
}

func (s *NutritionService) lookup(name string) (models.PortionSizes, bool) {
	cleaned := strings.ToLower(strings.TrimSpace(name))

	if portions, ok := s.db[cleaned]; ok {
		return portions, true
	}

	for dbKey, portions := range s.db {
		if cleaned == dbKey || strings.Contains(cleaned, dbKey) || strings.Contains(dbKey, cleaned) {
			return portions, true
		}
	}

	return nil, false
}

func (s *NutritionService) Calculate(req *models.NutritionRequest) (*models.NutritionResponse, error) {
	if len(req.Foods) == 0 {
		return nil, fmt.Errorf("no foods provided")
	}

	// Weight-based calculation: split the total dish weight across its parts.
	if req.WeightGrams > 0 {
		perPart := req.WeightGrams / float64(len(req.Foods))

		var items []models.NutritionItem
		totals := models.NutritionEntry{}

		for _, selection := range req.Foods {
			entry, err := s.gemini.EstimateNutritionForWeight(selection.Name, perPart)
			if err != nil {
				log.Printf("Gemini weight fallback failed for %q: %v", selection.Name, err)
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

	// Fallback: portion-based lookup from the local database.
	var items []models.NutritionItem
	totals := models.NutritionEntry{}

	for _, selection := range req.Foods {
		name := strings.ToLower(strings.TrimSpace(selection.Name))
		portion := strings.ToLower(strings.TrimSpace(selection.Portion))

		if portion == "" {
			portion = "medium"
		}

		portions, ok := s.lookup(name)
		if !ok {
			entry, err := s.gemini.EstimateNutrition(selection.Name)
			if err != nil {
				log.Printf("Gemini fallback failed for %q: %v", selection.Name, err)
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
			continue
		}

		entry, ok := portions[portion]
		if !ok {
			entry = portions["medium"]
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
