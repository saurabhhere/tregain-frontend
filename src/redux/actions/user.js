import { getAllCategories } from '../../api/categories';
import { getAllStocks, getUserStock } from '../../api/stock';
import {UPDATE_ACTIVE_STOCK, UPDATE_AVAILABLE_CATEGORIES, UPDATE_AVAILABLE_STOCKS} from '../const/actionsTypes'


export const getAvailableCategories = () => async(dispatch) => {
    try {
        const { data } = await getAllCategories();
        console.log("API CALL: categories", data)
        dispatch({ type: UPDATE_AVAILABLE_CATEGORIES, data });
      } catch (err) {
        console.error("Error while getAvailableCategories")
      }
}

export const getAvailableStocks = () => async(dispatch) => {
    try {
        const { data } = await getUserStock();
        console.log("API CALL: stocks", data);
        dispatch({ type: UPDATE_AVAILABLE_STOCKS, data });
      } catch (err) {
        console.error("Error while getAvailableStocks")
      }
}

export const handleActiveStock = (stock) => async(dispatch) => {
    try {
        dispatch({ type: UPDATE_ACTIVE_STOCK, data: stock });
      } catch (err) {
        console.error("Error while handleActiveStock")
      }
}