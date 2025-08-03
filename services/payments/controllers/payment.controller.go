package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"payment/service/configs"
	"payment/service/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type Order struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	ProductId string    `json:"product_id"`
	Status    string    `json:"status"`
	Quantity  int       `json:"quantity"`
	Total     float64   `json:"total"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type APIResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Data    Order  `json:"data"`
}

var snapClient snap.Client

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	client := os.Getenv("CLIENT_KEY")
	server := os.Getenv("SERVER_KEY")

	midtrans.ServerKey = client
	midtrans.ClientKey = server

	snapClient = snap.Client{}
	snapClient.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
}

func CreateTransaction(req *snap.Request) (*snap.Response, *midtrans.Error) {
	resp, err := snapClient.CreateTransaction(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func StartPayment(ctx *gin.Context) {
	var paymentRequest struct {
		OrderID int `json:"order_id"`
	}

	if err := ctx.BindJSON(&paymentRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	apiURL := os.Getenv("ORDER_URL")

	orderURL := fmt.Sprintf("%s/api/orders/order/%d", apiURL, paymentRequest.OrderID)

	resp, err := http.Get(orderURL)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch order data: %v", err)})
		return
	}
	defer resp.Body.Close()

	var orderResponse APIResponse
	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&orderResponse); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to parse order response: %v", err)})
		return
	}

	if orderResponse.Status != "Success" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch valid order data"})
		return
	}

	fmt.Println(orderResponse.Data, "ini ordeer data yang terbaru")

	payment := models.Payment{
		OrderId:     paymentRequest.OrderID,
		Amount:      orderResponse.Data.Total,
		PaymentTime: time.Now(),
		ExpiredAt:   time.Now().Add(1 * time.Minute),
	}

	if err := configs.DB.Create(&payment).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	transactionDetails := midtrans.TransactionDetails{
		OrderID:  fmt.Sprintf("%d", payment.OrderId),
		GrossAmt: int64(payment.Amount),
	}

	snapReq := &snap.Request{
		TransactionDetails: transactionDetails,
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
	}

	snapResp, err := CreateTransaction(snapReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create snap token: %v", err)})
		return
	}

	payment.PaymentStatus = "pending"
	payment.PaymentMethod = "snap"
	configs.DB.Save(&payment)

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "pending",
		"message": "Payment initiation successful",
		"data": gin.H{
			"snap_token": snapResp.Token,
		},
	})
}

func GetPayment() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payment []models.Payment

		if err := configs.DB.Find(&payment).Error; err != nil {
			ctx.JSON(404, gin.H{"error": "Record not found!"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"status":  "Success",
			"message": "Success Get Foods",
			"data":    payment,
		})
	}
}
