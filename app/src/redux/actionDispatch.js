import { accountsApi } from "../services/accounts/accounts.service";
import { feedAPI } from "../services/feed/feed.service";
import {
  setUserCredentials,
  setFeeds,
  addFeed
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
      if(response) dispatch(setFeeds(response))
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



