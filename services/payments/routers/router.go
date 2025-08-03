package routers

import (
	"payment/service/controllers"
	"payment/service/middlewares"

	"github.com/gin-gonic/gin"
)

func MainRoute(router *gin.Engine) {
	{
		payment := router.Group("/api/payments", middlewares.JWTAuthMiddleware())

		payment.POST("/payment", controllers.StartPayment)
		payment.GET("/lists", controllers.GetPayment())
	}
}
