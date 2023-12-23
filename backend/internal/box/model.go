package box

import "go.mongodb.org/mongo-driver/bson/primitive"

type Box struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	//001/01-2023
	//901/01-2023
	BoxCode  string `bson:"box_code" json:"box_code"`
	DrugType bool   `bson:"drug_type" json:"drug_type"`
}
