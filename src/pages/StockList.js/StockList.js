import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
} from "@mui/material";
import { addNewStock } from "../../api/stock";
import GeneralModal from "../../components/Modal";
import { addNewCategory } from "../../api/categories";
import { connect, useDispatch } from "react-redux";
import {
  getAvailableCategories,
  getAvailableStocks,
  handleActiveStock,
} from "../../redux/actions/user";

function StockList({ user }) {
  const InitState = {
    stockSymbol: "",
    stockName: "",
    categoryName: "",
  };

  const [filteredStocks, setFilteredStocks] = useState(user.availableStocks);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setFilteredStocks(user.availableStocks)
    setSearchTerm("")
  }, [user.availableStocks])

  // New Stock
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState(InitState);

  // New Category
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetForm = () => {
    setForm(InitState);
  };

  const handleStockClick = (stock) => {
    dispatch(handleActiveStock(stock));
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = user.availableStocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm)
    );
    setFilteredStocks(filtered);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    addNewStock({
      symbol: form.stockSymbol,
      name: form.stockName,
    })
      .then((res) => {
        dispatch(getAvailableStocks());
        handleResetForm();
        handleCloseModal();
      })
      .catch((err) => console.error("error while inserting stock"));
  };

  const handleCategorySubmit = () => {
    if (form.categoryName != "") {
      addNewCategory({
        name: form.categoryName,
      })
        .then((res) => {
          dispatch(getAvailableCategories());
          handleResetForm();
          setOpenCategoryModal(false);
        })
        .catch((err) => {
          console.error("Error while adding a new category");
        });
    }
  };

  const renderStockAddModal = () => {
    return (
      <GeneralModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Stock Symbol"
          variant="outlined"
          fullWidth
          value={form.stockSymbol}
          onChange={handleChange}
          name="stockSymbol"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Stock Name"
          variant="outlined"
          fullWidth
          value={form.stockName}
          onChange={handleChange}
          name="stockName"
          sx={{ mb: 2 }}
        />
      </GeneralModal>
    );
  };

  const renderCategoryAddModal = () => {
    return (
      <GeneralModal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onSubmit={handleCategorySubmit}
      >
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={form.categoryName}
          name="categoryName"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </GeneralModal>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#f0f0f0", overflowY: "auto", height: "100%" }}>
      <Box p={2}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <List>
        {filteredStocks.map((stock) => (
          <ListItem
            style={
              stock == user.activeStock
                ? { background: "#e5d8f0" }
                : { cursor: "pointer" }
            }
            key={stock._id}
            onClick={() => handleStockClick(stock)}
          >
            <ListItemText primary={stock.name} />
          </ListItem>
        ))}
      </List>

      <Box p={2}>
        <Button variant="contained" onClick={handleOpenModal}>
          Add Stock
        </Button>
      </Box>
      <Box p={2}>
        <Button variant="contained" onClick={() => setOpenCategoryModal(true)}>
          Add Category
        </Button>
      </Box>
      {renderStockAddModal()}
      {renderCategoryAddModal()}
    </Box>
  );
}

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(StockList);
