import React, { useEffect, useState } from "react";
import {
  addNewEvent,
  deleteEventById,
  getStockEvents,
  updateEventById,
} from "../../api/events";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { connect, useDispatch } from "react-redux";
import EditEventModal from "./EditEventModal";
import {
  CREATE_NEW_EVENT,
  UPDATE_EXISTING_EVENT,
} from "../../redux/const/types";
import LinkIcon from "@mui/icons-material/Link";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleOpenLink } from "../../utils/helper";
import {
  EventBox,
  FlexBox,
  GreyText,
  RemarksText,
  SearchBox,
} from "../../components/Components";
import SearchIcon from "@mui/icons-material/Search";
import { showError, showSnackbar } from "../../redux/actions/auth";

function StockEvents({ user }) {

  const dispatch = useDispatch()

  const [events, setEvents] = useState([]);
  const [addEventModal, setAddEventModal] = useState(false);
  const [openEditEventModal, setOpenEditEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const openAddEventModal = () => {
    setAddEventModal(true);
  };

  const closeAddEventModal = () => {
    setAddEventModal(false);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = events.filter(
      (event) =>
        event.description.toLowerCase().includes(searchTerm) ||
        event.remarks.toLowerCase().includes(searchTerm)
    );
    setFilteredEvents(filtered);
  };

  const handleSubmitEvent = (eventData) => {
    addNewEvent(eventData)
      .then((res) => {
        dispatch(showSnackbar("Added Event successfully", "success", 2000))
        fetchStockEvents();
      })
      .catch((err) => {
        dispatch(showError(err));
      });
  };

  const handleUpdateEvent = (eventData) => {
    updateEventById(selectedEvent, eventData)
      .then((res) => {
        dispatch(showSnackbar("Updated Event successfully", "success", 2000));
        fetchStockEvents();
      })
      .catch((err) => {
        dispatch(showError(err));
      });
  };

  const fetchStockEvents = () => {
    if (user.activeStock._id) {
      getStockEvents(user.activeStock._id)
        .then((res) => {
          console.log("API CALL: stock events", res.data);
          setEvents(res.data);
          setFilteredEvents(res.data);
        })
        .catch((err) => {
          dispatch(showError(err));
          console.error("Error while fetching stock events");
        });
    }
  };

  const handleDeleteEvent = (eventId) => {
    console.log("delete evvent", eventId);
    deleteEventById(eventId)
      .then((res) => {
        console.log("API CALL: Delete event", res.data);
        fetchStockEvents();
      })
      .catch((err) => {
        dispatch(showError(err));
        console.error("Error while deleting stock events", err);
      });
  };

  useEffect(() => {
    fetchStockEvents();
  }, [user.activeStock]);

  const handleOpenEditEventModal = (eventId) => {
    setSelectedEvent(eventId);
    setOpenEditEventModal(true);
  };

  const handleCloseEditEventModal = () => {
    setOpenEditEventModal(false);
    setSelectedEvent();
  };

  return (
    <Box p={2} paddingTop={0}>
      <FlexBox>
        <Typography variant="h6" fontSize={18}>
          Events
        </Typography>
        <Box maxWidth={600}>
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
        <Button variant="outlined" onClick={openAddEventModal}>
          Add Event
        </Button>
      </FlexBox>
      {filteredEvents.length > 0 &&
        filteredEvents.map((event) => (
          <EventBox>
            <FlexBox key={event._id}>
              <Box display={"flex"}>
                <Typography variant="subtitle1" marginRight={2}>
                  {new Date(event.eventDate).toLocaleDateString()}
                </Typography>
                <Box>
                  {event.description.split("\n").map((line, index) => (
                    <Typography variant="subtitle1" key={index}>
                      {line}
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box display={"flex"}>
                  <IconButton onClick={() => handleOpenLink(event.link)}>
                    <LinkIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenEditEventModal(event._id)}
                  >
                    <EditNoteIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEvent(event._id)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </Box>
                {event.marketPrice && <Typography fontSize={14}>₹{event.marketPrice}</Typography>}
              </Box>
            </FlexBox>
            {event.remarks && (
              <Box>
                <GreyText>Remarks: {event.remarks}</GreyText>
              </Box>
            )}
          </EventBox>
        ))}

      {(addEventModal || selectedEvent != null) && (
        <EditEventModal
          open={addEventModal || openEditEventModal}
          onClose={
            addEventModal ? closeAddEventModal : handleCloseEditEventModal
          }
          onSubmit={addEventModal ? handleSubmitEvent : handleUpdateEvent}
          eventId={selectedEvent}
          type={addEventModal ? CREATE_NEW_EVENT : UPDATE_EXISTING_EVENT}
        />
      )}
    </Box>
  );
}
const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(StockEvents);
