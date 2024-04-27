import { API } from ".";

export const getAllCategories = () => API.get(`/category/all`);

export const addNewCategory = (data) => API.post(`/category/create`, data)