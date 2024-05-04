import { API } from ".";

export const signIn = (data) => API.post("/users/signin", data);

export const signUp = (data) => API.post("/users/signup", data);

export const activateAccount = (token) =>
  API.post("/users/email-activate", { token });

export const isValidToken = () => API.get("users/check-token");

// export const forgotPassword = (data) => API.post("/users/forgot-password", data)

// export const resetPassword = (data, token) => API.post(`/users/reset-password/${token}`, data)