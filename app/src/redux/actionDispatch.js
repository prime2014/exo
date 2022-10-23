import { accountsApi } from "../services/accounts/accounts.service";
import { feedAPI } from "../services/feed/feed.service";
import { notificationsAPI } from "../services/notifications/notifications.service";
import {
  setUserCredentials,
  setFeeds,
  addFeed,
  deleteUserPost,
  setNotifications,
  setNotificationsUnreadCount,
  likePost,
  updateUserProfile,
  unlikePost,
  markAsRead
} from "./actions";


export const loginUser = credentials => {
  return async dispatch => {
    try {
        let response = await accountsApi.login(credentials);
        if (response.token) {
          dispatch(setUserCredentials(response));
          return response
        }
        throw response;
    } catch(error) {
      return error
    }
  }
}


export const registerUser = credentials => {
  return async dispatch => {
    try {
      let response = await accountsApi.registerAccount(credentials);
      if (response) return response;
    } catch(error) {
      return error;
    }
  }
}


export const getFeed = () => {
  return async dispatch => {
    try {
      let response = await feedAPI.fetchFeed();
      if(response) dispatch(setFeeds(response));
    } catch(error){
      return error;
    }
  }
}


export const fetchNextBatch = url => {
  return async dispatch => {
    try {
      let response = await feedAPI.fetchNextFeed(url);
      if (response) dispatch(addFeed(response))
    } catch(error){
      return error;
    }
  }
}

export const fetchProfileBatch = url => {
  return async dispatch => {
    try {
      let response = await feedAPI.fetchNextFeed(url);
      if (response) {
        console.log(response);
        return response;
      }
    } catch(error){
      return error;
    }
  }
}

export const deletePostStatus = id => {
  return async dispatch => {
    try {
      let response = await feedAPI.deletePost(id);
      if(response === 204) dispatch(deleteUserPost(id));
      return response;
    } catch(error){
      return error;
    }
  }
}


export const getAllNotifications = () => {
  return async dispatch => {
    try {
      let response = await notificationsAPI.getAllNotifications();
      if(response) dispatch(setNotifications(response));
      return response;
    } catch(error){
      return error;
    }
  }
}

export const getNotificationsUnreadCount = () => {
  return async dispatch => {
    try {
      let response = await notificationsAPI.unreadCount()
      if(response) dispatch(setNotificationsUnreadCount(response));
      return response;
    } catch(error){
      return error;
    }
  }
}


export const likeSelectedPost = id => {
  return async dispatch => {
    try{
      let response = await feedAPI.likePost(id);
      if(response) dispatch(likePost(response));
      return response;
    } catch(error){
      return error;
    }
  }
}


export const deleteLike = id => {
  return async dispatch =>{
    try {
      let response = await feedAPI.deletePostLike(id);
      if(response === 204) dispatch(unlikePost(id));
      return response;
    } catch(error){
      return error;
    }
  }
}


export const updatemyProfile = (credentials, id) => {
  return async dispatch => {
    try {
      let response = await accountsApi.updateProfile(credentials, id);
      if(response) dispatch(updateUserProfile(response));
      return response;
    } catch(error){
      return error;
    }
  }
}


export const markNotificationAsRead = id => {
  return async dispatch => {
    try {
      let response = await notificationsAPI.markAsReadAPI(id);
      if (response) dispatch(markAsRead(id));
      console.log(response);
      return response;
    } catch(error){
      return error;
    }
  }
}
