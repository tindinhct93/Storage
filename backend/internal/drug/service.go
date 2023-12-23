package drug

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type IDrugService interface {
	GetAllDrugs(ctx context.Context) ([]*Drug, error)
}

type DrugService struct {
	Collection *mongo.Collection
}

func NewDrugService(db *mongo.Client) IDrugService {
	return &DrugService{
		Collection: db.Database("store").Collection("drug"),
	}
}

func (ds *DrugService) GetAllDrugs(ctx context.Context) ([]*Drug, error) {
	var list []*Drug

	cur, err := ds.Collection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var result Drug
		err = cur.Decode(&result)
		if err != nil {
			fmt.Println(err, "Cannot decode order data from db")
			return nil, err
		}
		list = append(list, &result)
	}
	if err = cur.Err(); err != nil {
		fmt.Println(err, "Cannot get order")
		return nil, err
	}

	return list, err
}
