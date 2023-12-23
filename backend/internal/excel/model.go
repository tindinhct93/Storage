package excel

type ExcelData struct {
	STT         string `csv:"STT"`
	ReportNo    string `csv:"SỐ"`
	MSHH        string `csv:"MSTP"`
	ProductName string `csv:"TÊN TP"`
	BatchNo     string `csv:"SKS"`
	ReportDate  string `csv:"NGÀY"`
}
