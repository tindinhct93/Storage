import * as React from "react";
import { Checkbox } from "@mui/material";
import { SupplierAPI } from "../../services/supplier-api";

export default function ControlledCheckbox(rowData) {
  const [checked, setChecked] = React.useState(rowData.data.qm_received);
  const handleChange = async (event) => {
    try {
      let submitValue = event.target.checked;
      let submitData = { QA: submitValue };
      await SupplierAPI.editQAReport(rowData.data.id, submitData);
      console.log("Edit QA report successfully");
      setChecked(submitValue);
    } catch (e) {
      console.error(e);
      alert("An error occur");
    }
  };

  return <Checkbox checked={checked} onChange={handleChange} />;
}
