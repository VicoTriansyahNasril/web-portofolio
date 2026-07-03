package services

import (
	"context"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/websocket"
	"crypto/sha256"
	"encoding/base64"
	"sort"
	"time"
)

type analyticsService struct {
	repo ports.AnalyticsRepository
}

func NewAnalyticsService(repo ports.AnalyticsRepository) ports.AnalyticsService {
	return &analyticsService{repo: repo}
}

func (s *analyticsService) TrackVisitor(ctx context.Context, ip, userAgent, path string) error {
	const salt = "your-very-secret-static-salt-for-hashing-visitors"
	rawIdentifier := ip + "-" + userAgent + "-" + salt
	hash := sha256.Sum256([]byte(rawIdentifier))
	visitorHash := base64.URLEncoding.EncodeToString(hash[:])

	visit := domain.PageVisit{
		Path:        path,
		VisitorHash: visitorHash,
		Timestamp:   time.Now(),
	}

	err := s.repo.RecordVisit(ctx, &visit)
	if err == nil {
		hub := websocket.GetHub()
		hub.BroadcastEvent("change", "/api/admin/analytics/visitors")
	}
	return err
}

func (s *analyticsService) GetVisitorsSummary(ctx context.Context) ([]map[string]interface{}, error) {
	rawSummaries, err := s.repo.GetVisitorSummaries(ctx)
	if err != nil {
		return nil, err
	}

	type parsedSummary struct {
		Data       domain.VisitorSummary
		FirstVisit time.Time
		LastVisit  time.Time
	}

	var parsed []parsedSummary
	for _, raw := range rawSummaries {
		fv, _ := time.Parse(time.RFC3339, raw.FirstVisit)
		if fv.IsZero() {
			fv, _ = time.Parse("2006-01-02 15:04:05.999999999-07:00", raw.FirstVisit)
		}

		lv, _ := time.Parse(time.RFC3339, raw.LastVisit)
		if lv.IsZero() {
			lv, _ = time.Parse("2006-01-02 15:04:05.999999999-07:00", raw.LastVisit)
		}

		parsed = append(parsed, parsedSummary{
			FirstVisit: fv,
			LastVisit:  lv,
			Data:       raw,
		})
	}

	sort.Slice(parsed, func(i, j int) bool {
		return parsed[i].FirstVisit.Before(parsed[j].FirstVisit)
	})

	result := make([]map[string]interface{}, len(parsed))
	for i, item := range parsed {
		result[i] = map[string]interface{}{
			"visitorHash":    item.Data.VisitorHash,
			"visitorNumber":  i + 1,
			"firstVisit":     item.FirstVisit,
			"lastVisit":      item.LastVisit,
			"totalPageViews": item.Data.TotalPageViews,
		}
	}

	sort.Slice(result, func(i, j int) bool {
		t1 := result[i]["lastVisit"].(time.Time)
		t2 := result[j]["lastVisit"].(time.Time)
		return t1.After(t2)
	})

	return result, nil
}

func (s *analyticsService) GetVisitorDetail(ctx context.Context, hash string) (map[string]interface{}, error) {
	visits, err := s.repo.GetVisitsByHash(ctx, hash)
	if err != nil {
		return nil, err
	}
	if len(visits) == 0 {
		return nil, nil
	}

	freqMap := make(map[string]int)
	for _, v := range visits {
		freqMap[v.Path]++
	}

	type PageFrequency struct {
		Path  string `json:"path"`
		Count int    `json:"count"`
	}
	pageFrequencies := make([]PageFrequency, 0, len(freqMap))
	for path, count := range freqMap {
		pageFrequencies = append(pageFrequencies, PageFrequency{Path: path, Count: count})
	}

	sort.Slice(pageFrequencies, func(i, j int) bool {
		return pageFrequencies[i].Count > pageFrequencies[j].Count
	})

	response := map[string]interface{}{
		"visitorHash":     hash,
		"firstVisit":      visits[len(visits)-1].Timestamp,
		"lastVisit":       visits[0].Timestamp,
		"totalPageViews":  len(visits),
		"pageFrequencies": pageFrequencies,
		"visitLog":        visits,
	}

	return response, nil
}

func (s *analyticsService) GetPublicStats(ctx context.Context) (map[string]interface{}, error) {
	rawSummaries, err := s.repo.GetVisitorSummaries(ctx)
	if err != nil {
		return nil, err
	}

	totalUniqueVisitors := len(rawSummaries)
	var totalPageViews int64 = 0

	for _, raw := range rawSummaries {
		totalPageViews += raw.TotalPageViews
	}

	return map[string]interface{}{
		"total_visitors":   totalUniqueVisitors,
		"total_page_views": totalPageViews,
	}, nil
}
