import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { visuallyHidden } from "@mui/utils";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import "./suppressionlist.css";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "email", numeric: false, disablePadding: true, label: "Email Address" },
  {
    id: "suppressionReason",
    numeric: false,
    disablePadding: false,
    label: "Suppression Reason",
  },
  {
    id: "dateAdded",
    numeric: false,
    disablePadding: false,
    label: "Date Added",
  },
];

function SuppressionListHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    onRequestSort,
    visibleRowsCount,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="table-header">
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < visibleRowsCount}
            checked={visibleRowsCount > 0 && numSelected === visibleRowsCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all emails" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SuppressionListHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  visibleRowsCount: PropTypes.number.isRequired,
};

function SuppressionListToolbar(props) {
  const { numSelected, onRemoveClick, filterText, onFilterTextChange } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!isDeleted) {
      setLoading(true); // Set loading to true
      setTimeout(() => {
        setLoading(false); // Set loading to false after 2 seconds
        setIsDeleted(true);
        setOpen(true);
        setTimeout(() => {
          setIsDeleted(false);
          setOpen(false); // Close Snackbar after a delay
          onRemoveClick();
        }, 3000); // Duration for showing snackbar
      }, 2000); // Duration for showing spinner
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          ></Typography>
        )}
        <div className="container1">
          <div className="finder__icon">
            <FaSearch /> {/* Use the imported search icon */}
          </div>
          <TextField
            size="small"
            placeholder="Search by email"
            value={filterText}
            onChange={(e) => onFilterTextChange(e.target.value)}
            sx={{
              mr: 2,
              width: "300px",
              "& .MuiOutlinedInput-root .MuiInputBase-input": {
                border: "none",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            className="finder__input" // Add className here
          />
        </div>
        {numSelected > 0 && (
          <>
            <Tooltip title="Remove">
              <button
                className={`button ${isDeleted ? "delete" : ""}`}
                onClick={handleClick}
              >
                <div className="icon">
                  <svg className="top">
                    <use xlinkHref="#top"></use>
                  </svg>
                  <svg className="bottom">
                    <use xlinkHref="#bottom"></use>
                  </svg>
                </div>
                <span>Remove</span>
              </button>
            </Tooltip>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%", border: "none" }}
              >
                Successfully removed from suppression!
              </Alert>
            </Snackbar>
          </>
        )}
      </Toolbar>
      {loading && (
        <div className="overlay">
          <CircularProgress size={50} sx={{ color: "#012970" }} />
        </div>
      )}
    </>
  );
}

SuppressionListToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired,
  onFilterTextChange: PropTypes.func.isRequired,
};

export default function SuppressionList() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("email");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterText, setFilterText] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [noRowsFound, setNoRowsFound] = React.useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item, index) => ({
          id: (index + 1).toString(), // Generate id based on index (starting from 1)
          email: item["Email address"],
          suppressionReason: item["Suppression reason"],
          dateAdded: item["Date added"],
        }));
        console.log("Formatted data:", formattedData); // Log formatted data
        setRows(formattedData); // Set formatted data in state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveClick = () => {
    const selectedEmails = rows
      .filter((row) => selected.includes(row.id))
      .map((row) => row.email);
    console.log("Remove selected emails:", selectedEmails);
    setSelected([]); // Clear selected state
    setFilterText(""); // Clear filter text state
  };

  const handleFilterTextChange = (value) => {
    setFilterText(value);
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter((row) =>
    row.email.toLowerCase().includes(filterText.toLowerCase())
  );

  const visibleRows = stableSort(
    filteredRows,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  useEffect(() => {
    // Step 2: Update noRowsFound state variable
    setNoRowsFound(filteredRows.length === 0);
  }, [filteredRows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <SuppressionListToolbar
          numSelected={selected.length}
          onRemoveClick={handleRemoveClick}
          filterText={filterText}
          onFilterTextChange={handleFilterTextChange}
        />

        <div className="table-container">
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <SuppressionListHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              visibleRowsCount={visibleRows.length}
            />
            <TableBody>
              {noRowsFound ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    No matching rows found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.email}
                      </TableCell>
                      <TableCell align="left">
                        {row.suppressionReason}
                      </TableCell>
                      <TableCell align="left">{row.dateAdded}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="table-footer">
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </Box>
  );
}
