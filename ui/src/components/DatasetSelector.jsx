import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import OutlinedInput from '@mui/material/OutlinedInput';

const DatasetSelector = ({ dataset, setDataset }) => {
  const datasets = ["Collection1", "Collection2", "Collection3"]; // Replace with dynamic data

  return (
    <FormControl fullWidth>
      <InputLabel id="account-select-label">Select the Account</InputLabel>

      <Select
        labelId="account-select-label"
        id="account-select"
        value={dataset}
        onChange={(e) => setDataset(e.target.value)}
        input={<OutlinedInput label="Select the Account" />}
      >
        {datasets.map((ds) => (
          <MenuItem key={ds} value={ds}>
            {ds}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DatasetSelector;
