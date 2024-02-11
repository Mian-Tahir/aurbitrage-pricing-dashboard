import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import {
  faCaretDown,
  faFilter,
  faUndo,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/system";
const StyledDiv = styled("div")(({ theme }) => ({
  display: "inline-block",
  marginBottom: theme.spacing(0.5),
  "& .filterButton": {
    display: "flex",
    padding: theme.spacing(1.5),
    alignItems: "center",
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 12,
    margin: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#666",
    "&:hover": {
      cursor: "pointer",
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
  "& .active": {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light} !important`,
    color: theme.palette.primary.contrastText,
  },
  "& .searchBar": {
    position:"sticky",
    top:0, 
    zIndex:1,
    backgroundColor: theme.palette.background.paper
  }
}));
export const FilterGroup = ({ options, filters, title, onChange }) => {
  const [state, setState] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    const newState = {};
    options.forEach((option) => {
      newState[option] = filters.includes(option);
    });
    setState(newState);
  }, [options, filters]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggle = (option) => {
    const newState = { ...state, [option]: !state[option] };
    setState((prevState) => ({ ...prevState, [option]: !prevState[option] }));
    if (onChange) {
      onChange(Object.keys(newState).filter((key) => newState[key]));
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const showSearchBar = options.length > 10 && open;
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <StyledDiv>
      <button
        className={`filterButton ${
          Object.values(state).some((val) => val) ? "active" : ""
        }`}
        aria-controls={open ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faFilter} />
        &nbsp;{title || "Filters"}&nbsp;
        <FontAwesomeIcon icon={faCaretDown} />
        {filters.length > 0 && (
          <FontAwesomeIcon
            style={{
              marginLeft: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              padding: "3px",
              borderRadius: "100%",
            }}
            icon={faUndo}
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          />
        )}
      </button>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "filter-menu",
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        getContentAnchorEl={null}
      >
        {showSearchBar && (
          <MenuItem onKeyDown={(e) => e.stopPropagation()} sx={{position:"sticky",top:0, zIndex:1, backgroundColor:"#f4f4f4"}}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </MenuItem>
        )}
        {filteredOptions.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              toggle(option);
              handleClose();
            }}
            sx={{
              backgroundColor: state[option]
                ? "action.selected"
                : "background.paper",
            }}
          >
            <Checkbox checked={state[option]} color="primary" />
            {option}
          </MenuItem>
        ))}
      </Menu>
    </StyledDiv>
  );
};
