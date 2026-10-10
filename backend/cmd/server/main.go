package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/simran/nutrisnap/internal/handlers"
	"github.com/simran/nutrisnap/internal/services"
)

func loadEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	s := bufio.NewScanner(f)
	for s.Scan() {
		line := strings.TrimSpace(s.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		if os.Getenv(key) == "" {
			os.Setenv(key, val)
		}
	}
}

func main() {
	loadEnv(".env")
	gemini := services.NewGeminiService()
	nutrition := services.NewNutritionService(gemini)

	h := handlers.NewHandler(gemini, nutrition)

	mux := http.NewServeMux()
	mux.HandleFunc("/analyze", h.Analyze)
	mux.HandleFunc("/nutrition", h.Nutrition)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
