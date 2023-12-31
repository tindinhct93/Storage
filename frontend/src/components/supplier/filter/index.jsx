import {
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  Checkbox,
} from "@mui/material";
import styles from "./styles.module.css";

export default function CustomFilter({ filter, setFilter, submitFilter }) {
  const parseFilter = ["drugType", "Month", "Year"];
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    console.log(name,value);
    if (name in parseFilter) {
      setFilter({
        [name]: +value,
      });
      return;
    }
    if (name === "isDebt") {
      setFilter({
          [name]: !filter.isDebt,
      });
      return;
    }

    setFilter({
      [name]: value,
    });
  };
  const resetState = () => {
    setFilter(0);
  };

  return (
    <div className="custom-filter">
      <Box display="flex" alignItems="center" sx={{ margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Loại SP
          </InputLabel>
          `
          <NativeSelect
            defaultValue={0}
            inputProps={{
              name: "drugType",
              id: "uncontrolled-native",
            }}
            onChange={handleFilterChange}
          >
            <option value={0}>Thuốc thường</option>
            <option value={1}>Thuốc Kiếm soát đặc biệt</option>
          </NativeSelect>
        </FormControl>
        <TextField
          className={styles["text-field"]}
          label="Tháng"
          name="Month"
          value={filter.Month}
          onChange={handleFilterChange}
        />
        <TextField
          className={styles["text-field"]}
          label="Năm"
          name="Year"
          value={filter.Year}
          onChange={handleFilterChange}
        />
        <TextField
          className={styles["text-field"]}
          label="MSHH"
          name="MSHH"
          value={filter.MSHH}
          onChange={handleFilterChange}
        />
        <TextField
          className={styles["text-field"]}
          label="Số lô"
          name="BatchNo"
          value={filter.BatchNo}
          onChange={handleFilterChange}
        />
          </Grid>

          <Grid item xs={12} sm={12}>
            <span>Chỉ Lọc hồ sơ nợ</span>
            <Checkbox
                checked={filter.isDebt}
                onChange={handleFilterChange}
                name="isDebt"
                color="primary"
            />
          <Button
          className={styles["custom-filter-button"]}
          color="primary"
          onClick={submitFilter}
        >
          Apply
        </Button>
        <Button
          className={styles["custom-filter-button"]}
          color="primary"
          onClick={resetState}
        >
          Reset to default
        </Button>
            </Grid>
        </Grid>
      </Box>
    </div>
  );
}
