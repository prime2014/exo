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


export const setNotifications = (payload) => {
  return {
      type: actionTypes.GET_NOTIFICATIONS,
      payload
  }
}

export const setNotificationsUnreadCount = payload => {
  return {
      type: actionTypes.UNREAD_COUNT,
      payload
  }
}

export const likePost = payload => {
  return {
     type: actionTypes.LIKE_POST,
     payload
  }
}

export const updateUserProfile = payload => {
  return {
    type: actionTypes.UPDATE_PROFILE,
    payload
  }
}


export const unlikePost = payload => {
  return {
    type: actionTypes.UNLIKE_POST,
    payload
  }
}

export const uploadProfile = payload => {
  return {
    type: actionTypes.UPLOAD_PROFILE_IMAGE,
    payload
  }
}

export const deleteSelectedComment = post_id => {
  return {
    type: actionTypes.DELETE_COMMENT,
    payload: post_id
  }
}


export const markAsRead = payload => {
  return {
    type: actionTypes.MARK_AS_READ,
    payload
  }
}

export const addUserFriend = payload => {
  return {
    type: actionTypes.ADD_FRIEND,
    payload
  }
}


export const increaseCommentCount = payload => {
  return {
    type: actionTypes.INCREASE_COMMENT_COUNT,
    payload
  }
}


export const logoutUser = () =>{
  return {
    type: actionTypes.LOGOUT_USER
  }
}


export const clearFeed = () => {
  return {
    type: actionTypes.CLEAR_FEED
  }
}

export const clearNotifications = () => {
  return {
    type: actionTypes.CLEAR_NOTIFICATIONS
  }
}
