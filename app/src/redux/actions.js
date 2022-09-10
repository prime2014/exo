import * as actionTypes from "./actionTypes";


export const setUserCredentials = payload => {
  return {
    type: actionTypes.SET_USER_CREDENTIALS,
    payload
  }
}

export const setFeeds = payload => {
  return {
    type: actionTypes.FETCH_FEED,
    payload
  }
}


export const addFeed = payload => {
  return {
    type: actionTypes.ADD_NEXT_FEED,
    payload
  }
}

export const addPostContent = payload => {
  return {
    type: actionTypes.ADD_POST_CONTENT,
    payload
  }
}

export const editPostContent = payload => {
  return {
    type: actionTypes.EDIT_POST,
    payload
  }
}

export const deleteUserPost = id => {
    return {
      type: actionTypes.DELETE_POST,
      payload: id
    }
}
