import React from "react";
import { styled } from "@mui/system";
import useGetUnmappedSkus from "./hooks/useGetUnmappedSkus";
import useDistinctAurbitrageSkus from "./hooks/useDistinctAurbitrageSkus";
import useAssignSkuRelation from "./hooks/useAssignSkuRelation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { SearchBar } from "@/components/SearchBar";
import { FilterGroup } from "@/components/FilterGroup";
import {
  LinearProgress,
  Autocomplete,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TableVirtuoso } from "react-virtuoso";

import LoginButton from "../components/LoginButton";


const StyledDiv = styled("div")(({ theme }) => ({
  minWidth: "80vw",
  minHeight: "80vh",
  color: theme.typography.color.primary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 4),
  "& .dashboardHeader": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "-40px -30px 10px -30px",
    position: "sticky",
    top: 0,
    backgroundColor: "#F0F0F0",
    zIndex: 10,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",

  },

  "& .label": {
    height: "32px",
    display: "flex",
    padding: "0 12px",
    backgroundColor: "#C0C0C0",
    borderRadius: "5px",
    fontWeight: 600,
    alignItems: "center",
  },

 
}));

const TableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => <Table {...props} style={{ borderCollapse: "separate" ,fontFamily: "Roboto" ,fontWeight:"800",fontSize:"12px"}} />,
  TableHead: TableHead,
  TableRow: TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const AdminDashboard = () => {
  const { data, loading } = useGetUnmappedSkus();
  const { data: AurbitrageSKUMeta } = useDistinctAurbitrageSkus();
  const {
    loading: skuRelationsLoading,
    error: skuRelationError,
    postData,
  } = useAssignSkuRelation();
  const [view, setView] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [dealerFilter, setDealerFilter] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState({
    show: false,
    error: false,
  });
  const [skuRealtionIdx, setSkuRelationIdx] = React.useState({});
  const viewFilter = (item) => {
    return (
      item.SKU.toLowerCase().includes(searchInput.toLocaleLowerCase()) &&
      (dealerFilter.length == 0 || dealerFilter.includes(item.Dealer))
    );
  };
  React.useEffect(() => {
    setView(data);
  }, [data]);

  const assignSkuRealtion = (row, sku) => {
    postData(sku, row.SKU, row.Dealer);
  };

  React.useEffect(() => {
    if (skuRelationsLoading !== "loading" && skuRelationsLoading !== "idle") {
      setShowAlert({ show: true, error: skuRelationError!=="" })
    }
  }, [skuRelationsLoading, skuRelationError]);


  const updateSkuRelationIdx = (row, value) => {
    const tempIdx ={}
    tempIdx[row.Dealer + row.SKU] = value
    setSkuRelationIdx(tempIdx);
  };

  const hideAlert = () => {
    setShowAlert((p) => {
      return { ...p, show: false };
    });
  };

  if (loading === "loading") {
    return (
      <StyledDiv>
        <div style={{ width: "70vw", margin: "30vh auto" }}>
          <h2> Fetching Data </h2>
          <LinearProgress />
        </div>
      </StyledDiv>
    );
  }

  if (loading === "failed") {
    return (
      <StyledDiv>
        <div style={{ width: "70vw", margin: "30vh auto" }}>
          <h2>
            <FontAwesomeIcon size="xl" icon={faTriangleExclamation} />
            &nbsp; Oops, Failed to fetch data!
          </h2>
        </div>
      </StyledDiv>
    );
  }
  return (
    <StyledDiv>
      <div className="dashboardHeader">
        <h2 style={{ fontSize: "2em", margin: "5px" }}>Admin Dashboard</h2>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {" "}
          <div className="label">
            <div style={{ fontSize: "0.8em", cursor: "pointer" }}>
              Unmapped Skus: {data.length}
            </div>
          </div>
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
          <FilterGroup
            options={AurbitrageSKUMeta.Dealers}
            filters={dealerFilter}
            title="Dealer"
            onChange={setDealerFilter}
          />
        </div>
      </div>
      <TableVirtuoso
        style={{ height: "85vh" }}
        data={view.filter(viewFilter)}
        components={TableComponents}
        fixedHeaderContent={() => (
          <TableRow sx={{ backgroundColor: "#E0FFFF", width: "100%" ,}}>
            <TableCell>SKU</TableCell>
            <TableCell align="right">Dealer</TableCell>
            <TableCell>Aurbitrage SKU</TableCell>
            <TableCell align="right">
              count:{view.filter(viewFilter).length}
            </TableCell>
          </TableRow>
        )}
    itemContent={(index, row) => (
  <>
    <TableCell component="th" scope="row" style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }}>
      {row.SKU}
    </TableCell>
    <TableCell align="right" style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }}>
      {row.Dealer}
    </TableCell>
    <TableCell align="right" style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }}>
      <Autocomplete
        freeSolo
        disablePortal
        id="combo-box-demo"
        options={AurbitrageSKUMeta.AurbitrageSKU || []}
        value={skuRealtionIdx[row.Dealer + row.SKU] || ""}
        sx={{ width: 400 }}
        onChange={(e, v) => {
          updateSkuRelationIdx(row, v);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Aurbitrage SKU" />
        )}
      />
    </TableCell>
    <TableCell align="right" style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }}>
      <Button
        variant="outlined"
        disabled={
          skuRelationsLoading === "loading" ||
          !skuRealtionIdx[row.Dealer + row.SKU]
        }
        onClick={() => {
          assignSkuRealtion(row, skuRealtionIdx[row.Dealer + row.SKU])
        }}
      >
        Save
        {skuRealtionIdx[row.Dealer + row.SKU] && skuRelationsLoading === "loading" &&
          <CircularProgress style={{ height: "1em", width: "1em", marginLeft: "5px" }} />}
      </Button>
    </TableCell>
  </>
)}

      />
      <Snackbar
        open={showAlert.show}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={hideAlert}
      >
        <Alert
          onClose={hideAlert}
          severity={showAlert.error ? "error" : "success"}
          variant="filled"
        >
        {showAlert.error? "Failed to assign SKU": "SKU Assigned"}
        </Alert>
      </Snackbar>
    </StyledDiv>
  );
};

export default AdminDashboard;
