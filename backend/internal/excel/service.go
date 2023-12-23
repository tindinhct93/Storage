package excel

import (
	"encoding/csv"
	"example.com/storerecord/internal/report"
	"github.com/gocarina/gocsv"
	"strings"
)

type IExcel interface {
	ToCSV() ([]byte, error)
}

type ExcelService struct{}

func (es *ExcelService) ToReportList(b []byte) ([]*report.Report, error) {
	reader := csv.NewReader(strings.NewReader(string(b)))
	for i := 0; i < 3; i++ {
		_, err := reader.Read()
		if err != nil {
			return nil, err
		}
	}

	var orderItems []*ExcelData

	if err := gocsv.UnmarshalCSV(reader, &orderItems); err != nil {
		return nil, err
	}

	var reports []*report.Report
	for _, orderItem := range orderItems {
		reports = append(reports, &report.Report{
			ReportID:    orderItem.ReportNo,
			ProductCode: orderItem.MSHH,
			ProductName: orderItem.ProductName,
			BatchNo:     orderItem.BatchNo,
			ReportDate:  orderItem.ReportDate,
			QMReceived:  true,
		})
	}

	return reports, nil
}
