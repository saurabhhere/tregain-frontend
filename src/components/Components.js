import * as React from "react";
import { styled } from "@mui/material/styles";
import { ListItem, TextField } from "@mui/material";

export const SearchBox = styled(TextField)(({ theme }) => ({
  border: "none",
  outline: "none",
  background: theme.palette.primary.background,
  borderRadius: 8,
  "& fieldset": {
    border: "none",
    outline: "none",
  },
  '& input': {
    padding: '10px',
    paddingLeft: '0px'
  }
}));


export const StockListItem = styled(ListItem)(({ theme }) => ({
    margin: 5,
    cursor: 'pointer',
    '&:hover': {
        background: theme.palette.primary.background,
    },
    width: 'auto',
    borderRadius: 4
}));