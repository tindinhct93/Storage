package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"example.com/storerecord/api/routes"
	db2 "example.com/storerecord/internal/db"
)

func main() {
	r := gin.Default()

	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}

	r.Use(CORSMiddleware())

	monggodb := os.Getenv("MONGODB_PATH")
	if monggodb == "" {
		log.Fatal("Error loading MONGODB_PATH")
	}

	db, err := db2.ConnectToMongoDB(monggodb)
	if err != nil {
		log.Fatal(err)
	}
	routes.LoadRoutes(r, db)
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}