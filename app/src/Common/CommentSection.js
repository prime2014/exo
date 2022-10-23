import React, { useState, useEffect, useRef, useCallback } from "react";
import { setReadableTime } from "../utils/computeDate";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';
import { Avatar } from "antd";
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';


const CommentSection = props => {
  const [showEdit, setShowEdit] = useState(false);
  const [loader, setLoader] = useState(false)
  const [comm, setComment] = useState({})
  const [visible, setVisible] = useState(false)

  const menu = useRef(null);
  const toast = useRef(null);

  useEffect(()=>{
    console.log(props);
  },[])

  const items = [
    {
        label: 'Options',
        items: [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                  setShowEdit(true)
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => deleteComment()
            }
        ]
    }
  ]

  const onHide = () => {
    setShowEdit(false);
  }

  const acceptFunc = () => {
    props.delete(comm)
    setVisible(false)
  }
  const rejectFunc = () => {
    setVisible(false)
  }


  const deleteComment = () => {
    setVisible(true);
  }

  const updateComments = event => {
    event.preventDefault();
    props.update(comm)
    setComment({})
    onHide()
  }

  const editMyComment = event => {
    setComment({...comm, comment: event.target.value})

  }

  const displayFooter = () => {
    return (
      <div style={{ display:"flex", flexDirection:"row-reverse" }}>
          <Button onClick={updateComments} loading={loader} loadingIcon="pi pi-spin" disabled={loader} label="Update" />
          <Button onClick={onHide} style={{ backgroundColor:"crimson", color:"white" }} label="Cancel" />
      </div>
    )
  }

  const displayMenu = (event, cmnt) => {
    setComment(cmnt)
    menu.current.toggle(event)
  }


  const displayComments = () =>{
    if(props.comments.length) {
      return props.comments.map(comment=> {
        return (
          <li>
            <span style={{ display:"flex", alignItems:"flex-start", maxWidth:"75%" }}>
                <img src={comment.author.avatar} width="35px" height="35px" style={{ borderRadius:"50%", objectFit:"cover" }} alt="author" />

                <span style={{ marginLeft:"5px" }}>
                  <span>{comment.author.first_name} {comment.author.last_name}</span>
                  <span>{comment.comment}</span>
                </span>
            </span>
            {props.user.pk === comment.author.pk ? <span onClick={(event)=> displayMenu(event, comment)} className="editComment">&#8230;</span> : null}
            <div style={{ padding:"0 10px" }}>
                <span style={{ fontSize:"13px", paddingRight:"10px", fontWeight:"bold", color:"#1A1A1D" }}>Like</span>
                <span style={{ fontSize:"13px", paddingRight:"10px", fontWeight:"bold", color:"#1A1A1D" }}>reply</span>
                <span style={{ fontSize:"13px", color:"#1A1A1D" }}>{setReadableTime(comment.pub_date)}</span>
            </div>
          </li>
        )
      })
    }
    return null;
  }
  return (
  <React.Fragment>
    <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to delete this comment?"
    header="Delete Comment" icon="pi pi-exclamation-triangle" accept={acceptFunc} reject={rejectFunc} />
    {showEdit ? <Dialog header="Edit Comment" visible={showEdit} style={{ width: '50vw' }} footer={displayFooter()} onHide={onHide}>
      <div style={{ display:"flex", alignItems:"center", margin:"10px 0" }}>
          <Avatar src={comm.author.avatar} size={40} alt="profile" />
          <span style={{ padding:"0 5px", fontFamily:"Roboto", fontSize:"14px" }}>{comm.author.first_name} {comm.author.last_name}</span>
      </div>
      <InputTextarea style={{ width:"100%" }} rows={5} cols={30} value={comm.comment} onChange={(e) => editMyComment(e)} />
    </Dialog> : null}
    <Toast ref={toast}></Toast>
    <Menu model={items} popup ref={menu} id="popup_menu" />
    {displayComments()}
  </React.Fragment>
  )

}


CommentSection.propTypes = {
  comments: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps, null)(CommentSection);
