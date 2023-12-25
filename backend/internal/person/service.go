package person

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type IPersonService interface {
	GetAllPerson(ctx context.Context) ([]*Person, error)
	GetPersonByName(ctx context.Context, name string) (*Person, error)
}

type PersonService struct {
	Collection *mongo.Collection
}

func NewPersonService(db *mongo.Client) IPersonService {
	return &PersonService{
		Collection: db.Database("store").Collection("person"),
	}
}

func (bs *PersonService) GetPersonByName(ctx context.Context, name string) (*Person, error) {
	filter := bson.M{"name": name}
	var result Person
	err := bs.Collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (bs *PersonService) GetAllPerson(ctx context.Context) ([]*Person, error) {
	filter := bson.M{}
	var list []*Person

	cur, err := bs.Collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var result Person
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
