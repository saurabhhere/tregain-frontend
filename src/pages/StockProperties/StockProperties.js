import React, { useState, useEffect, useRef } from "react";
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
import {
  CategoryListItem,
  SectionBox,
  SectionBoxHeading,
} from "../../components/Components";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

const StockProperties = ({ user }) => {
  const InitState = {
    categories: [],
    fundamentals: "",
    technicals: "",
    recommendedBy: "",
  };

  const [properties, setProperties] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);

  const [editPropertiesForm, setEditPropertiesForm] = useState(InitState);

  const fetchStockProperties = () => {
    if (user.activeStock._id) {
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
    if (contentRef.current) {
      const contentHeight = contentRef.current.clientHeight;
      const windowHeight = window.innerHeight;
      setShowReadMore(contentHeight > windowHeight * 0.3);
    }
  }, [properties]);

  const handleReadMoreClick = () => {
    setShowReadMore(false);
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
        <Box
          style={{ padding: "20px" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Box>
            <Typography variant="h5" fontWeight={500}>
              {properties.stockId.name}
            </Typography>
            <Typography>NSE: {properties.stockId.symbol}</Typography>
            <Box marginTop={1} marginBottom={2}>
              {properties.categories.length > 0 &&
                properties.categories.map((category, index) => (
                  <CategoryListItem component="span" key={index}>
                    {category.name}
                  </CategoryListItem>
                ))}
              {properties.recommendedBy && (
                <CategoryListItem
                  component="span"
                  style={{ background: "#b1dbd9" }}
                >
                  {properties.recommendedBy}
                </CategoryListItem>
              )}
            </Box>
            <Box
              ref={contentRef}
              style={{
                overflow: "hidden",
                height: showReadMore && (properties.fundamentals || properties.technicals) ? "30vh" : "auto",
                transition: "height 2s",
              }}
            >
              {properties.fundamentals && (
                <SectionBox>
                  <SectionBoxHeading>Fundamentals:</SectionBoxHeading>
                  <Typography>{properties.fundamentals}</Typography>
                </SectionBox>
              )}
              {properties.technicals && (
                <SectionBox>
                  <SectionBoxHeading>Technical Analysis:</SectionBoxHeading>
                  <Typography>{properties.technicals}</Typography>
                </SectionBox>
              )}
            </Box>
            {showReadMore && (
              <Button
                onClick={handleReadMoreClick}
                style={{ textTransform: "capitalize", paddingLeft: 0 }}
              >
                Read More
              </Button>
            )}
          </Box>
          <IconButton onClick={handleOpenModal}>
            <EditIcon color="primary" />
          </IconButton>
        </Box>
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
