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
  TextareaAutosize,
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
  SimpleButton,
  StyledTextarea,
} from "../../components/Components";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { showError, showSnackbar } from "../../redux/actions/auth";
import { handleOpenLink } from "../../utils/helper";

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
  const dispatch = useDispatch();

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
          dispatch(showSnackbar("Updated successfully", "success", 2000));
          fetchStockProperties();
          setEditModal(false);
        })
        .catch((err) => {
          dispatch(showError(err));
        });
    }
  };

  const handleOpenScreener = (stock) => {
    handleOpenLink(`https://www.screener.in/company/${stock.symbol}`);
  };

  const handleOpenGroww = async (growwSearchId) => {
    handleOpenLink(
      `https://groww.in/charts/stocks/${growwSearchId}?exchange=NSE`
    );
  };

  const handleOpenTradingView = async (nseSymbol) => {
    handleOpenLink(
      `https://in.tradingview.com/chart/VzChbHge/?symbol=NSE%3A${nseSymbol}`
    );
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
        <StyledTextarea
          label="Fundamentals"
          placeholder="Fundamentals"
          variant="outlined"
          fullWidth
          value={editPropertiesForm.fundamentals}
          onChange={handleChange}
          multiline
          minRows={3}
          name="fundamentals"
          color="primary"
          style={{ width: "100%" }}
          // sx={{ mb: 2 }}
        />
        <StyledTextarea
          label="Technical Analysis"
          placeholder="Technical Analysis"
          variant="outlined"
          fullWidth
          value={editPropertiesForm.technicals}
          onChange={handleChange}
          multiline
          minRows={3}
          name="technicals"
          style={{ width: "100%" }}
          // sx={{ mb: 2 }}
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
                height:
                  showReadMore &&
                  (properties.fundamentals || properties.technicals)
                    ? "30vh"
                    : "auto",
                transition: "height 2s",
              }}
            >
              {properties.fundamentals && (
                <SectionBox>
                  <SectionBoxHeading>Fundamentals:</SectionBoxHeading>
                  {properties.fundamentals.split("\n").map((line, index) => (
                    <Typography key={index}>{line}</Typography>
                  ))}
                </SectionBox>
              )}
              {properties.technicals && (
                <SectionBox>
                  <SectionBoxHeading>Technical Analysis:</SectionBoxHeading>
                  {properties.technicals.split("\n").map((line, index) => (
                    <Typography key={index}>{line}</Typography>
                  ))}
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
          <Box>
            <SimpleButton
              onClick={() => handleOpenTradingView(properties.stockId.symbol)}
            >
              TradingView
            </SimpleButton>
            <SimpleButton
              onClick={() => handleOpenGroww(properties.stockId.growwSearchId)}
            >
              Groww
            </SimpleButton>
            <SimpleButton
              onClick={() => handleOpenScreener(properties.stockId)}
            >
              Screener
            </SimpleButton>
            <IconButton onClick={handleOpenModal}>
              <EditIcon color="primary" />
            </IconButton>
          </Box>
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
