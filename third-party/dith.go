package thirdparty

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// DithClient represents a client for the Dith AI API
type DithClient struct {
	baseURL    string
	httpClient *http.Client
}

// TokenAnalysis represents the response from the analyze endpoint
type TokenAnalysis struct {
	Message string `json:"message"`
}

// AnalyzeRequest represents the request body for the analyze endpoint
type AnalyzeRequest struct {
	Address string `json:"address"`
}

// NewDithClient creates a new Dith AI API client
func NewDithClient() *DithClient {
	return &DithClient{
		baseURL: "https://api.dith.ai",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// AnalyzeToken sends a request to analyze a token
func (c *DithClient) AnalyzeToken(address string) (*TokenAnalysis, error) {
	reqBody := AnalyzeRequest{
		Address: address,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("error marshaling request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/analyze", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var analysis TokenAnalysis
	if err := json.NewDecoder(resp.Body).Decode(&analysis); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &analysis, nil
}