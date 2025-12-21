package server

import (
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
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	hub := websocket.GetHub()
	hub.RegisterClient(conn)

	defer func() {
		hub.UnregisterClient(conn)
	}()

	for {
		if _, _, err := conn.NextReader(); err != nil {
			break
		}
	}
}

func healthCheckHandler(c *gin.Context) {
	sqlDB, err := db.Conn.DB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "unhealthy", "error": "no db connection"})
		return
	}

	if err := sqlDB.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "unhealthy", "error": "db ping timeout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "healthy", "timestamp": time.Now().Unix()})
}

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware(cfg.CORSOrigins))
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.GET("/health", healthCheckHandler)
	r.GET("/ws", wsHandler)

	publicAPI := r.Group("/api")
	publicAPI.Use(middleware.CacheControl(5 * time.Minute))
	{
		publicAPI.GET("/projects", handlers.ListPublicProjects())
		publicAPI.GET("/projects/:slug", handlers.GetProjectBySlug())
		publicAPI.GET("/profile", handlers.GetProfilePublic())
		publicAPI.GET("/skills", handlers.GetSkillsPublic())
		publicAPI.GET("/experiences", handlers.ListPublicExperiences())
		publicAPI.GET("/achievements", handlers.ListPublicAchievements())
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
