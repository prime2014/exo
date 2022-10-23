import axios from "axios";
import cookie from "react-cookies";
import { store } from "../../redux/store";

let baseURL= process.env.REACT_APP_API_URL




const uploadPostMedia = async content => {
  try{
     let media = null;
     let response = await axios.post(baseURL + "/feeds/api/media/", { content });
     if (response) media = response;
     return response;
  } catch(error){
    return error;
  }
}


const fetchFeed = async () => {
  try {
    let feed = null;
    let response = await axios.get(baseURL + `/feeds/api/v1/feeds/`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) feed = response.data;
    return feed;
  } catch(error) {
    return error;
  }
}


const likePost = async post => {
  try {
    let like = null;
    let response = await axios.post(baseURL + `/feeds/api/v1/post/likes/`, { post }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) like = response.data;
    return like;
  } catch(error) {
    return error;
  }
}

const deletePostLike = async post_id => {

  try {
    let result = null;
    let response = await axios.post(baseURL + `/feeds/api/v1/post/likes/delete_like/`, { post_id }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response.status === 204) result = response.status;
    return result;
  } catch(error){
    return error;
  }
}

const postFeed = async post => {
  try {
    let news = null;
    let response = await axios.post(baseURL + "/feeds/api/v1/feeds/write/", { ...post }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      },
      // timeout: 10000,
      // timeoutErrorMessage: "The server failed to respond in time. Please try again"
    });
    if(response) news = response.data;
    return news;
  } catch(error){
    return error;
  }
}


const fetchNextFeed = async url => {
  try {
    let feed = null;
    let response = await axios.get(url, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) feed = response.data;
    return feed;
  } catch(error){
    return error;
  }
}

const getProfilePosts = async id => {
  try {
    let posts = null;
    let response = await axios.get(baseURL + `/feeds/api/v1/feeds/?author=${id}`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response) posts = response.data;
    return posts;
  } catch(error){
    return error;
  }
}


const postComments = async (comment_data) => {
  try {
    let comment = null;
    let response = await axios.post(baseURL + "/feeds/api/v1/post/comments/", { ...comment_data }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) comment = response.data;
    return comment;
  } catch(error) {
    return error;
  }
}

const fetchComments = async post_id => {
  try {
    let comments = null;
    let response = await axios.get(baseURL + `/feeds/api/v1/post/comments/?post=${post_id}`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) comments = response.data;
    return comments;
  } catch(error){
    return error;
  }
}

const updatePostStatus = async post => {
  try {
    let status = null;
    let response = await axios.patch(baseURL + `/feeds/api/v1/feeds/${post.id}/`, { ...post }, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response) status = response.data;
    return status;
  } catch(error) {
    return error;
  }
}

const deletePost = async id => {
  try {
    let status = null;
    let response = await axios.delete(baseURL + `/feeds/api/v1/feeds/${id}/`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if (response) status = response.status;
    return status;
  } catch(error){
    return error;
  }
}


const editComment = async comment => {
  try {
    let c = null;
    let response = await axios.put(baseURL + `/feeds/api/v1/post/comments/${comment.id}/`, comment, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response) c = response.data;
    return c;
  } catch(error){
    return error;
  }
}

const deleteComment = async id => {
  try {
    let c = null;
    let response = await axios.delete(baseURL + `/feeds/api/v1/post/comments/${id}/`, {
      headers: {
        "content-type": "application/json",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    });
    if(response) c = response.status;
    return c;
  } catch(error){
    return error;
  }
}




export const feedAPI = {
  updatePostStatus,
  deletePost,
  uploadPostMedia,
  fetchFeed,
  postFeed,
  fetchNextFeed,
  getProfilePosts,
  postComments,
  fetchComments,
  likePost,
  deletePostLike,
  editComment,
  deleteComment
}
