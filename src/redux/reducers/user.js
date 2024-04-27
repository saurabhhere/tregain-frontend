import * as actionType from '../const/actionsTypes';

const userReducer = (state = { availableStocks: [], availableCategories: [], activeStock: {}}, action) => {
  switch (action.type) {
    case actionType.UPDATE_AVAILABLE_STOCKS:
      return { ...state, availableStocks: action.data };
    case actionType.UPDATE_AVAILABLE_CATEGORIES:
      return { ...state, availableCategories: action.data };
      case actionType.UPDATE_ACTIVE_STOCK:
        return { ...state, activeStock: action.data };
    default:
      return state;
  }
};

export default userReducer;