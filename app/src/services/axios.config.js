import axios from "axios";
import cookie from "react-cookies";

let token = cookie.load("exo_token")


axios.defaults.baseURL = process.env.REACT_APP_API_URL


// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.defaults.headers = {
  'Content-Type': 'application/json',
  'authorization': token ? `Token ${token}` : null
}


export default axios;
