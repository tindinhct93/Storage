import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Container, Paper } from "@mui/material";
import styles from "./styles.module.scss";
import Title from "components/title";
import Modal from "../supplierModal";
import CustomFilter from "../filter";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SupplierAPI } from "../../../services/supplier-api";
import { useRef, useState } from "react";
import ControlledCheckbox from "../../checkbox/checkbox";
export default function Supplier() {
  const columns = [
    { field: "report_id", headerName: "Số phiếu", width: 180, editable: false },
    { field: "product_code", headerName: "MSHH", width: 120, editable: false },
    { field: "product_name", headerName: "TênSP", width: 120, editable: false },
    { field: "batch_no", headerName: "Số Lô", width: 90, editable: false },
    {
      editable: true,
      field: "qm_received",
      headerName: "Nhận QM",
      width: 80,
      //Borrow/Return/Box
      renderCell: (params) => (
        <Box sx={{ margin: 2 }}>
          <ControlledCheckbox data={params.row} />
        </Box>
      ),
    },
    {
      field: "borrower",
      headerName: "Người mượn",
      width: 120,
      editable: false,
    },
    {
      field: "borrow_date",
      headerName: "Ngày mượn",
      width: 120,
      editable: false,
    },
    {
      field: "box_no",
      headerName: "Số thùng",
      width: 120,
      editable: false,
      renderCell: (params) => {
        return params.row.box_no ? (
          <Button
            sx={{ mr: 1 }}
            //variant="contained"
            color="secondary"
            //Delete box function
            //onClick={() => {handleBox}}
          >
            {params.row.box_no}
          </Button>
        ) : (
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="primary"
            onClick={() => {
              handleBox(params);
            }}
          >
            Create box
          </Button>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      //Borrow/Return/Box
      renderCell: (params) => (
        <Box sx={{ margin: 2 }}>
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="primary"
            onClick={() => handleRowEdit(params)}
          >
            Edit
          </Button>
          {params.row.box_no ? (
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="primary"
              onClick={() => handleUnBox(params)}
            >
              Xoá hộp
            </Button>
          ) : (
            ""
          )}
        </Box>
      ),
    },
  ];
  //State initialize
  const [pageState, setPageState] = React.useState({
    isLoading: false,
    data: [],
    total: 0,
  });
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [showFilter, setShowFilter] = React.useState(true);
  const [toggle, setToggle] = useState(false);

  const initialPageModelRef = useRef({
    page: 0,
    pageSize: 20,
  });

  const [paginationModel, setPaginationModel] = React.useState(
    initialPageModelRef.current
  );

  const curentDate = new Date();
  const currentMonth = curentDate.getMonth() + 1;
  const currentYear = curentDate.getFullYear();

  const initialFilterStateRef = useRef({
    drugType: 0, //0: Thuốc thường, 1: Thuốc Kiểm soát đặc biệt
    Month: currentMonth,
    Year: currentYear,
    MSHH: "",
    BatchNo: "",
  });
  const [filter, setFilter] = useState(initialFilterStateRef.current);
  //setState logic function
  const handleToggleFilter = () => {
    setFilter(initialFilterStateRef.current);
    setShowFilter(!showFilter);
  };
  const handleRowEdit = (params) => {
    setSelectedRow(params.row);
  };

  const handleUnBox = async (editedrow) => {
    try {
      await SupplierAPI.deleteBox(editedrow.id);

      setToggle(!toggle);
      setSelectedRow(null);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };
  const handleBox = async (editedrow) => {
    try {
      await SupplierAPI.createBox(editedrow.id);

      setToggle(!toggle);
      setSelectedRow(null);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };
  const handleReturn = async (editedrow) => {
    try {
      await SupplierAPI.returnReport(editedrow.id);

      setToggle(!toggle);
      setSelectedRow(null);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };
  const handleSave = async (editedrow) => {
    try {
      let submitData = {
        borrower: editedrow.borrower,
        borrow_date: editedrow.borrow_date,
      };
      console.log(editedrow);
      await SupplierAPI.editBorrowReport(editedrow.id, submitData);

      setToggle(!toggle);
      setSelectedRow(null);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };
  const setNewFilter = (data) => {
    if (!data) {
      return setFilter(initialFilterStateRef.current);
    }
    setFilter({ ...filter, ...data });
  };
  const submitFiter = () => {
    setToggle(!toggle);
  };

  React.useEffect(() => {
    if (isNaN(filter.Month) || isNaN(filter.Year)) {
      alert("Month and Year must be number");
      return;
    }
    if (filter.Month < 1 || filter.Month > 12) {
      alert("Month must be between 1 and 12");
      return;
    }
    if (filter.Year < 2000 || filter.Year > 2100) {
      alert("Year must be between 2000 and 2100");
      return;
    }
    const fetchData = async () => {
      try {
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));
        const result = await SupplierAPI.fetchSupplier(
          paginationModel.page,
          paginationModel.pageSize,
          filter
        );
        console.log(result);
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: result.data.items,
          total: result.data.total_items,
        }));
      } catch (e) {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: [],
          total: 0,
        }));
        console.log(e);
        alert("Cannot received the Supplier List");
      }
    };
    fetchData();
  }, [paginationModel, toggle]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, mr: 2, ml: 2 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <div className={styles.title}>
          <Title>Supplier</Title>
          <div>
            <Button onClick={handleToggleFilter}>
              <FilterAltIcon />{" "}
            </Button>
            <Button>+</Button>
          </div>
        </div>
        {showFilter && (
          <CustomFilter
            filter={filter}
            setFilter={setNewFilter}
            submitFilter={submitFiter}
          />
        )}
        <DataGrid
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          pageSizeOptions={[3]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          columns={columns}
          rowSelection={false}
          getRowClassName={(params) => {
            return params.row.borrower === "" ? "highlight" : "";
          }}
          sx={{
            ".highlight": {
              bgcolor: "yellow",
              "&:hover": {
                bgcolor: "darkgrey",
              },
            },
          }}
        />

        <Modal
          selectedRow={selectedRow}
          handleSave={handleSave}
          handleReturn={handleReturn}
          setSelectedRow={setSelectedRow}
        ></Modal>
      </Paper>
    </Container>
  );
}
