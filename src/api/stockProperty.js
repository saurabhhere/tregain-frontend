import { API } from ".";

export const getStockProperty = (id) => API.get(`/stock-property/get/${id}`);

export const updateStockProperty = (id, data) => API.post(`/stock-property/update/${id}`, data)
