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
      default:
        return state;
    }
}
