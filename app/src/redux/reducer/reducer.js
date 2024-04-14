import * as actionTypes from "../actionTypes";



export const userReducer = (
  state={
    user: {},
    token:""
  },
  action
)=>{
    switch(action.type){
      case actionTypes.SET_USER_CREDENTIALS:
        let new_user = Object.assign({}, state.user, action.payload.user);
        state = {
          ...state,
          token: action.payload.token,
          user: new_user
        }
        return state;
      case actionTypes.LOGOUT_USER:
        state = {}
        return state;
      case actionTypes.UPDATE_PROFILE:
        state = {
          ...state,
          user: { ...action.payload }
        }
        return state;
      case actionTypes.UPLOAD_PROFILE_IMAGE:
        let my_user = state.user;
        my_user.avatar = action.payload.avatar;
        state = {
          ...state,
          user: my_user
        }
        return state;
      case actionTypes.ADD_FRIEND:
        let sc_user = state.user;
        let meta = sc_user.meta;
        let requests = meta.requests;
        let bindx = requests.findIndex(item=> item === action.payload)
        requests.splice(bindx, 1)
        meta.requests = requests;
        sc_user.meta = meta;
        state = {
          ...state,
          user: sc_user
        }
        return state;
      default:
        return state;
    }
}


export const feedReducer = (
  state = {
    feed: [],
    count:0,
    next: "",
    previous: ""
  },
  action
) => {
    switch(action.type){
      case actionTypes.CLEAR_FEED:
        state = {
          feed: [],
          count: 0,
          next: "",
          previous: ""
        }
        return state;
      case actionTypes.FETCH_FEED:
        state = {
          ...state,
          feed: [...action.payload.results],
          next: action.payload.next,
          previous: action.payload.previous
        }
        return state;
      case actionTypes.ADD_NEXT_FEED:
        state = {
          ...state,
          feed: [...state.feed, ...action.payload.results],
          next: action.payload.next,
          previous: action.payload.previous
        }
        return state;
      case actionTypes.ADD_POST_CONTENT:
        state = {
          ...state,
          feed: [action.payload, ...state.feed]
        }
        return state;
      case actionTypes.INCREASE_COMMENT_COUNT:
        let myposts = state.feed;
        let post_to_update = myposts.find(item=> item.id === action.payload)
        let myindx = myposts.findIndex(item=> item.id === action.payload)
        post_to_update.comments += 1;
        myposts.splice(myindx, 1, post_to_update)
        state = {
          ...state,
          feed: myposts
        }
        return state;
      case actionTypes.EDIT_POST:
        let posts = state.feed;
        let ids = posts.findIndex(item=> item.id === action.payload.id)
        posts.splice(ids, 1, action.payload)
        state = {
          ...state,
          feed: posts
        }
        return state;
      case actionTypes.DELETE_POST:
        let sposts = state.feed;
        let index = sposts.findIndex(item=> item.id === action.payload)
        sposts.splice(index, 1)
        state = {
          ...state,
          feed: sposts
        }
        return state;
      case actionTypes.LIKE_POST:
        let my_posts = state.feed;
        let pst = my_posts.find(item=>item.id === action.payload.post)
        let indx = my_posts.findIndex(item=>item.id === action.payload.post)
        pst.i_liked = true;
        pst.likes += 1;
        // console.log(pst)
        my_posts.splice(indx, 1, pst)
        state = {
          ...state,
          feed: my_posts
        }
        return state;
      case actionTypes.UNLIKE_POST:
        let current_feed = state.feed;
        let my_liked_feed = current_feed.find(item=>item.id === action.payload)
        let indic = current_feed.findIndex(item=> item.id === action.payload)
        my_liked_feed.i_liked = false;
        my_liked_feed.likes -= 1;
        current_feed.splice(indic, 1, my_liked_feed)
        state = {
          ...state,
          feed: current_feed
        }
        return state
      case actionTypes.DELETE_COMMENT:
        let common_feed = state.feed;
        let deleted = common_feed.find(item=> item.id === action.payload)
        let idxs = common_feed.findIndex(item=> item.id === action.payload)
        deleted.comments -= 1;
        console.log(deleted)
        console.log("state: ", idxs)
        common_feed.splice(idxs, 1, deleted)
        state = {
          ...state,
          feed: common_feed
        }
        return state;
      default:
        return state;
    }
}


export const notifications = (
  state={
    notifications:[],
    unread_count: 0
  },
  action
) => {
  switch(action.type){
    case actionTypes.GET_NOTIFICATIONS:
      state = {
        ...state,
        notifications: [...action.payload]
      }
      return state;

    case actionTypes.UNREAD_COUNT:
      state = {
        ...state,
        unread_count: action.payload.unread_count
      }
      return state;
    case actionTypes.MARK_AS_READ:
      let notify = state.notifications;
      let my_notification = notify.find(item=> item.id === action.payload);
      let indx = notify.findIndex(item=> item.id === action.payload);
      my_notification.unread = false;
      notify.splice(indx, 1, my_notification)
      state = {
        ...state,
        notifications: notify,
        unread_count: state.unread_count - 1
      }
      console.log(state)
      return state;
    case actionTypes.CLEAR_NOTIFICATIONS:
      state = {
        notifications: [],
        unread_count: 0
      }
      return state;
    default:
      return state;
  }
}
