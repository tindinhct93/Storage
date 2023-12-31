package handlers

import (
	"example.com/storerecord/internal/box"
	"example.com/storerecord/internal/excel"
	"example.com/storerecord/internal/report"
	"fmt"
	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ReportHandler struct {
	BaseHandler
}

func NewReportHandler(db *mongo.Client) *ReportHandler {
	return &ReportHandler{
		BaseHandler: BaseHandler{
			Db: db,
		},
	}
}

func (h *ReportHandler) CreateReportFromExcel(c *gin.Context) {
	service := report.NewReportService(h.Db)
	excelService := &excel.ExcelService{}

	file, err := c.FormFile("file")
	if err != nil {
		c.Error(err)
		return
	}

	f, err := file.Open()
	if err != nil {
		c.Error(err)
		return
	}
	defer f.Close()

	byte, err := io.ReadAll(f)
	if err != nil {
		c.Error(err)
		return
	}

	reports, err := excelService.ToReportList(byte)
	if err != nil {
		c.Error(err)
		return
	}

	reports = lo.Map(reports, func(item *report.Report, _ int) *report.Report {
		item.Borrowed = make([]*report.Borrowed, 0)
		return item
	})

	err = service.CreateMany(c, reports)
	if err != nil {
		c.Error(err)
		return
	}
	h.handleSuccessGet(c, "dummy created")
}

func getReportFilterFromRoute(body *report.ReportRequest) bson.M {
	filter := bson.M{}
	if body.BatchNo == "" && body.MSHH == "" {
		filter["report_id"] = bson.M{"$regex": fmt.Sprintf("/%d-%d/", body.Month, body.Year), "$options": "i"}
		filter["drug_type"] = body.DrugType == 1
	}

	if body.BatchNo != "" {
		filter["batch_no"] = body.BatchNo
	}
	if body.MSHH != "" {
		filter["product_code"] = bson.M{"$regex": fmt.Sprintf("%s", body.MSHH), "$options": "i"}
	}

	if body.IsDept == "true" {
		filter["borrowed.return_date"] = ""
	}
	return filter
}

func (h *ReportHandler) PrintCSVFromFilter(c *gin.Context) {
	var body report.ReportRequest
	if err := c.ShouldBindQuery(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	service := report.NewReportService(h.Db)
	excelService := &excel.ExcelService{}

	filter := getReportFilterFromRoute(&body)
	listReport, err := service.GetReportByFilter(c, filter, nil)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	fmt.Println(len(listReport))
	csv, err := excelService.ToCSV(listReport)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.Data(http.StatusOK, "text/csv", csv)
}

func (h *ReportHandler) GetReportsByFilter(c *gin.Context) {
	var body report.ReportRequest
	if err := c.ShouldBindQuery(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	service := report.NewReportService(h.Db)

	filter := getReportFilterFromRoute(&body)

	limit := int64(20)
	skip := int64(body.Page-1) * limit
	opt := options.FindOptions{
		Limit: &limit,
		Skip:  &skip,
	}

	listReport, err := service.GetReportByFilter(c, filter, &opt)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	total, err := service.GetTotalByFilter(c, filter)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	data := map[string]interface{}{
		"items":       listReport,
		"total_items": total,
	}
	h.handleSuccessGet(c, data)
}

func (h *ReportHandler) BorrowReport(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}

	var body report.BorrowRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if body.BorrowDate == "" {
		today := time.Now()
		body.BorrowDate = today.Format("2006-01-02")
	}

	service := report.NewReportService(h.Db)

	filter := bson.M{
		"_id": id,
	}

	borrow := &report.Borrowed{
		Borrower:   body.Borrower,
		BorrowDate: body.BorrowDate,
	}
	//bsonString, _ := bson.Marshal(borrow)

	updated := bson.M{
		"borrowed": borrow,
	}

	err = service.PushReport(c, filter, updated)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	h.handleSuccessUpdate(c)
}

func (h *ReportHandler) ReturnReport(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}

	today := time.Now()

	service := report.NewReportService(h.Db)

	filter := bson.M{
		"_id":                  id,
		"borrowed.return_date": "",
	}

	//updated := bson.M{
	//	"borrowed.$[-1].return_date": today.Format("2006-01-02"),
	//}

	updated := bson.M{
		"borrowed.$.return_date": today.Format("2006-01-02"),
	}

	err = service.EditReport(c, filter, updated)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	h.handleSuccessUpdate(c)
}

func (h *ReportHandler) UpdateQAReceiveForReport(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}

	var body report.QARequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	service := report.NewReportService(h.Db)

	filter := bson.M{
		"_id": id,
	}

	updated := bson.M{
		"qm_received": body.QA,
	}

	err = service.EditReport(c, filter, updated)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	h.handleSuccessUpdate(c)
}

func (h *ReportHandler) BoxAboveReportInNewBox(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}
	boxService := box.NewBoxService(h.Db)
	reportService := report.NewReportService(h.Db)

	reportEntity, err := reportService.GetOneByFilter(c, bson.M{"_id": id})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't parse boxes",
		})
		return
	}

	monthYear := report.ExtractMonthYear(reportEntity.ReportID)
	boxes, err := boxService.GetBoxesWithReport(c, monthYear, reportEntity.DrugType)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't parse boxes",
		})
		return
	}

	newBoxCode, err := boxService.AddBox(c, monthYear, boxes, reportEntity.DrugType)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't create new box",
		})
		return
	}

	err = reportService.EditReport(c, bson.M{
		"box_no": "",
		"_id": bson.M{
			"$lte": reportEntity.ID,
		},
		"drug_type": reportEntity.DrugType,
	}, bson.M{
		"box_no": newBoxCode,
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't create new box",
		})
		return
	}

	h.handleSuccessUpdate(c)
}

func (h *ReportHandler) DeleteBox(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No ObjectId",
		})
		return
	}

	boxService := box.NewBoxService(h.Db)
	reportService := report.NewReportService(h.Db)

	reportEntity, err := reportService.GetOneByFilter(c, bson.M{
		"_id": id,
	})

	monthYear := report.ExtractMonthYear(reportEntity.ReportID)
	boxes, err := boxService.GetBoxesWithReport(c, monthYear, reportEntity.DrugType)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't parse boxes",
		})
		return
	}

	maxReportNo := box.FindMaxNumber(boxes)
	currentBox := box.ExtractNumber(reportEntity.BoxNo)
	if currentBox != maxReportNo {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Can't delete box with is not the last box",
		})
		return
	}

	err = boxService.RemoveBox(c, reportEntity.BoxNo)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Can't delete box",
		})
		return
	}

	err = reportService.EditReport(c, bson.M{
		"box_no": reportEntity.BoxNo,
	}, bson.M{
		"box_no": "",
	})
}
