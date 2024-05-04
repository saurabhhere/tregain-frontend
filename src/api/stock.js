import { API } from ".";

export const getUserStock = () => API.get(`stock/user-stocks`)

export const getAllStocks = () => API.get(`/stock/all`);

export const addNewStock = (data) => API.post('/stock/add', data)

export const deleteStock = (id) => API.delete(`/stock/delete/${id}`)