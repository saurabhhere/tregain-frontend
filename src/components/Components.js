import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, ListItem, TextField, Typography } from "@mui/material";

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

export const CategoryListItem = styled(Box)(({ theme }) => ({
    background: '#ffd88d',
    padding: 5,
    borderRadius: 4,
    margin: 4,
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(14),
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

export const SectionBox = styled(Box)(({ theme }) => ({
    margin: 5,
    marginLeft: 0
}));

export const SectionBoxHeading = styled(Typography)(({ theme }) => ({
    fontWeight: 500
}));