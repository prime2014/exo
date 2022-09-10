import React, { useState } from "react";
import { setReadableTime } from "../utils/computeDate";
import { connect } from "react-redux";


const CommentSection = props => {
  const displayComments = () =>{
    if(props.comments.length) {
      return props.comments.map(comment=> {
        return (
          <li>
            <span style={{ display:"flex", alignItems:"center" }}>
                <img src={comment.author.avatar} width="35px" height="35px" style={{ borderRadius:"50%" }} alt="author" />
                <span style={{ marginLeft:"5px" }}>
                  <span>{comment.author.first_name} {comment.author.last_name}</span>
                  <span>{comment.comment}</span>
                </span>
            </span>
            {props.user.pk === comment.author.pk ? <span className="editComment">&#8230;</span> : null}
            <div style={{ padding:"0 10px" }}>
                <span style={{ fontSize:"13px", paddingRight:"10px", fontWeight:"bold", color:"#1A1A1D" }}>Like</span>
                <span style={{ fontSize:"13px", paddingRight:"10px", fontWeight:"bold", color:"#1A1A1D" }}>reply</span>
                <span style={{ fontSize:"13px", color:"#1A1A1D" }}>{setReadableTime(comment.pub_date)}</span>
            </div>
          </li>
        )
      })
    }
  }
  return (
  <React.Fragment>
    {displayComments()}
  </React.Fragment>
  )

}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps, null)(CommentSection);
