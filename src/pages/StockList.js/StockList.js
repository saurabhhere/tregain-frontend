import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { addNewStock, getAllStocks, getUserStock } from "../../api/stock";
import GeneralModal from "../../components/Modal";
import { addNewCategory } from "../../api/categories";
import { connect, useDispatch } from "react-redux";
import {
  getAvailableCategories,
  getAvailableStocks,
  handleActiveStock,
} from "../../redux/actions/user";
import SearchIcon from "@mui/icons-material/Search";
import { SearchBox, StockListItem } from "../../components/Components";
import { showError, showSnackbar } from "../../redux/actions/auth";

function StockList({ user }) {
  const InitState = {
    categoryName: "",
  };

  const [filteredStocks, setFilteredStocks] = useState(user.availableStocks);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setFilteredStocks(user.availableStocks);
    setSearchTerm("");
  }, [user.availableStocks]);

  // New Stock
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState(InitState);

  // New Category
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const [stockOptions, setStockOptions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStockOptions()
  },[])

  const fetchStockOptions = async () => {
    try {
      getAllStocks()
        .then((res) => {
          console.log("getAllStocks", res.data)
          setStockOptions(res.data)
        })
        .catch((err) => {
          dispatch(showError(err));
          console.error("Error while fetching all stocks", err)
        })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

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
    if (stockOptions.length == 0) fetchStockOptions()
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStock(null)
  };

  const handleSubmit = () => {
    addNewStock(selectedStock)
      .then((res) => {
        dispatch(showSnackbar("Added Stock successfully", "success", 4000));
        handleResetForm();
        handleCloseModal();
        setSelectedStock(null)
        dispatch(getAvailableStocks());
      })
      .catch((err) => {
        dispatch(showError(err));
      });
  };

  const handleCategorySubmit = () => {
    if (form.categoryName != "") {
      addNewCategory({
        name: form.categoryName,
      })
        .then((res) => {
          dispatch(showSnackbar("Added Category successfully", "success", 4000));
          handleResetForm();
          setOpenCategoryModal(false);
          dispatch(getAvailableCategories());
        })
        .catch((err) => {
          dispatch(showError(err));
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
        <Autocomplete
          id="stock-select-demo"
          options={stockOptions}
          autoHighlight
          getOptionLabel={(option) => option.name}
          value={selectedStock}
          onChange={(event, newValue) => {
            setSelectedStock(newValue);
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.name} ({option.symbol})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a stock"
              variant="outlined"
              fullWidth
            />
          )}
          style={{marginBottom : 10}}
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
    <Box sx={{ backgroundColor: "#f0f0f0", overflowY: "auto", height: "100vh", position: 'relative' }}>
      <Box p={2}>
        <SearchBox
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List style={{ width: "100%"}}>
        {filteredStocks.map((stock) => (
          <StockListItem
            style={
              stock == user.activeStock
                ? { background: "#e5d8f0" }
                : { cursor: "pointer" }
            }
            key={stock._id}
            onClick={() => handleStockClick(stock)}
          >
            <ListItemText primary={stock.name} />
          </StockListItem>
        ))}
      </List>

      <Box position={'sticky'} bottom={20} p={2} style={{background: '#f0f0f0'}}>
        <Box>
          <Button fullWidth variant="contained" onClick={handleOpenModal}>
            Add Stock
          </Button>
        </Box>
        <Box paddingTop={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenCategoryModal(true)}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {renderStockAddModal()}
      {renderCategoryAddModal()}
    </Box>
  );
}

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(StockList);
