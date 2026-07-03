package ports

import (
	"context"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/dto"
)

// --- Repositories ---

type ProjectRepository interface {
	Create(ctx context.Context, project *domain.Project) error
	Update(ctx context.Context, project *domain.Project) error
	Delete(ctx context.Context, id uint) error
	FindByID(ctx context.Context, id uint) (*domain.Project, error)
	FindBySlug(ctx context.Context, slug string) (*domain.Project, error)
	FindAllPublic(ctx context.Context) ([]domain.Project, error)
	FindAllAdmin(ctx context.Context) ([]domain.Project, error)
	GetMaxSortOrder(ctx context.Context) (int, error)
}

type ProfileRepository interface {
	Get(ctx context.Context) (*domain.Profile, error)
	Upsert(ctx context.Context, profile *domain.Profile) error
	UpdateSocialLinks(ctx context.Context, profileID uint, links []domain.SocialLink) error
}

type SkillRepository interface {
	ListPublic(ctx context.Context) ([]domain.Skill, error)
	ListAdmin(ctx context.Context) ([]domain.Skill, error)
	Create(ctx context.Context, skill *domain.Skill) error
	Update(ctx context.Context, skill *domain.Skill) error
	Delete(ctx context.Context, id uint) error
	Reorder(ctx context.Context, orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type AchievementRepository interface {
	ListPublic(ctx context.Context) ([]domain.Achievement, error)
	ListAdmin(ctx context.Context) ([]domain.Achievement, error)
	Create(ctx context.Context, achievement *domain.Achievement) error
	Update(ctx context.Context, achievement *domain.Achievement) error
	Delete(ctx context.Context, id uint) error
	Reorder(ctx context.Context, orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
	GetMaxSortOrder(ctx context.Context) (int, error)
}

type ExperienceRepository interface {
	ListPublic(ctx context.Context) ([]domain.Experience, error)
	ListAdmin(ctx context.Context) ([]domain.Experience, error)
	Create(ctx context.Context, experience *domain.Experience) error
	Update(ctx context.Context, experience *domain.Experience) error
	Delete(ctx context.Context, id uint) error
}

type AnalyticsRepository interface {
	RecordVisit(ctx context.Context, visit *domain.PageVisit) error
	GetVisitorSummaries(ctx context.Context) ([]domain.VisitorSummary, error)
	GetVisitsByHash(ctx context.Context, hash string) ([]domain.PageVisit, error)
}

// --- Services ---

type ProjectService interface {
	GetPublicList(ctx context.Context) ([]domain.Project, error)
	GetPublicBySlug(ctx context.Context, slug string) (*domain.Project, error)
	GetAdminList(ctx context.Context) ([]domain.Project, error)
	GetAdminByID(ctx context.Context, id uint) (*domain.Project, error)
	CreateProject(ctx context.Context, req dto.CreateProjectReq) (*domain.Project, error)
	UpdateProject(ctx context.Context, id uint, req dto.UpdateProjectReq) error
	DeleteProject(ctx context.Context, id uint) error
	ReorderProjects(ctx context.Context, req dto.ReorderReq) error
}

type ProfileService interface {
	GetPublicProfile(ctx context.Context) (*domain.Profile, error)
	UpdateProfile(ctx context.Context, reqProfile domain.Profile, reqSocials []domain.SocialLink) error
}

type SkillService interface {
	GetPublicSkills(ctx context.Context) ([]domain.Skill, error)
	GetAdminSkills(ctx context.Context) ([]domain.Skill, error)
	CreateSkill(ctx context.Context, reqSkill domain.Skill) error
	UpdateSkill(ctx context.Context, id uint, reqSkill domain.Skill) error
	DeleteSkill(ctx context.Context, id uint) error
	ReorderSkills(ctx context.Context, orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type AchievementService interface {
	GetPublicAchievements(ctx context.Context) ([]domain.Achievement, error)
	GetAdminAchievements(ctx context.Context) ([]domain.Achievement, error)
	CreateAchievement(ctx context.Context, req dto.AchievementReq) error
	UpdateAchievement(ctx context.Context, id uint, req dto.AchievementReq) error
	DeleteAchievement(ctx context.Context, id uint) error
	ReorderAchievements(ctx context.Context, orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type ExperienceService interface {
	GetPublicExperiences(ctx context.Context) ([]domain.Experience, error)
	GetAdminExperiences(ctx context.Context) ([]domain.Experience, error)
	CreateExperience(ctx context.Context, req dto.ExperienceReq) error
	UpdateExperience(ctx context.Context, id uint, req dto.ExperienceReq) error
	DeleteExperience(ctx context.Context, id uint) error
}

type AnalyticsService interface {
	TrackVisitor(ctx context.Context, ip, userAgent, path string) error
	GetVisitorsSummary(ctx context.Context) ([]map[string]interface{}, error)
	GetVisitorDetail(ctx context.Context, hash string) (map[string]interface{}, error)
}

type AuthService interface {
	Login(ctx context.Context, email, password string) (string, error)
}

type UploadService interface {
	GenerateSignature(ctx context.Context) (map[string]interface{}, error)
}
