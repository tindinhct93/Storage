package routes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func LoadRoutes(r *gin.Engine, db *mongo.Client) {
	superGroup := r.Group("/api")
	{
		LoadReportRoute(superGroup.Group("/report"), db)
	}
}
