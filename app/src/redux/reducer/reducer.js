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
      default:
        return state;
    }
}
