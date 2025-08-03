package middlewares

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"payment/service/helpers"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type APIResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Data    User   `json:"data"`
}

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		tokenString := authHeader[7:]

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token is missing"})
			c.Abort()
			return
		}

		claims, err := helpers.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		userID := claims["id"]
		if userID == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID is missing in claims"})
			c.Abort()
			return
		}
		apiBaseURL := os.Getenv("USER_URL")

		apiUrl := fmt.Sprintf("%s/api/users/user/%v", apiBaseURL, userID)

		resp, err := http.Get(apiUrl)

		fmt.Println(resp, "ini resp")

		if err != nil || resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
			c.Abort()
			return
		}

		defer resp.Body.Close()
		var apiResponse APIResponse
		if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding user data"})
			c.Abort()
			return
		}

		if apiResponse.Status != "Success" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
			c.Abort()
			return
		}

		c.Set("user_data", apiResponse.Data)

		c.Set("user_claims", claims)

		c.Next()
	}
}
