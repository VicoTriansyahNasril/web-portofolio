package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

type VisitorSummaryResponse struct {
	VisitorHash string `json:"visitorHash"`
}

func TestAnalyticsAPI(t *testing.T) {
	t.Cleanup(clearTables)

	authToken, err := getAuthToken()
	assert.NoError(t, err)

	var trackedVisitorHash string

	t.Run("Track Visit", func(t *testing.T) {
		payload := `{"path": "/home", "visitorId": "test-visitor-123"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/track", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Get Visitors Summary", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/admin/analytics/visitors", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var summaries []VisitorSummaryResponse
		err := json.Unmarshal(w.Body.Bytes(), &summaries)
		assert.NoError(t, err)
		assert.Len(t, summaries, 1)
		assert.Equal(t, "test-visitor-123", summaries[0].VisitorHash)
		trackedVisitorHash = summaries[0].VisitorHash
	})

	t.Run("Get Visitor Detail", func(t *testing.T) {
		assert.NotEmpty(t, trackedVisitorHash, "Visitor hash should have been captured from summary test")
		url := fmt.Sprintf("/api/admin/analytics/visitors/%s", trackedVisitorHash)
		req, _ := http.NewRequest(http.MethodGet, url, nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		body := w.Body.String()
		assert.Contains(t, body, trackedVisitorHash)
		assert.Contains(t, body, "/home")
	})
}
