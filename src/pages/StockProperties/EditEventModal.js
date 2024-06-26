import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";
import { getEventById } from "../../api/events";
import { connect, useDispatch } from "react-redux";
import GeneralModal from "../../components/Modal";
import { UPDATE_EXISTING_EVENT } from "../../redux/const/types";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { StyledTextarea } from "../../components/Components";


const EditEventModal = ({ open, onClose, onSubmit, eventId, user, type }) => {
  const Init = {
    description: "",
    link: "",
    remarks: "",
    marketPrice: "",
    categories: [],
    stocks: [user.activeStock],
    eventDate: dayjs(new Date())
  };

  const [eventDetails, setEventDetails] = useState(Init);
  const dispatch = useDispatch()

  const fetchEventDetails = async () => {
    getEventById(eventId)
      .then((res) => {
        console.log("API CALL:fetchEventDetails ", res.data)
        setEventDetails({...res.data, eventDate: dayjs(new Date(res.data.eventDate))});
      })
      .catch((err) => console.error("Error while fetching event details", err));
  };

  useEffect(() => {
    if (open && eventId != null && type == UPDATE_EXISTING_EVENT) {
      fetchEventDetails();
    }
  }, [open, eventId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    console.log(date)
    setEventDetails({
      ...eventDetails,
      eventDate: date
    })
  }

  const handleCategoryChange = (selectedCategory) => {
    const isChecked = eventDetails.categories
      .map((item) => item._id)
      .includes(selectedCategory._id);
    let updatedCategories;

    if (isChecked) {
      updatedCategories = eventDetails.categories.filter(
        (category) => category._id !== selectedCategory._id
      );
    } else {
      updatedCategories = [...eventDetails.categories, selectedCategory];
    }
    setEventDetails((prevState) => ({
      ...prevState,
      categories: updatedCategories,
    }));
  };

  const handleStockChange = (selectedStock) => {
    const isChecked = eventDetails.stocks
      .map((item) => item._id)
      .includes(selectedStock._id);

    let updatedStocks;

    if (isChecked) {
      updatedStocks = eventDetails.stocks.filter(
        (stock) => stock._id !== selectedStock._id
      );
    } else {
      updatedStocks = [...eventDetails.stocks, selectedStock];
    }
    setEventDetails((prevState) => ({
      ...prevState,
      stocks: updatedStocks,
    }));
  };

  const handleSubmit = () => {
    const data = {
      description: eventDetails.description,
      marketPrice: eventDetails.marketPrice,
      remarks: eventDetails.remarks,
      link: eventDetails.link,
      categoryIds: eventDetails.categories.map((item) => item._id),
      stockIds: eventDetails.stocks.map((item) => item._id),
      eventDate: eventDetails.eventDate
    };
    if (data.description != "" && (data.stockIds.length > 0 || data.categoryIds.length > 0 )){
      onSubmit(data);
      onClose();
    }
  };

  return (
    <GeneralModal open={open} onClose={onClose} onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="stocks-label">Stocks</InputLabel>
        <Select
          labelId="stocks-label"
          id="stocks-select"
          multiple
          value={eventDetails.stocks}
            renderValue={(selected) =>
              selected.map((item) => item.name).join(", ")
            }
        >
          {user.availableStocks.length > 0 &&
            user.availableStocks.map((stock) => (
              <MenuItem
                key={stock._id}
                value={stock._id}
                onClick={() => handleStockChange(stock)}
              >
                <Checkbox
                  checked={
                    eventDetails &&
                    eventDetails.stocks &&
                    eventDetails.stocks
                      .map((item) => item._id)
                      .includes(stock._id)
                  }
                />{" "}
                <ListItemText primary={stock.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="categories-label">Categories</InputLabel>
        <Select
          labelId="categories-label"
          id="categories-select"
          multiple
          value={eventDetails.categories}
            renderValue={(selected) =>
              selected.map((item) => item.name).join(", ")
            }
        >
          {user.availableCategories.length > 0 &&
            user.availableCategories.map((category) => (
              <MenuItem
                key={category._id}
                value={category.id}
                onClick={() => handleCategoryChange(category)}
              >
                <Checkbox
                  checked={
                    eventDetails &&
                    eventDetails.categories &&
                    eventDetails.categories
                      .map((item) => item._id)
                      .includes(category._id)
                  }
                />{" "}
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
{/* 
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        name="description"
        value={eventDetails.description}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      /> */}

      <StyledTextarea
          label="Descriptions"
          placeholder="Description"
          variant="outlined"
          fullWidth
          value={eventDetails.description}
          onChange={handleInputChange}
          multiline
          minRows={3}
          name="description"
          style={{width: '100%'}}
          // sx={{ mb: 2 }}
        />

      <TextField
        label="Link"
        variant="outlined"
        fullWidth
        value={eventDetails.link}
        name="link"
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Remarks"
        variant="outlined"
        fullWidth
        value={eventDetails.remarks}
        name="remarks"
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />
      <Box marginRight={5} display={'flex'}>
      <TextField
        label="Market Price"
        variant="outlined"
        type="number"
        value={eventDetails.marketPrice}
        name="marketPrice"
        onChange={handleInputChange}
        sx={{ mb: 2, marginRight: 5 }}
      />
      <DatePicker
        label="Event date"
        value={eventDetails.eventDate}
        onChange={(date) => handleDateChange(date)}
        format="DD/MM/YYYY"
      />
      </Box>
    </GeneralModal>
  );
};
const mapStateToProps = (state) => ({ user: state.user });

export default  connect(mapStateToProps)(EditEventModal);
