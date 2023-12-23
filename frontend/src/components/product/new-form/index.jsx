import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { ParseObjectToValueLabel } from "util/func";
import { ProductColor, ProductSize } from "util/constant";
import { ProductAPI } from "services/api";

const labelField = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Brand",
    field: "brand",
  },
  {
    label: "Color",
    field: "color",
  },
  {
    label: "Size",
    field: "size",
  },
];

const ModalFormNewProduct = (props) => {
  const { open, setClose, productInfo } = props;
  const [newProduct, setNewProduct] = useState({});
  const handleClose = () => {
    setClose();
  };

  const onSubmitChange = () => {
    // console.log('>> new product ', newProduct)
    const submit = {
      ...productInfo,
      ...newProduct,
    };
    ProductAPI.createProduct(newProduct);
    // setEditProduct(newProduct)
    handleClose();
  };
  const onInputNewFieldValue = (value, field) => {
    newProduct[field] = value;
    setNewProduct(newProduct);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={styles.modal}>
        {/* sx={style} */}
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
          {labelField.map((value) => (
            <FormControl key={value.label} fullWidth size="small">
              <InputLabel htmlFor="component-outlined">
                {value?.label}
              </InputLabel>
              <OutlinedInput
                id="component-outlined"
                label={value?.label}
                onChange={(event) =>
                  onInputNewFieldValue(event.target.value, value?.field)
                }
              />
            </FormControl>
          ))}
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
    </Modal>
  );
};

export default ModalFormNewProduct;
