import { combineReducers } from "redux";

import auth from "./auth"
import snackbar from "./snackbar"
import user from './user'

export const reducers = combineReducers({auth, snackbar, user})