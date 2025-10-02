// internal/models/profile.go
package models

type SocialLink struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	URL       string `json:"url"`
	Icon      string `json:"icon"`
	Active    bool   `json:"active"`
	ProfileID uint   `json:"-"`
}

type Profile struct {
	ID              uint         `json:"id" gorm:"primaryKey"`
	FullName        string       `json:"full_name"`
	Headline        string       `json:"headline"`
	Bio             string       `json:"bio"`
	PhotoURL        string       `json:"photo_url"`
	Location        string       `json:"location"`
	ResumeURL       string       `json:"resume_url"`
	SkillGroupOrder string       `json:"skill_group_order" gorm:"type:text"`
	Socials         []SocialLink `json:"socials"`
}