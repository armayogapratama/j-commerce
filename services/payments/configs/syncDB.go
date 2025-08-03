package configs

import "payment/service/models"

func SyncDB() {
	DB.AutoMigrate(&models.Payment{})
}
