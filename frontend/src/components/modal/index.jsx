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
import { useCreateNewProductMutation } from "services/createApi";
import ErrorNotification from "components/notification/error-noti";

const sizeList = ParseObjectToValueLabel(ProductSize);
const colorList = ParseObjectToValueLabel(ProductColor);

const ModalCreateProductForm = (props) => {
  const { open = false, setClose, refetchPage } = props;
  const [productNewInfo, setProductNewInfo] = useState({
    size: "XL",
    color: ProductColor.GREEN,
    // name: 'A',
    // brand: 'B',
  });
  const [createNewProduct, { isLoading, data, error, isError }] =
    useCreateNewProductMutation();
  const [createError, setCreateError] = useState(isError);

  const handleClose = () => {
    setClose();
  };
  const onSubmitChange = async () => {
    const submitProduct = {
      ...productNewInfo,
    };

    createNewProduct(submitProduct)
      .unwrap()
      .then((res) => {
        // define assign
        refetchPage();
        setClose();
      })
      .catch((err) => {
        setCreateError(err?.data?.error);
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
    return <ErrorNotification error={createError} setError={setCreateError} />;
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {createError ? (
        ErrorNotificationRender()
      ) : (
        <Box className={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            // component="h2"
            sx={{ m: 1, mb: 2 }}
          >
            Create New Product
          </Typography>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth required>
              <InputLabel htmlFor="component-outlined">Name</InputLabel>
              <OutlinedInput
                id="component-outlined"
                label="Name"
                required
                // error={}
                // ref={nameInputRef}
                onChange={(event) =>
                  onInputNewValueField(event.target.value, "name")
                }
              />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel htmlFor="component-outlined">Brand</InputLabel>
              <OutlinedInput
                id="component-outlined"
                label="Brand"
                required
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
                  : colorList[0].value
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
                productNewInfo?.size ? productNewInfo?.size : sizeList[0].value
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

export default ModalCreateProductForm;
