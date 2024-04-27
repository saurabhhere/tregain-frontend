import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import StockList from "../StockList.js/StockList";
import StockProperties from "../StockProperties/StockProperties";
import { connect, useDispatch } from "react-redux";

import {
  getAvailableCategories,
  getAvailableStocks,
} from "../../redux/actions/user";

function Homepage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAvailableCategories());
    dispatch(getAvailableStocks());
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#e0e0e0" }}>
      <Box
        sx={{
          flex: "0 0 28%",
          backgroundColor: "#f0f0f0",
          overflowY: "auto",
          margin: "1%",
          boxShadow: 1,
          borderRadius: 4,
        }}
      >
        {<StockList />}
      </Box>
      <Box
        sx={{
          flex: "0 0 69%",
          backgroundColor: "#f0f0f0",
          overflowY: "auto",
          margin: "1%",
          marginLeft: 0,
          boxShadow: 1,
          borderRadius: 4,
        }}
      >
        <StockProperties />
      </Box>
    </Box>
  );
}

export default Homepage;
