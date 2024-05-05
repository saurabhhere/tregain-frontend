import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, ListItem, TextField, TextareaAutosize, Typography } from "@mui/material";

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

export const EventBox = styled(Box)(({ theme }) => ({
  background: '#ebebeb',
  marginBottom: 10,
  padding: 5,
  paddingLeft: 8,
  borderRadius: 8
}));

export const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 5,
}));

export const GreyText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  color: '#616161'
}));

export const StyledTextarea = styled(TextareaAutosize)({
  width: '100%',
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #bdbdbd',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus': {
    outline: 'none',
    borderColor: '#1976d2',
  },
  marginBottom: '10px',
  fontFamily: 'Inter'
});

export const SimpleButton = styled(Button)({
  textTransform: 'capitalize',
  border: '1px solid',
  marginRight: 5
})