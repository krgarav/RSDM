import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function MuiDateTimeRangePicker() {
  const [value, setValue] = React.useState([dayjs(), dayjs()]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
      >
        <DateTimeRangePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} label="Start date & time" />
              <TextField {...endProps} label="End date & time" />
            </>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
