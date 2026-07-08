package services

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"context"
)

type testimonialService struct {
	repo ports.TestimonialRepository
}

func NewTestimonialService(repo ports.TestimonialRepository) ports.TestimonialService {
	return &testimonialService{repo: repo}
}

func (s *testimonialService) GetPublicTestimonials(ctx context.Context) ([]domain.Testimonial, error) {
	return s.repo.ListPublic(ctx)
}

func (s *testimonialService) GetAdminTestimonials(ctx context.Context) ([]domain.Testimonial, error) {
	return s.repo.ListAdmin(ctx)
}

func (s *testimonialService) CreateTestimonial(ctx context.Context, req dto.TestimonialReq) error {
	maxOrder, err := s.repo.GetMaxSortOrder(ctx)
	if err != nil {
		return err
	}
	sortOrder := maxOrder + 1

	testimonial := &domain.Testimonial{
		Name:      req.Name,
		Role:      req.Role,
		Company:   req.Company,
		AvatarURL: req.AvatarURL,
		Content:   req.Content,
		SortOrder: &sortOrder,
	}

	if req.Rating != nil {
		testimonial.Rating = *req.Rating
	} else {
		testimonial.Rating = 5
	}

	if req.IsVisible != nil {
		testimonial.IsVisible = *req.IsVisible
	} else {
		testimonial.IsVisible = true
	}

	return s.repo.Create(ctx, testimonial)
}

func (s *testimonialService) UpdateTestimonial(ctx context.Context, id uint, req dto.TestimonialReq) error {
	testimonial, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if req.Name != "" {
		testimonial.Name = req.Name
	}
	testimonial.Role = req.Role
	testimonial.Company = req.Company
	testimonial.AvatarURL = req.AvatarURL

	if req.Content != "" {
		testimonial.Content = req.Content
	}

	if req.Rating != nil {
		testimonial.Rating = *req.Rating
	}

	if req.IsVisible != nil {
		testimonial.IsVisible = *req.IsVisible
	}

	if req.SortOrder != nil {
		testimonial.SortOrder = req.SortOrder
	}

	return s.repo.Update(ctx, testimonial)
}

func (s *testimonialService) DeleteTestimonial(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func (s *testimonialService) ReorderTestimonials(ctx context.Context, req dto.ReorderReq) error {
	return s.repo.Reorder(ctx, req.Orders)
}
