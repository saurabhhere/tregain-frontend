import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { getStockProperty, updateStockProperty } from "../../api/stockProperty";
import { getAllCategories } from "../../api/categories";
import StockEvents from "./StockEvents";
import { connect, useDispatch } from "react-redux";
import GeneralModal from "../../components/Modal";

const StockProperties = ({ user }) => {
  const InitState = {
    categories: [],
    fundamentals: "",
    technicals: "",
    recommendedBy: "",
  };

  const [properties, setProperties] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const [editPropertiesForm, setEditPropertiesForm] = useState(InitState);

  const fetchStockProperties = () => {
    if (user.activeStock._id) {
    console.log("Fetching StockProperties for ", user.activeStock)
      getStockProperty(user.activeStock._id)
        .then((res) => {
          setProperties(res.data);
          setEditPropertiesForm(res.data);
        })
        .catch((err) => {
          console.error("Error while fetching stock properties");
        });
    }
  };

  useEffect(() => {
    fetchStockProperties();
  }, [user.activeStock]);

  const handleCategoryChange = (selectedCategory) => {
    const isChecked = editPropertiesForm.categories
      .map((item) => item._id)
      .includes(selectedCategory._id);
    let updatedCategories;

    if (isChecked) {
      updatedCategories = editPropertiesForm.categories.filter(
        (category) => category._id !== selectedCategory._id
      );
    } else {
      updatedCategories = [...editPropertiesForm.categories, selectedCategory];
    }
    setEditPropertiesForm({
      ...editPropertiesForm,
      categories: updatedCategories,
    });
  };

  const handleChange = (e) => {
    setEditPropertiesForm({
      ...editPropertiesForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenModal = () => {
    setEditModal(true);
  };

  const handleCloseModal = () => {
    setEditModal(false);
  };

  const handleUpdateProperties = () => {
    if (user.activeStock._id) {
      updateStockProperty(user.activeStock._id, {
        fundamentals: editPropertiesForm.fundamentals,
        technicals: editPropertiesForm.technicals,
        recommendedBy: editPropertiesForm.recommendedBy,
        categories: editPropertiesForm.categories.map((item) => item._id),
      })
        .then((res) => {
          fetchStockProperties();
          setEditModal(false);
        })
        .catch((err) => console.error("Error while updating stock properties"));
    }
  };

  const renderEditModal = () => {
    return (
        <GeneralModal
        open={editModal}
        onClose={handleCloseModal}
        onSubmit={handleUpdateProperties}
      >
          <Typography variant="h6" gutterBottom>
            Edit Stock
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="categories-label">Categories</InputLabel>
            <Select
              labelId="categories-label"
              id="categories-select"
              multiple
              value={editPropertiesForm.categories}
              name="categories"
              //   onChange={handleChange}
              renderValue={(selected) =>
                selected.map((item) => item.name).join(", ")
              }
            >
              {user.availableCategories.map((category, index) => (
                <MenuItem
                  key={index}
                  value={category}
                  onClick={() => handleCategoryChange(category)}
                >
                  <Checkbox
                    checked={
                        editPropertiesForm &&
                        editPropertiesForm.categories &&
                        editPropertiesForm.categories
                        .map((item) => item._id)
                        .includes(category._id)
                    }
                  />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Fundamentals"
            variant="outlined"
            fullWidth
            value={editPropertiesForm.fundamentals}
            onChange={handleChange}
            multiline
            rows={3}
            name="fundamentals"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Technical Analysis"
            variant="outlined"
            fullWidth
            value={editPropertiesForm.technicals}
            onChange={handleChange}
            multiline
            rows={3}
            name="technicals"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Recommended By"
            variant="outlined"
            fullWidth
            value={editPropertiesForm.recommendedBy}
            onChange={handleChange}
            name="recommendedBy"
            sx={{ mb: 2 }}
          />
          </GeneralModal>
    );
  };

  return (
    <Box sx={{ overflowY: "auto", height: "100%" }}>
      {properties ? (
        <div style={{ padding: "20px" }}>
          <Typography variant="h5">
            {properties.stockId.name} ({properties.stockId.symbol})
          </Typography>
          <Typography variant="subtitle1">Categories:</Typography>
          <ul>
            {properties.categories.map((category, index) => (
              <li key={index}>{category.name}</li>
            ))}
          </ul>
          <Typography variant="subtitle1">Fundamentals:</Typography>
          <Typography>{properties.fundamentals}</Typography>
          <Typography variant="subtitle1">Technical Analysis:</Typography>
          <Typography>{properties.technicals}</Typography>
          <Typography variant="subtitle1">Recommended By:</Typography>
          <Typography>{properties.recommendedBy}</Typography>
          <Button variant="contained" onClick={handleOpenModal}>
            Edit
          </Button>
        </div>
      ) : (
        <div style={{ padding: "20px" }}>No stock selected.</div>
      )}
      <StockEvents />
      {renderEditModal()}
    </Box>
  );
};
const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(StockProperties);
