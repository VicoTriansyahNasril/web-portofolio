package services

import (
	"context"
	"fmt"
	"net/smtp"
	"strings"

	"backend-portofolio/internal/core/ports"
)

type contactService struct {
	smtpHost     string
	smtpPort     string
	smtpUser     string
	smtpPass     string
	contactEmail string
}

func NewContactService(smtpHost, smtpPort, smtpUser, smtpPass, contactEmail string) ports.ContactService {
	return &contactService{
		smtpHost:     smtpHost,
		smtpPort:     smtpPort,
		smtpUser:     smtpUser,
		smtpPass:     smtpPass,
		contactEmail: contactEmail,
	}
}

func (s *contactService) SendMessage(ctx context.Context, name, email, message string) error {
	if s.smtpHost == "" || s.smtpPort == "" || s.smtpUser == "" || s.smtpPass == "" || s.contactEmail == "" {
		return fmt.Errorf("SMTP configuration is incomplete. Cannot send email")
	}

	auth := smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost)

	// Format the email message
	subject := fmt.Sprintf("Subject: New Portfolio Contact from %s\r\n", name)
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

	// Create a simple HTML template for the email
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>New Contact Message</h2>
			<p><strong>Name:</strong> %s</p>
			<p><strong>Email:</strong> %s</p>
			<p><strong>Message:</strong></p>
			<p>%s</p>
		</body>
		</html>
	`, name, email, strings.ReplaceAll(message, "\n", "<br>"))

	msg := []byte(subject + mime + body)

	// Send to the contact email defined in config (usually the admin)
	to := []string{s.contactEmail}

	err := smtp.SendMail(s.smtpHost+":"+s.smtpPort, auth, s.smtpUser, to, msg)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
