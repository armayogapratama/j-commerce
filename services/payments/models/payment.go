package models

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	OrderId       int       `json:"order_id"`
	PaymentStatus string    `json:"payment_status"`
	PaymentMethod string    `json:"payment_method"`
	Amount        float64   `json:"amount"`
	PaymentTime   time.Time `json:"payment_time"`
	ExpiredAt     time.Time `json:"expired_at"`
}
