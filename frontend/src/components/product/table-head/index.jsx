import { Toolbar, alpha, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { AddCircleOutline } from "@mui/icons-material";

export default function ProductTableHead(props) {
  const { rowSelected, deleteRowHandler, openCreateModal, title } = props;

  return (
    <Toolbar
      sx={{
        ...props.sx,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(rowSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {rowSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {rowSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {rowSelected > 0 ? (
        <Tooltip title="Delete" onClick={deleteRowHandler}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add new product" onClick={() => openCreateModal()}>
            <IconButton>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}
