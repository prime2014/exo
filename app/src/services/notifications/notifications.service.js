import axios from "axios";
import cookie from "react-cookies";
import { store } from "../../redux/store";

let baseURL= process.env.REACT_APP_API_URL

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'authorization': Object.keys(store.getState().userReducer.token).length ? `Token ${store.getState().userReducer.token}` : null
  }
})


const getAllNotifications = async () => {
  try {
      let notifications = null;
      let response = await client.get("/notifications/all/", {
        headers: {
          'Content-Type': 'application/json',
          'authorization': Object.keys(store.getState().userReducer.token).length ? `Token ${store.getState().userReducer.token}` : null
        }
      })
      if (response) notifications = response.data;
      return notifications;
  } catch(error){
    return error;
  }
}


const markAsReadAPI = async  id => {
  try {
    let result = null;
    let response = await client.get(`/notifications/mark-as-read/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': Object.keys(store.getState().userReducer.token).length ? `Token ${store.getState().userReducer.token}` : null
      }
    })
    if (response) result = response.data;
    return result;
  } catch(error) {
    return error;
  }
}

const unreadCount = async () => {
  try {
    let count = null;
    let response = await client.get("/notifications/api/unread_count/", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': Object.keys(store.getState().userReducer.token).length ? `Token ${store.getState().userReducer.token}` : null
      }
    });
    if (response) count = response.data;
    return count;
  } catch(error){
    return error;
  }
}


export const notificationsAPI = {
  getAllNotifications,
  unreadCount,
  markAsReadAPI
}
