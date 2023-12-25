package person

import "go.mongodb.org/mongo-driver/bson/primitive"

type Person struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name     string             `bson:"name" json:"name"`
	Username string             `bson:"userName" json:"userName"`
}
