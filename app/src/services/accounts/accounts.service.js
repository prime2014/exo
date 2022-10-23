import axios from "../axios.config";
import { store } from "../../redux/store";




let baseURL = process.env.REACT_APP_API_URL;



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
      let response = await client.post('/accounts/api/v1/auth/', { ...credentials });
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
    let response = await client.get(`/accounts/api/v1/auth/${id}/`);
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
    let response = await client.patch(`/accounts/api/v1/auth/${id}/activate_account/`, { token });
    if (response) user = response.data;
    console.log(user);
    return user
  } catch(error){
    return error;
  }
}


const getUserProfile = async id => {
   try {
    let profile = null;
    let response = await axios.get(`/accounts/api/v1/users/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Token ${store.getState().userReducer.token}`
      }
    })
    if (response) profile = response.data;
    console.log(profile)
    return profile;
   } catch (error){
      return error;
   }
}


const searchFriends = async (first_name, user_id) => {
  try {
    let friends = null;
    let response = await axios.get(`/accounts/api/v1/users/?first_name=${first_name}&realtionship__from_user__from_person__id=${user_id}`, {
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
    let response = await axios.get(`/accounts/api/v1/suggestions/${store.getState().userReducer.user.pk}/suggestions/`, {
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


const friendRequest = async (profile) => {
  try {
    let req = null;
    let response = await axios.put(`/accounts/api/v1/users/${profile.id}/request_friend/`, profile, {
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


const cancelFriendRequest = async (profile) => {
  try {
    let req = null;
    let response = await axios.patch(`/accounts/api/v1/users/${profile.id}/request_friend/`, profile, {
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

const logoutUserSession = async () => {
  try {
     let res = null;
     let response = await axios.get(`/accounts/auth/logout/`, {
      headers: {
        'Content-Type': "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
     });
     if (response) res = response.data;
     return res;
  } catch(error){
    return error;
  }
}

const addFriend = async(friend_pk)=> {
  try {
     let result = null;
     let response = await client.post('/accounts/api/v1/relationship/', {
       from_person: parseInt(store.getState().userReducer.user.pk),
       to_person: friend_pk
     }, {
      headers: {
        'Content-Type': "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
     });
     if(response) result = response.data;
     console.log(result);
     return result;
  } catch(error){
    return error;
  }
}


const unfriendUser = async to_person => {
  let from_person = store.getState().userReducer.user.pk
  let data = {
    from_person,
    to_person
  }
  try {
    let status = null;
    let response = await axios.put(`/accounts/api/v1/users/${from_person}/unfriend/`, data, {
      headers: {
        'Content-Type': "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response) status = response.data;
    return status;
  } catch(error){
    return error;
  }
}


const updateProfile = async (credentials, pk) => {
  try {
    let user = null;
    let response = await axios.put(`/accounts/api/v1/users/${pk}/`, { ...credentials }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) user = response.data;
    console.log(user);
    return user;
  } catch(error) {
    return error;
  }
}

const deleteAccount = async (pk) => {
  try {
    let status = null;
    let response = await axios.delete(`/accounts/api/v1/users/${pk}/`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) status = response.status;
    console.log(status);
    return status;
  } catch(error){
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
  friendRequest,
  logoutUserSession,
  addFriend,
  updateProfile,
  cancelFriendRequest,
  unfriendUser,
  deleteAccount
}
