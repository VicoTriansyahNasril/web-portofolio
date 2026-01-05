package ports

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/dto"
)

// --- Repositories ---

type ProjectRepository interface {
	Create(project *domain.Project) error
	Update(project *domain.Project) error
	Delete(id uint) error
	FindByID(id uint) (*domain.Project, error)
	FindBySlug(slug string) (*domain.Project, error)
	FindAllPublic() ([]domain.Project, error)
	FindAllAdmin() ([]domain.Project, error)
	GetMaxSortOrder() (int, error)
}

type ProfileRepository interface {
	Get() (*domain.Profile, error)
	Upsert(profile *domain.Profile) error
	UpdateSocialLinks(profileID uint, links []domain.SocialLink) error
}

type SkillRepository interface {
	ListPublic() ([]domain.Skill, error)
	ListAdmin() ([]domain.Skill, error)
	Create(skill *domain.Skill) error
	Update(skill *domain.Skill) error
	Delete(id uint) error
	Reorder(orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type AchievementRepository interface {
	ListPublic() ([]domain.Achievement, error)
	ListAdmin() ([]domain.Achievement, error)
	Create(achievement *domain.Achievement) error
	Update(achievement *domain.Achievement) error
	Delete(id uint) error
	Reorder(orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type ExperienceRepository interface {
	ListPublic() ([]domain.Experience, error)
	ListAdmin() ([]domain.Experience, error)
	Create(experience *domain.Experience) error
	Update(experience *domain.Experience) error
	Delete(id uint) error
}

type AnalyticsRepository interface {
	RecordVisit(visit *domain.PageVisit) error
	GetVisitorSummaries() ([]domain.VisitorSummary, error)
	GetVisitsByHash(hash string) ([]domain.PageVisit, error)
}

// --- Services ---

type ProjectService interface {
	GetPublicList() ([]domain.Project, error)
	GetPublicBySlug(slug string) (*domain.Project, error)
	GetAdminList() ([]domain.Project, error)
	GetAdminByID(id uint) (*domain.Project, error)
	CreateProject(req dto.CreateProjectReq) (*domain.Project, error)
	UpdateProject(id uint, req dto.UpdateProjectReq) error
	DeleteProject(id uint) error
	ReorderProjects(req dto.ReorderReq) error
}

type ProfileService interface {
	GetPublicProfile() (*domain.Profile, error)
	UpdateProfile(reqProfile domain.Profile, reqSocials []domain.SocialLink) error
}

type SkillService interface {
	GetPublicSkills() ([]domain.Skill, error)
	GetAdminSkills() ([]domain.Skill, error)
	CreateSkill(reqSkill domain.Skill) error
	UpdateSkill(id uint, reqSkill domain.Skill) error
	DeleteSkill(id uint) error
	ReorderSkills(orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type AchievementService interface {
	GetPublicAchievements() ([]domain.Achievement, error)
	GetAdminAchievements() ([]domain.Achievement, error)
	CreateAchievement(req dto.AchievementReq) error
	UpdateAchievement(id uint, req dto.AchievementReq) error
	DeleteAchievement(id uint) error
	ReorderAchievements(orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}) error
}

type ExperienceService interface {
	GetPublicExperiences() ([]domain.Experience, error)
	GetAdminExperiences() ([]domain.Experience, error)
	CreateExperience(req dto.ExperienceReq) error
	UpdateExperience(id uint, req dto.ExperienceReq) error
	DeleteExperience(id uint) error
}

type AnalyticsService interface {
	TrackVisitor(ip, userAgent, path string) error
	GetVisitorsSummary() ([]map[string]interface{}, error)
	GetVisitorDetail(hash string) (map[string]interface{}, error)
}

type AuthService interface {
	Login(email, password string) (string, error)
}

type UploadService interface {
	GenerateSignature() (map[string]interface{}, error)
}
