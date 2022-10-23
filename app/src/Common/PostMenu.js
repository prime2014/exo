import React, { useState, useRef } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { RiDeleteBack2Line } from "react-icons/ri";
import { Button } from "primereact/button";
import { feedAPI } from "../services/feed/feed.service";
import toast from "react-hot-toast";
import { editPostContent } from "../redux/actions";
import { connect } from "react-redux";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { deletePostStatus } from "../redux/actionDispatch";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const PostMenu = props => {
  const [visible, setVisible] = useState(false);
  const [postUpdate, setPostUpdate] = useState({
    post: "",
  })
  const [confirmDialog, setConfirmDialog] = useState(false);
  const textareaRef = useRef(null);
  const exitButton = useRef(null);
  const editButton = useRef(null);
  const textRef = useRef(null);
  const [loader,setLoader] = useState(false);

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
          </div>
        )
      }
    })
  }

  const submitUpdate = (event) => {
    let status_update = { id: props.post.id, ...postUpdate }
    setLoader(true)
    toast.promise(feedAPI.updatePostStatus(status_update), {
      loading: "Updating your post...",
      success: (data)=> {
        props.editPostContent(data);
        setLoader(false)
        setTimeout(()=>{
          closeModal()
        },300)
        return "Post successfully updated";
      },
      error:(error)=> {
        setLoader(false);
        return "An error was encountered while updating your post. Please try again!"
      }
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
        console.log(data)
        rejectFunc();
        closeModal();
        return "Post was successfully deleted!";
      },
      error: "There was a problem deleting the post",
    })
  }

  const editPost = event => {
    textareaRef.current.style.display = "block";
    textareaRef.current.style.width = "auto";
    editButton.current.style.display = "none";
    textRef.current.style.display = "none";
    exitButton.current.style.display = "block";
  }

  const cancelEdit = event => {
    textareaRef.current.style.display = "none";
    editButton.current.style.display = "block";
    textRef.current.style.display = "block";
    exitButton.current.style.display = "none";
  }

  return (
      <React.Fragment>
      <ConfirmDialog visible={confirmDialog} onHide={()=>setConfirmDialog(false)} message="Are you sure you want to delete this post?" header="Delete Post" icon="pi pi-exclamation-triangle" accept={deletePost} reject={rejectFunc}/>
      <Dialog onClose={closeModal} open={visible} maxWidth={"sm"} fullWidth={true}>
      <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p ref={textRef} style={{ fontFamily:"Roboto", fontSize:"18px", color:"#888DA8" }}>{props.post.post}</p>
              <div style={{ width:"80%" }}>
                <textarea ref={textareaRef} defaultValue={props.post.post} onChange={(event)=> setPostUpdate({ post: event.target.value})} cols={30} rows={5} style={{ border:"1px solid #d4d4d4", margin:"5px", fontSize:"18px", borderRadius:"10px", outline:"3px solid #6697ff", color:"#888DA8", display:"none" }}/>
              </div>
            </div>
            <div>
              <Button onClick={editPost} ref={editButton} className="p-button-raised p-button-rounded p-button-outlined p-button-success" icon="pi pi-pencil" iconPos="left" />
              <Button onClick={cancelEdit} style={{ display: "none" }} ref={exitButton} className="p-button-raised p-button-rounded p-button-danger p-button-outlined" icon="pi pi-times" iconPos="left" />
            </div>
          </div>
          <h3 style={{ marginTop:"20px" }}>Media</h3>
          {props.post.posted_photos.length ? (
            <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center", border:"1px solid #bbb", borderRadius:"10px", padding:"10px 0", flexWrap:"wrap" }}>
                {loadMedia(props.post.posted_photos)}
            </div>
          ) : (
            <div style={{ display:"flex", padding:"20px 0", flexDirection:"column", justifyContent:"center", alignItems:"center", border:"1px solid #ccc", borderRadius:"5px" }}>
              <span className="pi pi-folder-open" style={{ fontSize:"40px", color:"#ccc" }}></span>
              <span style={{ fontSize:"18px", color:"#ccc" }}>No media content</span>
            </div>
          )}
          <DialogActions>
          <div>
            <Button disbaled={loader} onClick={closeModal} className="p-button-danger" label="Cancel" />
            <Button loading={loader} loadingIcon="pi pi-spin" onClick={submitUpdate} label="Update" />
          </div>
          </DialogActions>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* <Dialog blockScroll={false} footer={displayFooter()} draggable={false} header="Edit Post" visible={visible} onHide={closeModal} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '600px', minHeight:"60vh"}}>
          <p style={{ margin:0, padding:0, fontSize:"20px"  }}>Post</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p ref={textRef} style={{ fontFamily:"Roboto", fontSize:"18px", color:"#888DA8" }}>{props.post.post}</p>
              <div style={{ width:"80%" }}>
                <textarea ref={textareaRef} defaultValue={props.post.post} onChange={(event)=> setPostUpdate({ post: event.target.value})} cols={30} rows={5} style={{ border:"1px solid #d4d4d4", margin:"5px", fontSize:"18px", borderRadius:"10px", outline:"3px solid #6697ff", color:"#888DA8", display:"none" }}/>
              </div>

            </div>
            <div>
              <Button onClick={editPost} ref={editButton} className="p-button-raised p-button-rounded p-button-outlined p-button-success" icon="pi pi-pencil" iconPos="left" />
              <Button onClick={cancelEdit} style={{ display: "none" }} ref={exitButton} className="p-button-raised p-button-rounded p-button-danger p-button-outlined" icon="pi pi-times" iconPos="left" />
            </div>
          </div>
          <h3 style={{ marginTop:"20px" }}>Media</h3>
          {props.post.posted_photos.length ? (
            <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center", border:"1px solid #bbb", borderRadius:"10px", padding:"10px 0", flexWrap:"wrap" }}>
                {loadMedia(props.post.posted_photos)}
            </div>
          ) : (
            <div style={{ display:"flex", padding:"20px 0", flexDirection:"column", justifyContent:"center", alignItems:"center", border:"1px solid #ccc", borderRadius:"5px" }}>
              <span className="pi pi-folder-open" style={{ fontSize:"40px", color:"#ccc" }}></span>
              <span style={{ fontSize:"18px", color:"#ccc" }}>No media content</span>
            </div>
          )}
      </Dialog> */}
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

      </ul>
      </React.Fragment>
  )
}

const mapDispatchToProps = {
  editPostContent,
  deletePostStatus
}

export default connect(null, mapDispatchToProps)(PostMenu);
