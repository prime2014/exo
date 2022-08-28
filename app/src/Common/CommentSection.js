import React, { useState } from "react";



const CommentSection = props => {
  const displayComments = () =>{
    if(props.comments.length) {
      return props.comments.map(comment=> {
        return (
          <li>
            <img src={comment.author.avatar} width="35px" height="35px" style={{ borderRadius:"50%" }} alt="author" />
            <span>
              <span>{comment.author.first_name} {comment.author.last_name}</span>
              <span>{comment.comment}</span>
            </span>
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

export default CommentSection;
