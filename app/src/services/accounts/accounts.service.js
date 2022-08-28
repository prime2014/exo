import axios from "../axios.config";
import { store } from "../../redux/store";



let baseURL = null;

if (process.env.NODE_ENV === "development") {
  baseURL = process.env.REACT_APP_API_URL;
} else if(process.env.NODE_ENV === "production"){
  baseURL = process.env.REACT_APP_PRODUCTION_API_URL;
}

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'authorization': Object.keys(store.getState().userReducer.token).length ? `Token ${store.getState().userReducer.token}` : null
  }

})


const login = async credentials => {
  try {
      let user = null;
      let response = await client.post('/accounts/auth/login/', { ...credentials });
      if (response) user = response.data;
      console.log(user);
      return user;
  } catch(error){
    console.log(error)
    return error;
  }
}

const registerAccount = async credentials => {
  try {
      let user = null;
      let response = await client.post('/accounts/api/v1/users/', { ...credentials });
      if (response) user = response.data;
      console.log(user);
      return user;
  } catch(error){
    console.log(error)
    return error;
  }
}

const searchUsers = async username => {
  try {
    let user = null;
    let response = await axios.get(`/accounts/api/v1/users/?search=${username}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'authorization': `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) user = response.data;
    return user;
  } catch(error){
    return error;
  }
}


const fetchAuthUser = async id => {
  try {
    let user = null;
    let response = await client.get(`/accounts/api/v1/users/${id}/`);
    if (response) user = response.data;
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const activateAccount = async (id, token) => {
  try {
    let user = null;
    let response = await client.patch(`/accounts/api/v1/users/${id}/activate_account/`, { token });
    if (response) user = response.data;
    console.log(user);
    return user
  } catch(error){
    return error;
  }
}


const getUserProfile = async id => {
  try {
    let user = null;
    let response = await axios.get(`/accounts/api/v1/users/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) user = response.data;
    return user;
  } catch(error){
    return error;
  }
}


const searchFriends = async (first_name, user_id) => {
  try {
    let friends = null;
    let response = await axios.get(`/accounts/api/v1/users/?first_name=${first_name}&realtionship__from_user=${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Token ${store.getState().userReducer.token}`
      }
    })
    if(response) friends = response.data;
    return friends;
  } catch(error){
    return error;
  }
}

const getUsers = async () => {
  try {
    let users = null;
    let response = await axios.get("/accounts/api/v1/users/", {
      headers: {
        'Content-Type': "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) users = response.data;
    return users;
  } catch (error) {
    return error;
  }
}


const friendRequest = async (pk) => {
  try {
    let user = store.getState().userReducer.user;
    let req = null;
    let response = await axios.post(`/accounts/api/v1/users/${user.pk}/request_friend/`, { pk }, {
      headers: {
        'Content-Type': "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) req = response.data;
    return req;
  } catch (error) {
    return error;
  }
}

export const accountsApi = {
  login,
  registerAccount,
  fetchAuthUser,
  activateAccount,
  searchUsers,
  getUserProfile,
  searchFriends,
  getUsers,
  friendRequest
}
