import React, { useState, useEffect } from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import { FaRegBell } from "react-icons/fa"
import { BiBookmarkAlt } from "react-icons/bi";
import { BsClockHistory } from "react-icons/bs";
import { BiMessageSquareEdit } from "react-icons/bi";
import { RiDeleteBack2Line } from "react-icons/ri";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { feedAPI } from "../services/feed/feed.service";
import toast, { Toaster } from "react-hot-toast";
import { editPostContent } from "../redux/actions";
import { connect } from "react-redux";
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { deletePostStatus } from "../redux/actionDispatch";

const PostMenu = props => {
  const [visible, setVisible] = useState(false);
  const [postUpdate, setPostUpdate] = useState({
    post: "",
  })
  const [confirmDialog, setConfirmDialog] = useState(false);

  const closeModal = () => {
    setVisible(false);
    props.closeMenu();
  }
  const openModal = () => setVisible(true);

  const loadMedia = (media) => {
    return media.map(item=> {
      if(item.file.match(/mp4/)){
        return (
            <video width={180} height={100} controls={true}>
              <source src={item.file} type="video/mp4"/>
            </video>
        )
      } else {
          return (
          <div style={{ display:"flex", flexDirection:"column" }}>
            <img style={{ objectFit:"cover", borderRadius:"5px" }} loading="lazy" width={200} height={200} src={item.file} alt="post_media" />
            <Button style={{ margin:"5px auto", backgroundColor:"crimson" }} label="Delete" icon="pi pi-trash" iconPos="left" />
          </div>
        )
      }
    })
  }

  const submitUpdate = (event) => {
    let status_update = { id: props.post.id, ...postUpdate }
    toast.promise(feedAPI.updatePostStatus(status_update), {
      loading: "Updating your post...",
      success: (data)=> {
        props.editPostContent(data);
        closeModal()
        return "Post successfully updated";
      },
      error: "An error was encountered while updating your post. Please try again!"
    },
      {
          style: {
            borderRadius: "10px",
            color:"#fff",
            background:"#3bd4d4"
          }
      }
    )

  }

  const displayFooter = () => {
    return (
      <div>
        <Button label="Cancel" />
        <Button onClick={submitUpdate} label="Update" />
      </div>
    )
  }

  useEffect(()=>{
    console.log(props.post)
  },[])

  const acceptFunc = () => {}
  const rejectFunc = () => {
    setConfirmDialog(false)
  }


  const openConfirm = () => {
    setConfirmDialog(true)
  }


  const deletePost = () => {
    let { id } = props.post;
    toast.promise(props.deletePostStatus(id), {
      loading: "Deleting your post...",
      success: (data)=>{
        rejectFunc();
        closeModal();
        return "Post was successfully deleted!";
      },
      error: "There was a problem deleting the post",
    })
  }

  return (
      <React.Fragment>
      <ConfirmDialog visible={confirmDialog} onHide={()=>setConfirmDialog(false)} message="Are you sure you want to delete this post?" header="Delete Post" icon="pi pi-exclamation-triangle" accept={deletePost} reject={rejectFunc}/>
      <Toaster />
      <Dialog blockScroll={false} footer={displayFooter()} draggable={false} header="Edit Post" visible={visible} onHide={closeModal} breakpoints={{'960px': '75vw'}} style={{width: '50vw', minHeight:"60vh"}}>
          <p style={{ margin:0, padding:0, fontSize:"20px", fontWeight:"bold" }}>Post Text</p>
          <textarea defaultValue={props.post.post} onChange={(event)=> setPostUpdate({ post: event.target.value})} cols={30} rows={5} style={{ width:"98%", border:"1px solid #d4d4d4", margin:"5px", fontSize:"23px", borderRadius:"10px", outline:"3px solid #6697ff" }}/>
          <h3>Images/Videos</h3>
          {props.post.posted_photos.length ? (
            <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center", border:"1px solid #bbb", borderRadius:"10px", padding:"10px 0", flexWrap:"wrap" }}>
                {loadMedia(props.post.posted_photos)}
            </div>
          ) : null}
      </Dialog>
      <ul className="postMenu">
        <li onClick={openModal}>
          <BiMessageSquareEdit fontSize={24}/>
          <span>
             <span>Edit post</span>
             <span>Modify your post content</span>
          </span>
        </li>
        <li onClick={openConfirm}>
          <RiDeleteBack2Line fontSize={24}/>
          <span>
             <span>Delete post</span>
          </span>
        </li>
        <li>
          <BiBookmarkAlt fontSize={24}/>
          <span>
             <span>Save video</span>
             <span>Add this to your saved items</span>
          </span>
        </li>
        <li>
          <LinkIcon style={{ fontSize: 24 }}/>
          <span>
             <span>Copy link</span>
          </span>
        </li>
        <li>
          <FaRegBell  fontSize={24}/>
          <span>
             <span>Turn on notifications for this post</span>
          </span>
        </li>
        <li>
          <BsClockHistory fontSize={24} />
          <span>
             <span>Snooze Prime Omondi for 30 days</span>
             <span>Temporarily stop seeing posts</span>
          </span>
        </li>
        <li>
          <RemoveCircleOutlineIcon />
          <span>
             <span>Hide Post</span>
             <span>See fewer posts like this</span>
          </span>
        </li>
      </ul>
      </React.Fragment>
  )
}

const mapDispatchToProps = {
  editPostContent,
  deletePostStatus
}

export default connect(null, mapDispatchToProps)(PostMenu);
