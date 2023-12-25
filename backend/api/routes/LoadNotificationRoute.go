package routes

import (
	"example.com/storerecord/api/handlers"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func LoadNotificationRoute(route *gin.RouterGroup, db *mongo.Client) {
	notificationHandler := handlers.NewNotificationHandler(db)
	route.GET("", notificationHandler.SendHtml)
	route.GET("/:user", notificationHandler.SendMessageToPerson)
	//route.POST("", reportHandler.CreateReportFromExcel)
	//route.POST("/QA/:id", reportHandler.UpdateQAReceiveForReport)
	//route.POST("/Borrow/:id", reportHandler.BorrowReport)
	//route.POST("/Return/:id", reportHandler.ReturnReport)
	//route.POST("/Boxes/:id", reportHandler.BoxAboveReportInNewBox)
	//route.POST("/UnBoxes/:id", reportHandler.DeleteBox)
}
