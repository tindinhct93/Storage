import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
function formatDate(date = new Date()) {
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", {
    month: "2-digit",
  });
  const day = date.toLocaleString("default", { day: "2-digit" });

  return [year, month, day].join("-");
}
function RowModal({ selectedRow, handleSave, handleReturn, setSelectedRow }) {
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
      setSelectedRow(null);
      setError({ error: false, helperText: "" });
      return;
    }
    handleSubmit();
  };
  const handleCancel = () => {
    setSelectedRow(null);
    setError({ error: false, helperText: "" });
  };
  const handleSubmit = async () => {
    try {
      if (!data.borrower) {
        setError({ error: true, helperText: "Người mượn không được để trống" });
        return;
      }

      await handleSave(data);
      setError({ error: false, helperText: "" });
    } catch (e) {
      console.log(e);
      alert("An error occur");
    }
  };

  const handleReturnFunction = async () => {
    try {
      await handleReturn(data);
      setError({ error: false, helperText: "" });
    } catch (e) {
      console.log(e);
      alert("An error occur");
    }
  };

  const today = new Date();
  const disableForm = selectedRow ? selectedRow.borrower : false;

  let borrow_date = "";
  if (data) {
    if (data.borrow_date != null) {
      let dateGet = new Date(data.borrow_date);
      borrow_date = formatDate(dateGet);
    } else {
      borrow_date = formatDate(today);
      data.borrow_date = borrow_date;
    }
  }

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
          {selectedRow
            ? `${selectedRow.product_code} - ${selectedRow.product_name} - ${selectedRow.batch_no}`
            : ""}
        </Typography>
        <TextField
          label="Người mượn"
          name="borrower"
          disabled={disableForm}
          value={data.borrower ? data.borrower : ""}
          onChange={handleInputChange}
          fullWidth
          error={error.error}
          helperText={error.helperText}
        />
        <TextField
          label="Ngày mượn"
          type="date"
          name="borrow_date"
          disabled={disableForm}
          value={borrow_date}
          onChange={handleInputChange}
          fullWidth
          error={error.error}
          helperText={error.helperText}
        />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="info"
            disabled={!disableForm}
            onClick={handleReturnFunction}
            sx={{ mr: 1 }}
          >
            Trả Hồ sơ
          </Button>
          <Button
            variant="contained"
            color="info"
            disabled={disableForm}
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
