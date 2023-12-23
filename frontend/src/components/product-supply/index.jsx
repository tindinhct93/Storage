import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Container, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  useDeleteSupplierOfProductMutation,
  useGetProductByIdQuery,
  useGetSupplierByProductIdQuery,
} from "services/createApi";
import Loading from "components/loading";
import ProductTableHead from "components/product/table-head";
import ModalNewSupplierForProductModal from "./new-form";

// Generate Order Data
// GridColDef[]

export default function SupplierDetails() {
  const { productId } = useParams();
  const {
    isLoading: loading,
    data: supplierProductList,
    error,
    refetch,
  } = useGetSupplierByProductIdQuery(productId);
  const tableRef = useRef();
  const [rowSelectionIndex, setRowSelectionIndex] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const handleRowSelection = (newSelectedRow) => {
    setRowSelectionIndex(newSelectedRow);
  };

  const [
    deleteTrigger,
    { loading: deleteLoading, data: deleteData, error: deleteError },
  ] = useDeleteSupplierOfProductMutation();
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(productId);

  const deleteRowHandler = async () => {
    try {
      const payload = await deleteTrigger(rowSelectionIndex[0]).unwrap();
      console.log(">> fulfilled", payload);
      refetch();
    } catch (err) {
      console.log(">> rejected", err);
    }
    setRowSelectionIndex([]);
  };

  useEffect(() => {
    const element = tableRef.current;
    document.addEventListener("mousedown", (event) => {
      if (element?.contains(event.target)) {
      } else {
        setRowSelectionIndex([]);
      }
    });
  }, [setRowSelectionIndex]);

  const columns = [
    { field: "suppliername", headerName: "Supplier Name", width: 200 },
    { field: "stock", headerName: "Supplier Stock", width: 150 },
  ];
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {!error && (
          <div ref={tableRef} style={{ margin: 20, padding: 10 }}>
            <ProductTableHead
              title={`Supplier Records for Product [${
                productData ? productData.name : ""
              }]`}
              openCreateModal={() => {
                setOpenCreateModal(true);
              }}
              rowSelected={rowSelectionIndex.length}
              deleteRowHandler={deleteRowHandler}
            />
            {supplierProductList?.length === 0 && !loading ? (
              <h1> No Supplier</h1>
            ) : !loading ? (
              <DataGrid
                sx={{ m: 2 }}
                rows={supplierProductList}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 50]}
                loading={loading}
                onRowSelectionModelChange={handleRowSelection}
                rowSelectionModel={rowSelectionIndex}
              />
            ) : (
              <Loading />
            )}
          </div>
        )}
      </Paper>

      <ModalNewSupplierForProductModal
        open={openCreateModal}
        productInfo={productData}
        setClose={() => setOpenCreateModal(false)}
        refetchAllSuppliers={refetch}
      />
    </Container>
  );
}
