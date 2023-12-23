package drug

import "go.mongodb.org/mongo-driver/bson/primitive"

type Drug struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	DrugCode string             `bson:"drug_code" json:"drug_code""`
	DrugName string             `bson:"drug_name" json:"drug_name"`
}
