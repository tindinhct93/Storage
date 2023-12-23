import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Container, Paper } from "@mui/material";
import styles from "./styles.module.scss";
import Title from "components/title";
import { ProductRows } from "services/dummy-data";

// Generate Order Data
// GridColDef[]
const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "brand", headerName: "Brand", width: 100 },
  { field: "sku", headerName: "SKU", width: 100 },
  {
    field: "size",
    headerName: "Size",
    type: "number",
    width: 90,
  },
  {
    field: "supplier",
    headerName: "Supplier",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    // valueGetter: (params) => // GridValueGetterParams
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  { field: "color", headerName: "Color", width: 100, editable: true },
  { field: "status", headerName: "Status", width: 70, editable: true },
  { field: "stock", headerName: "Stock", type: "number", width: 70 },
];

export default function CustomTable() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <div className={styles.title}>
          <Title>Recent Order</Title>
          <Button> +</Button>
        </div>
        <DataGrid
          rows={ProductRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 50]}
          checkboxSelection
          onCellClick={(event) => {
            // console.log(event) // field, formattedValue, isEditable
          }}
        />
      </Paper>
    </Container>
  );
}
