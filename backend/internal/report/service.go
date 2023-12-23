package report

import (
	"context"
	"example.com/storerecord/internal/drug"
	"fmt"
	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type IReportService interface {
	GetReportByFilter(ctx context.Context, filter bson.M, opt *options.FindOptions) ([]*SendReport, error)
	GetTotalByFilter(ctx context.Context, filter bson.M) (int64, error)
	GetOneByFilter(ctx context.Context, filter bson.M) (*Report, error)
	CreateMany(ctx context.Context, reports []*Report) error
	EditReport(ctx context.Context, filter bson.M, updated bson.M) error
	PushReport(ctx context.Context, filter bson.M, pushData bson.M) error
}

type ReportService struct {
	Collection  *mongo.Collection
	DrugServive drug.IDrugService
}

func NewReportService(db *mongo.Client) IReportService {
	reportSerive := &ReportService{
		Collection:  db.Database("store").Collection("report"),
		DrugServive: drug.NewDrugService(db),
	}
	return reportSerive
}

func (ds *ReportService) CreateMany(ctx context.Context, reports []*Report) error {
	drugsList, err := ds.DrugServive.GetAllDrugs(ctx)
	if err != nil {
		return err
	}

	allReports, err := ds.GetReportByFilter(ctx, bson.M{}, nil)
	if err != nil {
		fmt.Println(err)
		return err
	}

	reportsNo := lo.Map(allReports, func(item *SendReport, _ int) string {
		return item.ReportID
	})

	maxNumber := findMaxValue(reportsNo)

	if err := validateConsecutive(reports, maxNumber); err != nil {
		return err
	}

	documents := make([]interface{}, 0)
	for _, report := range reports {
		_, found := lo.Find(allReports, func(r *SendReport) bool {
			return r.ReportID == report.ReportID
		})

		if found {
			continue
		}

		_, found = lo.Find(drugsList, func(dr *drug.Drug) bool {
			return dr.DrugCode == report.ProductCode
		})

		report.DrugType = found

		documents = append(documents, report)
	}

	_, err = ds.Collection.InsertMany(ctx, documents)
	return err
}

func validateConsecutive(reports []*Report, maxNumber int) error {
	for _, report := range reports {
		if extractNumber(report.ReportID) <= maxNumber {
			continue
		}
		if extractNumber(report.ReportID) != maxNumber+1 {
			return fmt.Errorf("the import report is not consecutive with the old report")
		}
		return nil
	}
	return nil
}

func (ds *ReportService) GetTotalByFilter(ctx context.Context, filter bson.M) (int64, error) {
	total, err := ds.Collection.CountDocuments(ctx, filter)
	if err != nil {
		fmt.Println(err)
		return int64(0), err
	}
	return total, nil
}

func (ds *ReportService) GetReportByFilter(ctx context.Context, filter bson.M, opt *options.FindOptions) ([]*SendReport, error) {
	list := make([]*SendReport, 0)

	//opt.Sort = bson.M{}
	cur, err := ds.Collection.Find(ctx, filter, opt)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var result Report
		err = cur.Decode(&result)
		if err != nil {
			fmt.Println(err, "Cannot decode report data from db")
			return nil, err
		}
		sendReport := CreateSendReport(&result)
		list = append(list, &sendReport)
	}
	if err = cur.Err(); err != nil {
		fmt.Println(err, "Cannot get report")
		return nil, err
	}

	return list, err
}

func (ds *ReportService) PushReport(ctx context.Context, filter bson.M, updated bson.M) error {
	if updated == nil {
		return fmt.Errorf("No updatedData")
	}
	updateData := bson.M{
		"$push": updated,
	}
	if _, err := ds.Collection.UpdateMany(ctx, filter, updateData); err != nil {
		return err
	}
	return nil
}

func (ds *ReportService) EditReport(ctx context.Context, filter bson.M, updated bson.M) error {
	if updated == nil {
		return fmt.Errorf("No updatedData")
	}
	updateData := bson.M{
		"$set": updated,
	}
	if _, err := ds.Collection.UpdateMany(ctx, filter, updateData); err != nil {
		return err
	}
	return nil
}

func CreateSendReport(result *Report) SendReport {
	reportNew := SendReport{
		ID:          result.ID,
		ReportID:    result.ReportID,
		ProductCode: result.ProductCode,
		ProductName: result.ProductName,
		BatchNo:     result.BatchNo,
		ReportDate:  result.ReportDate,
		QMReceived:  result.QMReceived,
		BoxNo:       result.BoxNo,
	}

	if len(result.Borrowed) > 0 {
		lastElement := len(result.Borrowed) - 1
		if result.Borrowed[lastElement].ReturnDate == "" {
			reportNew.Borrowed = *result.Borrowed[lastElement]
		}
	}

	return reportNew
}

func (ds *ReportService) GetOneByFilter(ctx context.Context, filter bson.M) (*Report, error) {
	entity := &Report{}
	err := ds.Collection.FindOne(ctx, filter).Decode(entity)
	if err != nil {
		return nil, err
	}
	return entity, nil
}
