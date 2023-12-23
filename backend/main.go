package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"example.com/storerecord/api/routes"
	db2 "example.com/storerecord/internal/db"
)

func main() {
	r := gin.Default()

	env := godotenv.Load()

	//config := cors.DefaultConfig()
	//config.AllowOrigins = []string{"http://localhost:4000"}

	r.Use(cors.Default())

	if env != nil {
		log.Fatal("Error loading .env file")
	}

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
