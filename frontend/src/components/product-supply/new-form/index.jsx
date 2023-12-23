import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  ProductApi,
  ProductSuppyApi,
  useCreateNewSupplierOfProductMutation,
  useGetAllProductsQuery,
  useGetAllSuppliersQuery,
} from "services/createApi";
import styles from "./styles.module.scss";
import { store } from "store/store";
import ErrorNotification from "components/notification/error-noti";

const labelField = [
  {
    field: "suppliername",
    label: "Supplier Name",
  },
  {
    field: "stock",
    label: "Supplier Stock",
  },
];

const ModalNewSupplierForProductModal = (props) => {
  const { open, setClose, productInfo, refetchAllSuppliers } = props;
  const [newSupplier, setNewSupplier] = useState({});

  const [createNewSupplier, { loading, data, error }] =
    useCreateNewSupplierOfProductMutation();
  const [errorReq, setErrorReq] = useState(null);
  const {
    data: supplierData,
    loading: supplierLoading,
    error: supplierError,
  } = useGetAllSuppliersQuery();
  const handleClose = () => {
    setClose();
  };

  const handleFieldChangeClick = (value) => {
    console.log(supplierData[value]);
    const { id, name } = supplierData[value];
    const newSup = { id, name };
    setNewSupplier(newSup);
  };

  const onSubmitChange = () => {
    console.log(">> new product ", newSupplier, productInfo.id);
    createNewSupplier({
      productId: productInfo.id,
      supplierId: newSupplier.id,
      supplierStock: newSupplier.stock,
    })
      .unwrap()
      .then((res) => {
        // store.dispatch(ProductApi.endpoints.getAllProducts.)
        refetchAllSuppliers();
        handleClose();
        return res;
      })
      .catch((err) => {
        setErrorReq(err);
      });
  };

  const onInputNewFieldValue = (value, field) => {
    newSupplier[field] = value;
    setNewSupplier(newSupplier);
  };

  const ErrorNotificationRender = () => {
    return (
      <ErrorNotification error={errorReq?.data?.error} setError={setErrorReq} />
    );
  };
  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {errorReq ? (
        ErrorNotificationRender()
      ) : (
        <Box className={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            // component="h2"
            sx={{ mb: 4 }}
          >
            Add Supplier For Product
          </Typography>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { mb: 4 },
            }}
            noValidate
            autoComplete="off"
          >
            <Select
              variant="outlined"
              label="Supplier Name"
              sx={{ mr: 2 }}
              value={
                newSupplier.name
                  ? newSupplier.name
                  : supplierData
                  ? supplierData[0].name
                  : ""
              }
            >
              {supplierData &&
                supplierData.map((option, idx) => {
                  return (
                    <MenuItem
                      key={option.id}
                      value={option.name}
                      onClick={() => handleFieldChangeClick(idx, "id")}
                    >
                      {option.name}
                    </MenuItem>
                  );
                })}
            </Select>

            <FormControl key={"stock"}>
              <InputLabel htmlFor="component-outlined">{"stock"}</InputLabel>
              <OutlinedInput
                required
                id="component-outlined"
                label={"stock"}
                onChange={(event) =>
                  onInputNewFieldValue(event.target.value, "stock")
                }
              />
            </FormControl>
          </Box>
          <Box className={styles.submit} sx={{ m: 1, mt: 2, gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => onSubmitChange()}
            >
              Submit
            </Button>
            <Button
              type="submit"
              variant="outlined"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ModalNewSupplierForProductModal;
