package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/simran/nutrisnap/internal/models"
)

type GeminiService struct {
	apiKey string
	client *http.Client
}

type geminiRequest struct {
	Contents []geminiContent `json:"contents"`
}

type geminiContent struct {
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	InlineData *geminiInlineData `json:"inlineData,omitempty"`
	Text       string            `json:"text,omitempty"`
}

type geminiInlineData struct {
	MimeType string `json:"mimeType"`
	Data     string `json:"data"`
}

type geminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func NewGeminiService() *GeminiService {
	return &GeminiService{
		apiKey: os.Getenv("GEMINI_API_KEY"),
		client: &http.Client{},
	}
}

func (s *GeminiService) sendPrompt(parts ...geminiPart) (string, error) {
	if s.apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY not set")
	}

	reqBody := geminiRequest{
		Contents: []geminiContent{
			{Parts: parts},
		},
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", s.apiKey)
	resp, err := s.client.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("failed to call Gemini API: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("Gemini API error (status %d): %s", resp.StatusCode, string(respBody))
		return "", fmt.Errorf("Gemini API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	var geminiResp geminiResponse
	if err := json.Unmarshal(respBody, &geminiResp); err != nil {
		return "", fmt.Errorf("failed to parse Gemini response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 {
		return "", fmt.Errorf("no candidates returned from Gemini")
	}

	text := geminiResp.Candidates[0].Content.Parts[0].Text
	text = strings.TrimSpace(text)
	text = strings.TrimPrefix(text, "```json")
	text = strings.TrimPrefix(text, "```")
	text = strings.TrimSuffix(text, "```")
	text = strings.TrimSpace(text)

	return text, nil
}

func (s *GeminiService) AnalyzeImage(imageData []byte, mimeType string) (*models.AnalyzeResponse, error) {
	encoded := base64.StdEncoding.EncodeToString(imageData)

	prompt := `You are a food identification expert. Analyze the uploaded meal image and identify ALL visible food items and ingredients.
Return JSON only.

Schema:
{"foods": [{"name": "string", "confidence": 0.0-1.0}]}

Rules:
- Return common food names in lowercase.
- Include EVERY visible food item — list the main dish AND all visible toppings, fillings, and ingredients separately.
- For example, for a pizza: list "pizza", "cheese", "basil", "tomato sauce", etc.
- For a burger: list "burger", "cheese", "lettuce", "tomato", etc.
- Be thorough and mention every edible thing you see.
- Do not explain.
- Return valid JSON only.
- If uncertain, provide your best estimate.`

	text, err := s.sendPrompt(
		geminiPart{
			InlineData: &geminiInlineData{
				MimeType: mimeType,
				Data:     encoded,
			},
		},
		geminiPart{Text: prompt},
	)
	if err != nil {
		return nil, err
	}

	var result models.AnalyzeResponse
	if err := json.Unmarshal([]byte(text), &result); err != nil {
		log.Printf("Failed to parse Gemini response text: %s", text)
		return nil, fmt.Errorf("failed to parse food data from response: %w", err)
	}

	return &result, nil
}

func (s *GeminiService) EstimateNutrition(foodName string) (*models.NutritionEntry, error) {
	prompt := fmt.Sprintf(`Estimate nutrition for 1 typical serving of "%s".
Return JSON only with realistic values for a standard portion.

Schema:
{"calories": 123, "protein": 1.2, "carbs": 1.2, "fat": 1.2, "fiber": 1.2, "sugar": 1.2, "sodium": 123, "vitamin_a": 123, "vitamin_c": 1.2, "calcium": 123, "iron": 1.2}

Rules:
- Use realistic average values for a standard serving size.
- Do not explain.
- Return valid JSON only.`, foodName)

	text, err := s.sendPrompt(geminiPart{Text: prompt})
	if err != nil {
		return nil, err
	}

	var entry models.NutritionEntry
	if err := json.Unmarshal([]byte(text), &entry); err != nil {
		log.Printf("Failed to parse Gemini nutrition for %q: %s", foodName, text)
		return nil, fmt.Errorf("failed to parse nutrition data: %w", err)
	}

	return &entry, nil
}
