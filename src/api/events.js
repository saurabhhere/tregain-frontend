import { API } from ".";

export const getStockEvents = (stockId) => API.get(`/event/stock/${stockId}`);

export const addNewEvent = (data) => API.post('/event/create', data)

export const getEventById = (eventId) => API.get(`/event/get/${eventId}`)

export const updateEventById = (eventId, data) => API.post(`/event/update/${eventId}`, data)

export const deleteEventById = (eventId) => API.delete(`/event/delete/${eventId}`)