import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { FacebookSelector, FacebookCounter } from "@charkour/react-reactions";
import { setReadableTime } from "../utils/computeDate";
import {  AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BiCommentDetail } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { connect } from 'react-redux';
import GifIcon from '@mui/icons-material/Gif';
import { BsEmojiSmile, BsCamera } from "react-icons/bs";
import { BiSticker } from "react-icons/bi";
import PostComments from "./PostComments";
import PostMenu from "./PostMenuProfile";
import Comments from "./comments.json";
import CommentSection from "./CommentSection";
import { feedAPI } from "../services/feed/feed.service";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import ClipLoader from "react-spinners/ClipLoader";
import { likeSelectedPost, getFeed, deleteLike, fetchProfileBatch } from "../redux/actionDispatch";
import { IoNewspaperOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import { displayComments } from "./displayComments";


const ProfileDisplay = (props) => {
  const [commentPopup, setCommentPopup] = useState(false);
  const [comments, setComment] = useState({
    post: null,
    comment: ""
  })
  const [loadLike, setLoadLike] = useState(false);
  const textareaRef = useRef(null);
  const [menu, setMenu] = useState(null);
  const [commentQuery, setCommentQuery] = useState(null);
  const [warmComments, setWarmComments] = useState(false);
  const [commentList, setCommentList] = useState([])
  const [feed, setFeed] = useState([])
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);




  useLayoutEffect(()=>{
    if(Object.values(props.profile).length){
      feedAPI.getProfilePosts(props.profile.pk).then(resp=>{
        setFeed(resp.results);
        setNext(resp.next)
        setPrevious(resp.previous)
      }).catch(error=> console.log(error))
    }
  },[props.profile])


  const handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const openPostMenu = (event) => {
    let post_id = parseInt(event.currentTarget.getAttribute("id"));
    console.log(post_id);
    return menu === post_id ? setMenu(null) : setMenu(post_id);
  }


  const createComment = (event, id) => {
    console.log(event.currentTarget.selectionStart)
    let heightLimit = 200;
    event.currentTarget.style.height = "";
    event.currentTarget.style.height = Math.min(event.currentTarget.scrollHeight, heightLimit) + "px";
    setComment({
      post: id,
      comment: event.currentTarget.value
    })
  }

  const postComment = event => {
    event.preventDefault();
    console.log(comments);
  }

  const submitComment = event => {
    event.preventDefault();
    if(comments.comment.length){
      feedAPI.postComments(comments).then(resp=> {
        console.log(resp);
        setCommentQuery(resp.post)
        setCommentList([...commentList, resp])
      }).catch(err=> console.log(err))
    } else {
      console.log("comment cannot be empty!");
    }
  }

  const loadComments = id => {
    setCommentQuery(id);
    setWarmComments(true)
    feedAPI.fetchComments(parseInt(id)).then(resp=> {
      setCommentList(resp);
      setWarmComments(false);
    }).catch(err=> console.log(err));
  }



  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const handleLike = post => {
    setLoadLike(true)
    if(post.i_liked == false){
      props.likeSelectedPost(parseInt(post.id)).then(resp=>{
        setLoadLike(false)
        let new_feed = feed;
        let liked_feed = feed.find(item=> item.id === post.id)
        let indx = feed.findIndex(item=> item.id === post.id)
        liked_feed.likes += 1;
        liked_feed.i_liked = true;
        new_feed.splice(indx, 1, liked_feed)
      }).catch(error=> setLoadLike(false));
    } else {
      props.deleteLike(parseInt(post.id)).then(resp=>{
        setLoadLike(false)
        let new_feed = feed;
        let liked_feed = feed.find(item=> item.id === post.id)
        let indx = feed.findIndex(item=> item.id === post.id)
        liked_feed.likes -= 1;
        liked_feed.i_liked = false;
        new_feed.splice(indx, 1, liked_feed)
      }).catch(err=>setLoadLike(false))
    }

  }

  let handlePostUpdate = (data) => {
    let my_feed = feed;
    let indx = my_feed.findIndex(item=> item.id === data.id)
    my_feed.splice(indx, 1, data)
    setFeed(my_feed);
  }

  let handlePostDelete = id => {
    let my_feed = feed;
    let indx = my_feed.findIndex(item=> item.id === id);
    my_feed.splice(indx, 1)
    setFeed(my_feed);
  }

  let closePostMenu = () => setMenu(null);

  const showFullPost = event => setCommentPopup(true);

  const displayMedia = media => {

    let data = media.slice(0, 3).map((item, index, array)=> {
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
          <img loading="lazy" className={array.length === 1 ? "post_single" : "post_media"} src={item.file} alt="post_media" />
        </div>
      )
    });
    return data;
  }

  const displayTagged = tag => {
    console.log(tag)
    let data = tag.map((user, index, array)=>{
      if(index < array.length -2){
        return <b key={user.pk}>{user.user.username}, </b>;
      } else if(index == array.length - 2){
        return <b key={user.pk}>{user.user.username} and </b>
      } else if(index == array.length - 1){
        return <b key={user.pk}>{user.user.username}</b>
      }
    })
    return data
  }


  window.onscroll = debounce(()=>{
    let measuredHeight = Math.floor(window.innerHeight + document.documentElement.scrollTop);

    if(Math.ceil(measuredHeight) === document.documentElement.scrollHeight && next){
      props.fetchProfileBatch(next).then(resp=>{
        setFeed([...feed, ...resp.results])
        setNext(resp.next)
        setPrevious(resp.previous)
      })
    }
  }, 100)

  let data = feed.length ? feed.map(item=> {
    return (
      <div key={item.pk} className="postCard">
        {item.tag.length && item.tag.find(user=> user.user.pk === props.user.pk) ?
          <div style={{ borderBottom:"1px solid #e6ecf5", padding:"5px 15px", marginBottom:"20px" }}>
            <span>You were tagged by <Link to={{ pathname: `/${item.author.username}-${item.author.pk}` }}>{item.author.first_name} {item.author.last_name}</Link></span>
          </div>: null}
        <div className="topSection">
          <span>
            <Avatar loading="lazy" src={item.author.avatar} size={40} alt="profile-image" />
              <span className="postOwner">
                <span style={{ color:"#00000" }}>
                <Link to={{
                  pathname: `/${item.author.username}-${item.author.pk}`
                }} style={{ fontSize:"14px", fontWeight:"bold", color:"darkslateblue" }} >
                  {item.author.first_name} {item.author.last_name}
                </Link>
                {item.tag.length ? <span style={{ fontSize: "14px", color:"#00000 !important" }}> is with {displayTagged(item.tag)}</span>: null}
                </span>
                <span>{setReadableTime(item.pub_date)}</span>
              </span>
          </span>
          <span className="menuExpanding">
            {props.user.pk === item.author.pk ? <span className="expand" id={item.id} onClick={openPostMenu}>&#8230;</span>: null}
            <div className={menu === item.id ? "postMenuCard" : "hidePostMenu"}><PostMenu deletePost={handlePostDelete} updatePost={handlePostUpdate} post={item} closeMenu={closePostMenu} /></div>
          </span>
        </div>
        <div className="postContent">
          <p>{item.post}</p>
          <div className={item.posted_photos && item.posted_photos.length % 2 !== 0 && item.posted_photos.length >= 3 ? "gallery detector" : "gallery"}>
            {item.posted_photos && displayMedia(item.posted_photos)}
          </div>
        </div>
        {/* <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 20px" }}>
          <FacebookCounter />
          <div>
            <span onClick={()=>loadComments(item.id)} className="commentCount" style={{ padding:"0 7px" }}>{item.comment_count ? item.comment_count + " comments" : null}</span>
            <span className="shareCount">3 shares</span>
          </div>
        </div> */}
        <div className="postActions">
          <div className="leftAction">
            <span aria-pressed={false} onClick={()=>handleLike(item)} className="like">
              {item.i_liked === true ? <AiFillHeart style={{ color:"#ff5e3a", fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }}/> : <AiOutlineHeart style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }} />}
              {item.likes}
              <span className="likeTooltip">Like</span>
            </span>
          </div>
          <div className="rightActions">
            <span className="postIcons">
              <BiCommentDetail style={{ fontSize:"21px", verticalAlign:"middle", marginRight:0 }}/>
                <span style={{ fontSize: "16px" }}>{displayComments(item)}</span>
            </span>
              <span className="postIcons">
              <IoIosShareAlt style={{ fontSize:"21px", verticalAlign:"middle", marginRight:0 }}/>
                <span style={{ fontSize: "16px" }}>Share</span>
              </span>
          </div>
        </div>
        {/* <form onSubmit={postComment} className="commentSection">
          <img src={props.user.avatar} alt="profile_photo" style={{ width: "40px", height:"40px", borderRadius:"50%" }}/>
          <div className="textareaWrap">
            <textarea ref={textareaRef} className="commentSections" onInput={(event)=>createComment(event, item.id)} cols={60} rows={8} placeholder="Write a comment..." name="comment">
            </textarea>
          </div>
          <Fab onClick={submitComment} style={{ marginLeft:"15px" }} size="small" color="secondary" aria-label="save">
            <SendIcon />
          </Fab>
        </form> */}
        {commentQuery === item.id ? (
          <div className="commentArea">
            <h3>Comments</h3>
            <ul className="commentList">
              {!warmComments ? <CommentSection comments={commentList}/> : <div style={{ display:"flex", justifyContent:"center", padding:"10px 0" }}><ClipLoader loading={warmComments} /></div>}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }) : (
    <div className="noFeedText">
        {props.user.pk === props.profile.pk ? <h3>No item on your feed. Create your first post</h3> : <h3>This profile page does not have any posts</h3>}
        <IoNewspaperOutline style={{ fontSize:"30px" }}/>
    </div>
  );
  return data;
}


const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps = {
  likeSelectedPost,
  deleteLike,
  fetchProfileBatch
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDisplay);
