package box

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type IBoxService interface {
	GetAllBoxes(ctx context.Context) ([]*Box, error)
	GetBoxesWithReport(ctx context.Context, monthYear string, drugType bool) ([]*Box, error)
	AddBox(ctx context.Context, monthYear string, listBox []*Box, drugType bool) (string, error)
	RemoveBox(ctx context.Context, BoxCode string) error
}

type BoxService struct {
	Collection *mongo.Collection
}

func NewBoxService(db *mongo.Client) IBoxService {
	return &BoxService{
		Collection: db.Database("store").Collection("box"),
	}
}

func (bs *BoxService) GetAllBoxes(ctx context.Context) ([]*Box, error) {
	return bs.findBoxesWithFilter(ctx, nil)
}

func (bs *BoxService) GetBoxesWithReport(ctx context.Context, monthYear string, drugType bool) ([]*Box, error) {
	filter := bson.M{
		"box_code":  bson.M{"$regex": fmt.Sprintf("%s", monthYear), "$options": "i"},
		"drug_type": drugType,
	}

	return bs.findBoxesWithFilter(ctx, filter)
}

func (bs *BoxService) findBoxesWithFilter(ctx context.Context, filter bson.M) ([]*Box, error) {
	var list []*Box

	cur, err := bs.Collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var result Box
		err = cur.Decode(&result)
		if err != nil {
			return nil, err
		}
		list = append(list, &result)
	}
	if err = cur.Err(); err != nil {
		return nil, err
	}

	return list, err
}

func (bs *BoxService) AddBox(ctx context.Context, monthYear string, listBox []*Box, drugType bool) (string, error) {
	boxCode := bs.createNewBoxNumber(monthYear, listBox, drugType)

	box := &Box{
		BoxCode:  boxCode,
		DrugType: drugType,
	}

	_, err := bs.Collection.InsertOne(ctx, box)
	if err != nil {
		return "", err
	}

	return boxCode, nil
}

func (bs *BoxService) RemoveBox(ctx context.Context, BoxCode string) error {
	if BoxCode == "" {
		return errors.New("condition filter is empty")
	}

	filter := bson.M{"box_code": BoxCode}
	_, err := bs.Collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}

func (bs *BoxService) createNewBoxNumber(monthYear string, boxes []*Box, drugType bool) string {
	maxNumber := FindMaxNumber(boxes)
	if maxNumber == 0 {
		if drugType {
			return fmt.Sprintf("%03d/%s", 901, monthYear)
		}
		return fmt.Sprintf("%03d/%s", 1, monthYear)
	}

	return fmt.Sprintf("%03d/%s", maxNumber+1, monthYear)
}
