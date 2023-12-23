import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Container, Paper } from "@mui/material";
import RowModal from "../modal";
import styles from "../../supplier/supplier/styles.module.scss";
import Title from "../../title";
import { DataGrid } from "@mui/x-data-grid";
import { AddressAPI } from "../../../services/address-api";

export const Address = () => {
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("id");
  const supplierName = searchParams.get("name");

  const columns = [
    { field: "addr", headerName: "Address", width: 500, editable: false },
    { field: "type", headerName: "Address Type", width: 180, editable: false },
    {
      editable: true,
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ margin: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRowEdit(params)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRowDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowEdit = (params) => {
    setSelectedRow(params.row);
  };
  const handleAddRow = () => {
    setSelectedRow({});
  };
  const handleSave = async (editedrow) => {
    try {
      if (Object.keys(selectedRow).length !== 0) {
        await AddressAPI.editAddress(editedrow);
      } else {
        editedrow.supplierid = supplierId;
        if (!editedrow.type) {
          editedrow.type = "office";
        }
        await AddressAPI.addAddress(editedrow);
      }
      setToggle(!toggle);
      setSelectedRow(null);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };
  const handleRowDelete = async (id) => {
    try {
      // make API call to delete row
      await AddressAPI.deleteAddress(id);
      setToggle(!toggle);
    } catch (error) {
      console.error(error);
      alert("An error occur");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await AddressAPI.fetchSupplierAddress(supplierId);
        setData(result.data);
      } catch (e) {
        setData([]);
        alert("Can received the Supplier List");
      }
    };
    fetchData();
  }, [toggle]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, mr: 2, ml: 2 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <div className={styles.title}>
          <Title>Supplier Name: {supplierName}</Title>
          <Button onClick={handleAddRow}>+</Button>
        </div>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[10, 50]}
          rowSelection={false}
        />
        <RowModal
          selectedRow={selectedRow}
          handleSave={handleSave}
          setSelectedRow={setSelectedRow}
        ></RowModal>
      </Paper>
    </Container>
  );
};
