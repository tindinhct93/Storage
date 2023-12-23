package main

import (
	"example.com/storerecord/api/routes"
	db2 "example.com/storerecord/internal/db"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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

	db, err := db2.ConnectToMongoDB("mongodb://localhost:27017")
	if err != nil {
		log.Fatal(err)
	}
	routes.LoadRoutes(r, db)
	r.Run()
}
