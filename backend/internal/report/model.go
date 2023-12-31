package report

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Borrowed struct {
	Borrower   string `bson:"borrower" json:"borrower"`
	BorrowDate string `bson:"borrow_date" json:"borrow_date"`
	ReturnDate string `bson:"return_date" json:"return_date"`
}

type Report struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ReportID    string             `bson:"report_id" json:"report_id"`
	ProductCode string             `bson:"product_code" json:"product_code"`
	ProductName string             `bson:"product_name" json:"product_name"`
	DrugType    bool               `bson:"drug_type" json:"drug_type"`
	BatchNo     string             `bson:"batch_no" json:"batch_no"`
	ReportDate  string             `bson:"report_date" json:"report_date"`
	QMReceived  bool               `bson:"qm_received" json:"qm_received"`
	BoxNo       string             `bson:"box_no" json:"box_no"`
	Borrowed    []*Borrowed        `bson:"borrowed" json:"borrowed"`
}

type SendReport struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ReportID    string             `bson:"report_id" json:"report_id"`
	ProductCode string             `bson:"product_code" json:"product_code"`
	ProductName string             `bson:"product_name" json:"product_name"`
	BatchNo     string             `bson:"batch_no" json:"batch_no"`
	ReportDate  string             `bson:"report_date" json:"report_date"`
	QMReceived  bool               `bson:"qm_received" json:"qm_received"`
	BoxNo       string             `bson:"box_no" json:"box_no"`
	Borrowed
}

type ReportRequest struct {
	Page     int    `form:"page"`
	MSHH     string `form:"MSHH"`
	BatchNo  string `form:"batch_no"`
	DrugType int    `form:"drugType"`
	Month    int    `form:"Month"`
	Year     int    `form:"Year"`
	IsDept   string `form:"isDebt" binding:"required"`
}

type QARequest struct {
	QA bool `json:"QA"`
}

type BorrowRequest struct {
	Borrower   string `json:"borrower"`
	BorrowDate string `json:"borrow_date"`
}
