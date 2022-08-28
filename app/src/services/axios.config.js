import axios from "axios";
import cookie from "react-cookies";

let token = cookie.load("exo_token")

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL
} else if(process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = process.env.REACT_APP_PRODUCTION_API_URL;
}

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.defaults.headers = {
  'Content-Type': 'application/json',
  'authorization': token ? `Token ${token}` : null
}


export default axios;
