import { API } from ".";

export const getAllStocks = () => API.get(`/stock/all`);

export const addNewStock = (data) => API.post('/stock/create', data)

export const deleteStock = (id) => API.delete(`/stock/delete/${id}`)