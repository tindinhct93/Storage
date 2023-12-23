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
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { ParseObjectToValueLabel } from "util/func";
import { ProductColor, ProductSize } from "util/constant";
import { useEditProductMutation } from "services/createApi";
import ErrorNotification from "components/notification/error-noti";

const sizeList = ParseObjectToValueLabel(ProductSize);
const colorList = ParseObjectToValueLabel(ProductColor);

const ModalEditProductTable = (props) => {
  const { productInfo = null, open = false, setClose, refetchPage } = props;
  const [productNewInfo, setProductNewInfo] = useState({});
  const [editProduct, { isLoading, data, error: dataError }] =
    useEditProductMutation();
  const [error, setError] = useState(null);

  const handleClose = () => {
    setClose();
  };
  const onSubmitChange = () => {
    const submitProduct = {
      ...productInfo,
      ...productNewInfo,
    };
    editProduct(submitProduct)
      .unwrap()
      .then((res) => {
        refetchPage();
        setClose();
      })
      .catch((err) => {
        setError(err?.data?.error);
        setProductNewInfo({});
      });
  };

  const handleFieldChangeClick = (value, field) => {
    productNewInfo[field] = value;
    setProductNewInfo(productNewInfo);
  };

  const onInputNewValueField = (value, field) => {
    productNewInfo[field] = value;
    setProductNewInfo(productNewInfo);
  };

  const ErrorNotificationRender = () => {
    return <ErrorNotification error={error} setError={setError} />;
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {error ? (
        ErrorNotificationRender()
      ) : (
        <Box className={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            // component="h2"
            sx={{ m: 1, mb: 2 }}
          >
            Editing Product
          </Typography>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Name</InputLabel>
              <OutlinedInput
                id="component-outlined"
                defaultValue={productInfo?.name}
                label="Name"
                // error={}
                // ref={nameInputRef}
                onChange={(event) =>
                  onInputNewValueField(event.target.value, "name")
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Brand</InputLabel>
              <OutlinedInput
                id="component-outlined"
                defaultValue={productInfo?.brand}
                label="Brand"
                onChange={(event) =>
                  onInputNewValueField(event.target.value, "brand")
                }
              />
            </FormControl>
            <Select
              variant="outlined"
              label="Color"
              value={
                productNewInfo?.color
                  ? productNewInfo?.color
                  : productInfo.color
              }
              onChange={(e) => handleFieldChangeClick(e.target.value, "color")}
            >
              {colorList &&
                colorList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
            <Select
              variant="outlined"
              label="Size"
              value={
                productNewInfo?.size ? productNewInfo?.size : productInfo.size
              }
              onChange={(event) =>
                handleFieldChangeClick(event.target.value, "size")
              }
            >
              {sizeList &&
                sizeList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          <Box className={styles.submit} sx={{ m: 1, mt: 2, gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 1 }}
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

export default ModalEditProductTable;
