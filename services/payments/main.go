package main

import (
	"os"
	"payment/service/configs"
	"payment/service/routers"

	"github.com/gin-gonic/gin"
)

func init() {
	configs.LoadEnv()
	configs.ConnectDB()
	configs.SyncDB()

}

func main() {
	gin.SetMode(gin.ReleaseMode)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	routers.MainRoute(router)

	router.Run(":" + port)

}
