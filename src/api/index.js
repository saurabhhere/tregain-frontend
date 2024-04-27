import axios from "axios";
// import { createBrowserHistory } from "history";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const BASE_URL = development ? "http://localhost:5000" : "" 

// const customHistory = createBrowserHistory();

export const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    const store = JSON.parse(localStorage.getItem("user_info"));
    const formUrls = [] // send as  form
    const sendAsFormData = formUrls.some(str => config.url.includes(str));

    if(sendAsFormData) {
      config.headers["Content-Type"] = 'multipart/form-data';
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers["Accept"] = "application/json";
    config.headers["Access-Control-Allow-Credentials"] = "true";

    if (store) {
      config.headers["x-auth-token"] = store.token;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Use router.push() to navigate to the login screen
    //   customHistory.push("/login"); // Adjust the route as needed
      // Throw an exception to stop further execution
      return Promise.reject("Unauthorized");
    }
    // Handle other errors here
    return Promise.reject(error);
  }
);