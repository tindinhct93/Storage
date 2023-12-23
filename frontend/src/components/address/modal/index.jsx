import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
const addressTypeEnum = [
  {
    value: "office",
    label: "office",
  },
  {
    value: "headquater",
    label: "headquater",
  },
  {
    value: "warehouse",
    label: "warehouse",
  },
];
function RowModal({ selectedRow, handleSave, setSelectedRow }) {
  const [open, setOpen] = useState(Boolean(selectedRow));
  const [data, setData] = useState({ ...selectedRow });
  const [error, setError] = useState({ error: false, helperText: "" });

  useEffect(() => {
    setOpen(Boolean(selectedRow));
    setData({ ...selectedRow });
  }, [selectedRow]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") return;
    if (reason === "escapeKeyDown") {
      handleCancel();
      return;
    }
    handleSubmit();
  };
  const handleCancel = () => {
    setSelectedRow(null);
    setError({ error: false, helperText: "" });
  };
  const handleSubmit = async () => {
    if (!data.addr) {
      return setError({ error: true, helperText: "Data shouldn't be null" });
    }
    try {
      handleSave(data);
      setError({ error: false, helperText: "" });
    } catch (e) {
      console.log(e);
      alert("An error occur");
    }
  };

  let isNewRow = selectedRow && Object.keys(selectedRow).length !== 0;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">
          {isNewRow ? `Edit` : "Create New Address"}
        </Typography>
        <TextField
          error={error.error}
          label="Address"
          name="addr"
          value={data.addr ? data.addr : " "}
          onChange={handleInputChange}
          fullWidth
          helperText={error.helperText}
        />
        <TextField
          select
          label="Type"
          value={data.type ? data.type : "office"}
          name="type"
          onChange={handleInputChange}
        >
          {addressTypeEnum.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RowModal;
