package server

import (
	"context"
	"net/http"
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/handlers"
	"backend-portofolio/internal/middleware"
	"backend-portofolio/internal/websocket"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	gows "github.com/gorilla/websocket"
)

var upgrader = gows.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func wsHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	hub := websocket.GetHub()
	hub.RegisterClient(conn)
	defer hub.UnregisterClient(conn)
	for {
		if _, _, err := conn.NextReader(); err != nil {
			break
		}
	}
}

func healthCheck(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()

	status := "active"
	dbStatus := "connected"

	sqlDB, err := db.Conn.DB()
	if err != nil {
		status = "error"
		dbStatus = "unavailable"
	} else {
		errCh := make(chan error, 1)
		go func() { errCh <- sqlDB.Ping() }()

		select {
		case err := <-errCh:
			if err != nil {
				status = "degraded"
				dbStatus = "disconnected"
			}
		case <-ctx.Done():
			status = "degraded"
			dbStatus = "timeout"
		}
	}

	code := http.StatusOK
	if status != "active" {
		code = http.StatusServiceUnavailable
	}

	c.JSON(code, gin.H{
		"status":    status,
		"database":  dbStatus,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func SetupRouter(cfg *config.Config) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	r.Use(middleware.CORSMiddleware(cfg.CORSOrigins))
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Match([]string{"GET", "HEAD"}, "/health", healthCheck)
	r.GET("/ws", wsHandler)

	api := r.Group("/api")
	api.Use(middleware.CacheControl(5 * time.Minute))
	{
		api.GET("/projects", handlers.ListPublicProjects())
		api.GET("/projects/:slug", handlers.GetProjectBySlug())
		api.GET("/profile", handlers.GetProfilePublic())
		api.GET("/skills", handlers.GetSkillsPublic())
		api.GET("/experiences", handlers.ListPublicExperiences())
		api.GET("/achievements", handlers.ListPublicAchievements())
	}

	r.POST("/api/track", handlers.TrackVisit())
	r.POST("/api/auth/login", handlers.LoginHandler(cfg.JWTSecret, cfg.AdminEmail, cfg.AdminPassword))

	admin := r.Group("/api/admin", middleware.JWTAuth(cfg.JWTSecret))
	{
		admin.GET("/projects", handlers.AdminListProjects())
		admin.POST("/projects", handlers.CreateProject())
		admin.PUT("/projects/:id", handlers.UpdateProject())
		admin.DELETE("/projects/:id", handlers.DeleteProject())
		admin.POST("/projects/reorder", handlers.ReorderProjects())
		admin.GET("/upload/signature", handlers.GetUploadSignatureHandler(cfg.CloudinaryURL))
		admin.PUT("/profile", handlers.UpsertProfile())
		admin.GET("/skills", handlers.AdminListSkills())
		admin.POST("/skills", handlers.CreateSkill())
		admin.PUT("/skills/:id", handlers.UpdateSkill())
		admin.DELETE("/skills/:id", handlers.DeleteSkill())
		admin.POST("/skills/reorder", handlers.ReorderSkills())
		admin.GET("/experiences", handlers.AdminListExperiences())
		admin.POST("/experiences", handlers.CreateExperience())
		admin.PUT("/experiences/:id", handlers.UpdateExperience())
		admin.DELETE("/experiences/:id", handlers.DeleteExperience())
		admin.GET("/achievements", handlers.AdminListAchievements())
		admin.POST("/achievements", handlers.CreateAchievement())
		admin.PUT("/achievements/:id", handlers.UpdateAchievement())
		admin.DELETE("/achievements/:id", handlers.DeleteAchievement())
		admin.POST("/achievements/reorder", handlers.ReorderAchievements())
		admin.GET("/analytics/visitors", handlers.GetVisitorsSummary())
		admin.GET("/analytics/visitors/:visitorHash", handlers.GetVisitorDetail())
	}

	return r
}
