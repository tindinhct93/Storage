import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Container, Paper } from "@mui/material";
import { ProductDataList } from "services/dummy-data";
import { useEffect, useRef, useState } from "react";
import ProductTableHead from "../table-head";
import ModalEditProductTable from "../edit-modal";
import { Link as RouterLink } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useLazyGetPaginationProductsQuery,
} from "services/createApi";
import ModalCreateProductForm from "components/modal";
import Loading from "components/loading";

export default function ProductTable() {
  const [
    getPaginationQueryTrigger,
    {
      isFetching: productLoading,
      data: productList,
      error: productError,
      isLoading: loadFirstTime,
    },
  ] = useLazyGetPaginationProductsQuery();

  const tableRef = useRef();
  const [rowSelectionIndex, setRowSelectionIndex] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const handleRowSelection = (newSelectedRow) => {
    setRowSelectionIndex(newSelectedRow);
  };

  useEffect(() => {
    getPaginationQueryTrigger(paginationModel).then((res) => {});
  }, [paginationModel]);

  useEffect(() => {
    getPaginationQueryTrigger(paginationModel);
  }, []);

  const [
    deleteTrigger,
    { loading: deleteLoading, data: deleteData, error: deleteError },
  ] = useDeleteProductMutation();
  const deleteRowHandler = async () => {
    try {
      const payload = await deleteTrigger(rowSelectionIndex[0]).unwrap();
      console.log(">> fulfilled", payload);
      getPaginationQueryTrigger(paginationModel);
    } catch (err) {
      console.log(">> rejected", err);
    }
    setRowSelectionIndex([]);
  };

  const editModalHandler = (product) => {
    setSelectedRow(product);
    setOpenEditModal(true);
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
    { field: "name", headerName: "Name", width: 150 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "sku", headerName: "SKU", width: 200 },
    {
      field: "size",
      headerName: "Size",
      width: 100,
    },
    { field: "color", headerName: "Color", width: 100 },
    { field: "totalStock", headerName: "Total Stock", width: 100 },
    {
      field: "",
      headerName: "Actions",
      width: 250,
      // hideSortIcons: true,
      renderCell: (params) => {
        const { row: product } = params;
        return (
          <div>
            <Button
              variant="contained"
              size="small"
              style={{ marginRight: 10 }}
              component={RouterLink}
              to={`${window.location.href}/${product.id}`}
            >
              All Suppliers
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => editModalHandler(product)}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {!productError && (
          <div ref={tableRef} style={{ margin: 20, padding: 10 }}>
            <ProductTableHead
              title={"Product Records"}
              openCreateModal={() => {
                setOpenCreateModal(true);
              }}
              rowSelected={rowSelectionIndex.length}
              deleteRowHandler={deleteRowHandler}
            />
            {productList && (
              <DataGrid
                rows={productList.items}
                rowCount={productList.total_items}
                columns={columns}
                loading={productLoading || loadFirstTime}
                pageSizeOptions={[5, 10, 25]}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={handleRowSelection}
                rowSelectionModel={rowSelectionIndex}
              />
            )}
          </div>
        )}
      </Paper>
      {selectedRow && (
        <ModalEditProductTable
          productInfo={selectedRow}
          open={openEditModal}
          setClose={() => setOpenEditModal(false)}
          refetchPage={() => {
            getPaginationQueryTrigger(paginationModel);
          }}
        />
      )}
      <ModalCreateProductForm
        open={openCreateModal}
        setClose={() => setOpenCreateModal(false)}
        refetchPage={() => {
          getPaginationQueryTrigger(paginationModel);
        }}
      />
    </Container>
  );
}
