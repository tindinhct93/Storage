package handlers

import (
	"bytes"
	"example.com/storerecord/internal/person"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const (
	//apiURL = "https://graph.facebook.com/v18.0/208249522363996/messages?accesss_token="
	apiURL = "https://graph.facebook.com/v18.0/SHOP_ID/messages"
)

type NotificationHandler struct {
	BaseHandler
}

func NewNotificationHandler(db *mongo.Client) *NotificationHandler {
	return &NotificationHandler{
		BaseHandler: BaseHandler{
			Db: db,
		},
	}
}

func (h *NotificationHandler) SendHtml(c *gin.Context) {
	c.HTML(http.StatusOK, "notification.html", gin.H{
		"title": "Main website",
	})
}

func (h *NotificationHandler) SendMessageToPerson(c *gin.Context) {
	pageAccessToken := os.Getenv("FB_PAGE_ACCESS_TOKEN")
	pageId := os.Getenv("FB_PAGE_ID")
	if pageAccessToken == "" || pageId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No FB_PAGE_ACCESS_TOKEN or FB_PAGE_ID",
		})
		return
	}

	userId := c.Param("user")
	if userId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}

	personService := person.NewPersonService(h.Db)
	person, err := personService.GetPersonByName(c, userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Error getting person with error: " + err.Error(),
		})
		return
	}

	err = sendMessageFromPageToFacebookAccount(pageId, pageAccessToken, person.Username, "Hello")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Error sending message with error: " + err.Error(),
		})
		return
	}

	h.handleSuccessCreate(c)
}

func sendMessageFromPageToFacebookAccount(pageId, pageAccessToken, recipientID, message string) error {
	params := url.Values{}
	params.Set("recipient", fmt.Sprintf(`{"id": "%s"}`, recipientID))
	params.Set("message", fmt.Sprintf(`{"text": "%s"}`, message))
	params.Set("messaging_type", "RESPONSE")
	params.Set("access_token", pageAccessToken)

	urlWithParams := strings.Replace(apiURL, "SHOP_ID", pageId, 1) + "?" + params.Encode()

	//payload := map[string]interface{}{
	//	"recipient": map[string]string{
	//		"id": recipientID,
	//	},
	//	"messaging_type": "RESPONSE",
	//	"message": map[string]string{
	//		"text": message,
	//	},
	//}

	//jsonPayload, err := json.Marshal(payload)
	//if err != nil {
	//	return err
	//}

	resp, err := http.Post(urlWithParams, "application/json", bytes.NewBuffer([]byte{}))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println(string(respBody))

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}
