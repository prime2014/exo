import React, { useState } from "react";
import { connect } from "react-redux";
import LiveCropped from "../../Images/liveCropped.jpg";
import {  Avatar } from "antd";
import { FcGallery } from "react-icons/fc";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { addPostContent } from "../../redux/actions";



const PostFeed = props => {
  const [modal, setModal] = useState(false);


  const openUploadModal = () => props.open();
  const closeUploadModal = event => setModal(false);

  return (
    <React.Fragment>
    <form encType="multipart/form-data" className="postFeedSection">
        <div className="postInput">
          <Avatar className="avatar" src={props.user.avatar} size={45} />
          <input onClick={openUploadModal} className="inputText" type="text" name="post" placeholder={`What's on your mind, ${props.user.first_name}`} />
        </div>
        <div className="postIcons">
          <div className="iconBBtns">
              <img src={LiveCropped} height={18} width={36} alt="live" />
              <span>Live Video</span>
          </div>
          <div onClick={openUploadModal} className="iconBBtns">
              <FcGallery style={{ fontSize:23 }} />
              <span>Photo/Video</span>
          </div>
          <div className="iconBBtns">
            <MdOutlineEmojiEmotions style={{ fontSize:23 }} color="goldenrod" />
            <span>Feeling/Activity</span>
          </div>

        </div>
    </form>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps = {
  addPostContent
}

export default connect(mapStateToProps, mapDispatchToProps)(PostFeed);
