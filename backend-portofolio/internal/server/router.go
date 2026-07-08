package server

import (
	"net/http"
	"time"

	"backend-portofolio/internal/adapters/handler"
	"backend-portofolio/internal/adapters/repository"
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/config"
	"backend-portofolio/internal/core/services"
	"backend-portofolio/internal/middleware"
	"backend-portofolio/internal/websocket"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	gows "github.com/gorilla/websocket"
	"gorm.io/gorm"
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

func healthCheck(dbConn *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		dbStatus := "up"
		sqlDB, err := dbConn.DB()
		if err != nil || sqlDB.Ping() != nil {
			dbStatus = "down"
		}

		redisStatus := "up"
		if cache.Rdb != nil {
			if err := cache.Rdb.Set(c.Request.Context(), "ping", "pong", 1*time.Minute).Err(); err != nil {
				redisStatus = "down"
			}
		} else {
			redisStatus = "down"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "active",
			"database": dbStatus,
			"redis":    redisStatus,
			"time":     time.Now().Unix(),
		})
	}
}

func SetupRouter(cfg *config.Config, dbConn *gorm.DB) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.CORSMiddleware(cfg.CORSOrigins))
	r.Use(middleware.GlobalLimit)
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Match([]string{"GET", "HEAD"}, "/health", healthCheck(dbConn))
	r.GET("/ws", wsHandler)

	projectRepo := repository.NewProjectRepo(dbConn)
	projectSvc := services.NewProjectService(projectRepo)
	projectHdl := handler.NewProjectHandler(projectSvc)

	profileRepo := repository.NewProfileRepo(dbConn)
	profileSvc := services.NewProfileService(profileRepo)
	profileHdl := handler.NewProfileHandler(profileSvc)

	skillRepo := repository.NewSkillRepo(dbConn)
	skillSvc := services.NewSkillService(skillRepo, profileRepo)
	skillHdl := handler.NewSkillHandler(skillSvc)

	achievementRepo := repository.NewAchievementRepo(dbConn)
	achievementSvc := services.NewAchievementService(achievementRepo)
	achievementHdl := handler.NewAchievementHandler(achievementSvc)

	experienceRepo := repository.NewExperienceRepo(dbConn)
	experienceSvc := services.NewExperienceService(experienceRepo)
	experienceHdl := handler.NewExperienceHandler(experienceSvc)

	analyticsRepo := repository.NewAnalyticsRepo(dbConn)
	analyticsSvc := services.NewAnalyticsService(analyticsRepo)
	analyticsHdl := handler.NewAnalyticsHandler(analyticsSvc)

	testimonialRepo := repository.NewTestimonialRepo(dbConn)
	testimonialSvc := services.NewTestimonialService(testimonialRepo)
	testimonialHdl := handler.NewTestimonialHandler(testimonialSvc)

	authSvc := services.NewAuthService(cfg.JWTSecret, cfg.AdminEmail, cfg.AdminPassword)
	authHdl := handler.NewAuthHandler(authSvc)

	uploadSvc := services.NewUploadService(cfg.CloudinaryURL)
	uploadHdl := handler.NewUploadHandler(uploadSvc)

	contactSvc := services.NewContactService(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass, cfg.ContactEmail)
	contactHdl := handler.NewContactHandler(contactSvc)

	publicAPI := r.Group("/api")
	publicAPI.Use(middleware.CacheControl(5 * time.Minute))
	{
		publicAPI.GET("/projects", projectHdl.ListPublic)
		publicAPI.GET("/projects/:slug", projectHdl.GetBySlug)
		publicAPI.GET("/profile", profileHdl.GetPublic)
		publicAPI.GET("/skills", skillHdl.ListPublic)
		publicAPI.GET("/experiences", experienceHdl.ListPublic)
		publicAPI.GET("/achievements", achievementHdl.ListPublic)
		publicAPI.GET("/testimonials", testimonialHdl.ListPublic)
		publicAPI.GET("/analytics/stats", analyticsHdl.GetPublicStats)
	}

	r.POST("/api/track", analyticsHdl.TrackVisit)
	r.POST("/api/contact", contactHdl.SendMessage)
	r.POST("/api/auth/login", middleware.LoginLimit, authHdl.Login)
	r.POST("/api/auth/logout", authHdl.Logout)

	admin := r.Group("/api/admin", middleware.JWTAuth(cfg.JWTSecret), middleware.CSRFProtection())
	{
		admin.GET("/projects", projectHdl.AdminList)
		admin.GET("/projects/:id", projectHdl.GetAdminByID)
		admin.POST("/projects", projectHdl.Create)
		admin.PUT("/projects/:id", projectHdl.Update)
		admin.DELETE("/projects/:id", projectHdl.Delete)
		admin.POST("/projects/reorder", projectHdl.Reorder)

		admin.PUT("/profile", profileHdl.Upsert)

		admin.GET("/skills", skillHdl.ListAdmin)
		admin.POST("/skills", skillHdl.Create)
		admin.PUT("/skills/:id", skillHdl.Update)
		admin.DELETE("/skills/:id", skillHdl.Delete)
		admin.POST("/skills/reorder", skillHdl.Reorder)

		admin.GET("/experiences", experienceHdl.ListAdmin)
		admin.POST("/experiences", experienceHdl.Create)
		admin.PUT("/experiences/:id", experienceHdl.Update)
		admin.DELETE("/experiences/:id", experienceHdl.Delete)

		admin.GET("/achievements", achievementHdl.ListAdmin)
		admin.POST("/achievements", achievementHdl.Create)
		admin.PUT("/achievements/:id", achievementHdl.Update)
		admin.DELETE("/achievements/:id", achievementHdl.Delete)
		admin.POST("/achievements/reorder", achievementHdl.Reorder)

		admin.GET("/testimonials", testimonialHdl.ListAdmin)
		admin.POST("/testimonials", testimonialHdl.Create)
		admin.PUT("/testimonials/:id", testimonialHdl.Update)
		admin.DELETE("/testimonials/:id", testimonialHdl.Delete)
		admin.POST("/testimonials/reorder", testimonialHdl.Reorder)

		admin.GET("/analytics/visitors", analyticsHdl.GetVisitorsSummary)
		admin.GET("/analytics/visitors/:visitorHash", analyticsHdl.GetVisitorDetail)

		admin.GET("/upload/signature", uploadHdl.GetSignature)
	}

	return r
}
