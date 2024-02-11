import React from 'react';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = ({ searchInput, setSearchInput }) => {
  // const handleInputChange = debounce((value) => {
  //   setSearchInput(value);
  // }, 500); // Adjust the debounce delay (in milliseconds) according to your needs

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  return (
 
    <TextField
    
    placeholder="Search SKU"
    fullWidth
    size='small'
    value={searchInput}
    onChange={handleChange}
    style={{
      backgroundColor: 'white',
      borderRadius: '5px',
      fontWeight: 600,
      width: '300px',
      margin:'auto',
    }}
    InputProps={{
      startAdornment: (
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px' }} />
      ),
    }}
  />
  
    
  );
};


