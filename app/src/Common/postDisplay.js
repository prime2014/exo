import React, { useState } from "react";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { FacebookSelector, FacebookCounter } from "@charkour/react-reactions";
import { setReadableTime } from "../utils/computeDate";
import {  AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { connect } from 'react-redux';
import GifIcon from '@mui/icons-material/Gif';
import { BsEmojiSmile, BsCamera } from "react-icons/bs";
import { BiSticker } from "react-icons/bi";
import PostComments from "./PostComments";
import PostMenu from "./PostMenu";
import Comments from "./comments.json";
import CommentSection from "./CommentSection";

const PostDisplay = props => {
  const [commentPopup, setCommentPopup] = useState(false);
  const [comments, setComment] = useState({
    post: null,
    comment: ""
  })
  const [menu, setMenu] = useState(null)


  const handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const openPostMenu = (event) => {

    console.log(event.currentTarget)
    setMenu(event.currentTarget.id)
  }


  const createComment = (event, comment) => setComment({ ...comments, post:comment.id, comment: event.target.value });

  const postComment = event => {
    event.preventDefault();
    console.log(comments);
  }


  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const handleLike = event => {
    let target = event.currentTarget.getAttribute("aria-pressed")
    event.currentTarget.setAttribute("aria-pressed", !target);
    console.log(event.currentTarget.getAttribute("aria-pressed"))
  }

  const showFullPost = event => setCommentPopup(true);

  const displayMedia = media => {

    let data = media.map(item=> {
      if(item.file.match(/mp4/)){
        return (
          <div className="trailor" key={item.pk}>
            <video width="100%" controls={true}>
              <source src={item.file} type="video/mp4"/>
            </video>
          </div>
        )
      }
      return (
        <div  onClick={showFullPost} className="trailor hoverable" key={item.pk}>
          <img loading="lazy" className="post_media" src={item.file} alt="post_media" />
        </div>
      )
    });
    return data;
  }


  let data = props.feed.map(item=> {

    return (
      <div key={item.pk} className="postCard">
        <div className="topSection">
          <span>
            <Avatar loading="lazy" src={item.author.avatar} size={40} alt="profile-image" />
              <span className="postOwner">
                <span>
                <Link to={{
                  pathname: `/${item.author.username}-${item.author.pk}`
                }} style={{ fontSize:"14px", fontWeight:"bold", color:"darkslateblue" }} >
                  {item.author.first_name} {item.author.last_name}
                </Link>
                </span>
                <span>{setReadableTime(item.pub_date)}</span>
              </span>
          </span>
          <span className="expand">
            <span id={item.pk} style={{ display:"inline-block", margin:"0", fontSize:24, textAlign:"center", verticalAlign:"middle" }} onClick={openPostMenu}>&#8230;</span>
            {menu === item.pk && <PostMenu />}
          </span>
        </div>
        <div className="postContent">
          <p>{item.post}</p>
          <div className={item.posted_photos && item.posted_photos.length % 2 !== 0 && item.posted_photos.length >= 3 ? "gallery detector" : "gallery"}>
            {item.posted_photos && displayMedia(item.posted_photos)}
          </div>
        </div>
        <div style={{ padding:"0 20px" }}>
          <FacebookCounter />
        </div>
        <div className="postActions">
          <div className="leftAction">
            <span aria-pressed={false} onClick={handleLike} className="like">
              <span className="reactions"><FacebookSelector iconSize={24} /></span>
              <AiOutlineHeart style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }} />
              {item.likes}
              <span className="likeTooltip">Like</span>
            </span>
          </div>
          <div className="rightActions">
            <span className="postIcons">
              <BiCommentDetail style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }}/>
                0
                <span className="postTool">Comments</span>
            </span>
              <span className="postIcons">
              <IoIosShareAlt style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }}/>
              {item.share}
              <span className="postTool">Shares</span>
              </span>
          </div>
        </div>
        <form onSubmit={postComment} className="commentSection">
          <img src={props.user.avatar} alt="profile_photo" style={{ width: "40px", height:"40px", borderRadius:"50%" }}/>
          <textarea onInput={(ev) => createComment(ev, item)} cols={8} rows={8} placeholder="Write a comment..." name="comment"></textarea>
          <span className="commentIco">
            <span><BsEmojiSmile /></span>
            <span><BsCamera /></span>
            <span><GifIcon /></span>
            <span><BiSticker /></span>
          </span>
        </form>
        <div className="commentArea">
          <h3>Comments</h3>
          <ul className="commentList">
            <CommentSection comments={Comments["comments"]}/>
          </ul>
        </div>
      </div>
    )
  });
  return data;
}


const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps, null)(PostDisplay);
