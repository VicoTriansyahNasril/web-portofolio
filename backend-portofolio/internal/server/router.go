package server

import (
	"backend-portofolio/internal/config"
	"backend-portofolio/internal/handlers"
	"backend-portofolio/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware(cfg.CORSOrigins))

	r.Static("/uploads", cfg.UploadDir)

	// Rute Publik
	r.GET("/api/projects", handlers.ListPublicProjects())
	r.GET("/api/projects/:slug", handlers.GetProjectBySlug())
	r.GET("/api/profile", handlers.GetProfilePublic())
	r.HEAD("/api/profile", handlers.GetProfilePublic())
	r.GET("/api/skills", handlers.GetSkillsPublic())
	r.GET("/api/experiences", handlers.ListPublicExperiences())
	r.GET("/api/achievements", handlers.ListPublicAchievements())
	r.POST("/api/track", handlers.TrackVisit())

	// Rute Auth
	r.POST("/api/auth/login",
		handlers.LoginHandler(cfg.JWTSecret, cfg.AdminEmail, cfg.AdminPassword))

	// Rute Admin
	admin := r.Group("/api/admin", middleware.JWTAuth(cfg.JWTSecret))
	{
		admin.GET("/projects", handlers.AdminListProjects())
		admin.POST("/projects", handlers.CreateProject())
		admin.PUT("/projects/:id", handlers.UpdateProject())
		admin.DELETE("/projects/:id", handlers.DeleteProject())
		admin.POST("/projects/reorder", handlers.ReorderProjects())

		admin.POST("/upload", handlers.UploadHandler(cfg.CloudinaryURL))
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
