import React, { useEffect, useState } from "react";
import { addNewEvent, deleteEventById, getStockEvents, updateEventById } from "../../api/events";
import {
  Box,
  Typography,
  Button
} from "@mui/material";
import { connect, useDispatch } from "react-redux";
import EditEventModal from "./EditEventModal";
import { CREATE_NEW_EVENT, UPDATE_EXISTING_EVENT } from "../../redux/const/types";

function StockEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [addEventModal, setAddEventModal] = useState(false);
  const [openEditEventModal, setOpenEditEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState()

  const openAddEventModal = () => {
    setAddEventModal(true);
  };

  const closeAddEventModal = () => {
    setAddEventModal(false);
  };


  const handleSubmitEvent = (eventData) => {
    addNewEvent(eventData)
    .then((res) => {
        fetchStockEvents()
    })
    .catch(err => console.error("Error while creating new event"))
  };

  const handleUpdateEvent = (eventData) => {
    updateEventById(selectedEvent, eventData)
    .then((res) => {
        fetchStockEvents()
    })
    .catch(err => console.error("Error while Updating event"))
  }

  const fetchStockEvents = () => {
    if (user.activeStock._id) {
      getStockEvents(user.activeStock._id)
        .then((res) => {
          console.log("API CALL: stock events", res.data);
          setEvents(res.data);
        })
        .catch((err) => {
          console.error("Error while fetching stock events");
        });
    }
  };

  const handleDeleteEvent = (eventId) => {
    console.log("delete evvent", eventId)
    deleteEventById(eventId)
    .then((res) => {
        console.log("API CALL: Delete event", res.data);
        setEvents(res.data);
    })
    .catch((err) => {
        console.error("Error while deleting stock events", err);
      });
  }

  useEffect(() => {
    fetchStockEvents();
  }, [user.activeStock]);

  const handleOpenEditEventModal = (eventId) =>{
    setSelectedEvent(eventId)
    setOpenEditEventModal(true)
  }

  const handleCloseEditEventModal = () => {
    setOpenEditEventModal(false)
    setSelectedEvent()
  }

  return (
    <Box p={2}>
      <Typography variant="h6">Events:</Typography>
      {events.length > 0 && events.map((event) => (
        <div key={event._id} style={{ marginBottom: "10px" }}>
          <Typography variant="subtitle1">{event.description}</Typography>
          <Typography>Link: {event.link}</Typography>
          <Typography>Market Price: {event.marketPrice}</Typography>
          <Typography>Remarks: {event.remarks}</Typography>
          <Button onClick={() => handleOpenEditEventModal(event._id)}>Edit</Button>
          <Button onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
        </div>
      ))}
      <Button variant="contained" onClick={openAddEventModal}>
        Add Event
      </Button>
      
      {(addEventModal || selectedEvent != null) && 
        <EditEventModal 
            open = {addEventModal || openEditEventModal}
            onClose={addEventModal ? closeAddEventModal : handleCloseEditEventModal}
            onSubmit={addEventModal ? handleSubmitEvent : handleUpdateEvent}
            eventId={selectedEvent}
            type = {addEventModal ? CREATE_NEW_EVENT : UPDATE_EXISTING_EVENT}
        />
      } 
    </Box>
  );
}
const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(StockEvents);
