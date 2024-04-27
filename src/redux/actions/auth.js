import { AUTH, HIDE_SNACKBAR, SHOW_SNACKBAR  } from "../const/actionsTypes";
import * as api from "../../api/User";

export const loadUser = () => async (dispath) => {
  const localUser = JSON.parse(localStorage.getItem("user_info"));

  if (localUser) {
    dispath({ type: AUTH, data: localUser });
  }
};

export const signin = (data2, history, setLoading) => async (dispatch) => {
  try {
    const { data } = await api.signIn(data2);
    dispatch({ type: AUTH, data });
    history.push("/cards");
    dispatch(showSnackbar("Welcome to Synclink - Your Trusted Digital Partner", "success", 2500, "top", "center"))
    setLoading(false)
  } catch (err) {
    setLoading(false)
    if (err.response) {
      dispatch(showSnackbar(err.response.data.message, "error"))
    } else {
      dispatch(showSnackbar("Something went wrong", "error"))
    }
  }
};

export const signup =
  (formData, history, setLoading, handleDefaultState) => async (dispatch) => {
    try {
      const res = await api.signUp(formData);
      dispatch(showSnackbar(res.data.message, "success"))
      setLoading(false)
      handleDefaultState()
    } catch (err) {
      if (err.response) {
        dispatch(showSnackbar(err.response.data.message, "error"))
      } else {
        dispatch(showSnackbar("Something went wrong", "error"))
      }
      setLoading(false)
    }
  };

export const forgotPassword = (data, setLoading, handleDefaultState) => async (dispatch) => {
  try {
    const res = await api.forgotPassword(data)
    dispatch(showSnackbar(res.data.message, "success"))
    setLoading(false)
    handleDefaultState()
  } catch (err) {
    if (err.response) {
      dispatch(showSnackbar(err.response.data.message, "error"))
    } else {
      dispatch(showSnackbar("Something went wrong", "error"))
    }
    setLoading(false)
  }
}

export const resetPassword = (data, history, setLoading, token) => async (dispatch) => {
  try {
    const res = await api.resetPassword(data, token)
    dispatch(showSnackbar(res.data.message, "success"))
    setLoading(false)
    history.push('/login')
  } catch (err) {
    if (err.response) {
      dispatch(showSnackbar(err.response.data.message, "error"))
    } else {
      dispatch(showSnackbar("Something went wrong", "error"))
    }
    setLoading(false)
  }
}

export const showSnackbar = (message, type, autoHideDuration = 100000, vertical = "bottom", horizontal = "center") => async (dispatch) => {
  try {
    console.log(vertical, horizontal)
    dispatch({type: SHOW_SNACKBAR, data: {message, type, autoHideDuration, vertical, horizontal}})
  } catch (err) {
    console.error(err)
  }
}

export const hideSnackbar = () => async (dispatch) => {
  try {
    dispatch({type: HIDE_SNACKBAR})
  } catch (err) {
    console.error(err)
  }
}