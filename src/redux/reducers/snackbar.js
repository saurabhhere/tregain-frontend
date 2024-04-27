import * as actionType from '../const/actionsTypes';

const snackbarReducer = (state = { type: null, message: null, isOpen: false, autoHideDuration: 100000, vertical: "bottom", horizontal: "center"}, action) => {
  switch (action.type) {
    case actionType.SHOW_SNACKBAR:
      return { ...state, type: action.data.type, message: action.data.message, autoHideDuration:action.data.autoHideDuration,vertical: action.data.vertical, horizontal: action.data.horizontal, isOpen: true };
    case actionType.HIDE_SNACKBAR:
        return { ...state, isOpen: false };
    default:
      return state;
  }
};

export default snackbarReducer;