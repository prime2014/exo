import React, { useState, useEffect } from "react";
import { Layout } from "antd"
import { IoNotifications } from "react-icons/io5";
import { getAllNotifications } from "../redux/actionDispatch";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FiBellOff } from "react-icons/fi";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { accountsApi } from "../services/accounts/accounts.service";
import toast from "react-hot-toast";
import Alert from '@mui/material/Alert';
import { addUserFriend } from "../redux/actions";




const DisplayNotifications = (props) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const closeModal = () =>{
    props.close()
  }

  const navigateToProfile = (event) => {
    event.stopPropagation()
    navigate(`/${props.content.user.username}-${props.content.user.pk}`)
  }

  const handleAddFriend = pk => {
    toast.promise(accountsApi.addFriend(pk), {
      loading: "Adding this user to your friend list...",
      success: (data)=>{
        console.log(data);
        props.addUserFriend(pk);
        closeModal()
        return "Successfully added a new friend"
      },
      error: (error)=>{
        console.log(error);
        return "There was an error processing your request"
      }
    }, {
      style: {
        borderRadius: "10px",
        color:"#fff",
        background:"#3bd4d4"
      }
    })
  }

  const declineConnectionRequest = (user, friend_pk) => {
      console.log("BEFORE: ", user)
      let logged_in_user = user;
      let my_meta = logged_in_user.meta
      let requests = logged_in_user.meta.requests;
      let indx = requests.findIndex(item=> item === friend_pk)
      requests.splice(indx, 1)
      my_meta.requests = requests;
      logged_in_user.meta = my_meta;
      let { pk, ...rest } = logged_in_user;
      rest.id = pk;
      console.log("AFTER: ", rest)
      setLoader(true)
      toast.promise(accountsApi.cancelFriendRequest(rest), {
        loading: `Deleting friend request.`,
        success: (data)=>{
          console.log(data);
          setLoader(false);
          props.addUserFriend(friend_pk)
          closeModal()
          return "Friend request was successfully deleted";
        },
        error: (error)=>{
          setLoader(false)
          return "There was a problem with this operation"
        }
      }, {
        style: {
          borderRadius: "10px",
          color:"#fff",
          background:"#3bd4d4"
        }
      })
  }

  return (
    <Dialog onClose={closeModal} open={props.visible}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <div style={{ padding:"10px 0", display:"flex", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center" }}>
                <Avatar src={Object.keys(props.content).length && props.content.user.avatar} sx={{ width: 40, height: 40 }} alt="profile" />
                <span style={{ padding:"0 5px", color:"#1a1a1d", fontSize:"14px", fontWeight:"bold" }}>{Object.keys(props.content).length && props.content.user.first_name} {Object.keys(props.content).length && props.content.user.last_name}</span>
            </div>
            <Button onClick={navigateToProfile} size="small" startIcon={<VisibilityIcon />}>
              View Profile
            </Button>
          </div>
          <p style={{ padding:"10px 0" }}>{Object.keys(props.content).length && props.content.description}</p>
          </DialogContentText>
        </DialogContent>
        {Object.keys(props.content).length && props.content.verb === "Friend Request" ?
        <DialogActions>
          {Object.keys(props.content).length && props.user.meta.requests.includes(props.content.user.pk) ?
          <>
            <Button autoFocus onClick={()=>handleAddFriend(props.content.user.pk)}>Confirm</Button>
            <Button onClick={()=> declineConnectionRequest(props.user, props.content.user.pk)}>
              Delete Request
            </Button>
          </> : <Alert severity="info">This notification is inactive. It may be due to declining the connection request,or having this user as a friend</Alert>}

        </DialogActions> : null}
    </Dialog>
  )
}



const Notifications = props => {
  const [openNotify, setOpenNotify] = useState(false)
  const { Content } = Layout;
  const [content, setContent] = useState({})
  const [visible, setVisible] = useState(false)
  const [loader, setLoader] = useState(false)

  useEffect(()=>{
     props.getAllNotifications()
  }, [])

  const markAsRead = (id) => {
    props.readNotification(id)
  }


  const openNotification = (event,item) =>  {
    event.stopPropagation()
    setContent(item)
    setVisible(true)
    if(item.unread === true){
      markAsRead(parseInt(item.id))
    }
    return;
  };

  const listNotifications = () =>{
     let user = props.notifications.map(item=>{
      if(typeof item.data == "object" && Object.keys(item?.data?.user).length) {
        item.data.user = JSON.parse(item.data.user)
      }
      return item
     })
     let data = user.map(item => {
      let username = item.description.split(" ").pop()
      console.log(item)
      return (
        <li key={item.id} onClick={(event)=>openNotification(event,item)} className="notifyTip">
          <span className="notifySpace">
            <img loading="lazy" className="notifyImg" src={item.user && item.user.avatar} width={60} height={60} alt="notify-img" />
            <span><IoNotifications className="nIcon" /></span>
          </span>
          <span style={item.unread == true ? { fontWeight: 600 } : { color: "#D5D7DA"}}>{item.description}</span>
        </li>
      )
     })

     return data;
  }


  const hideModal = () => setVisible(false);



  return (
    <Content onClick={(event)=> event.stopPropagation()} className="notificationsBar">
      <DisplayNotifications {...props} content={Object.keys(content).length && content} visible={visible} close={hideModal}/>
      <div className="notifyHeader">
        <h2>Notifications</h2>
        <span className="pi pi-ellipsis-h"></span>
      </div>
      <div className="notifyTag">
        <span>All</span>
        <span>Unread</span>
      </div>
      <div className="notifyHeader groupNew">
        <h4>New</h4>
        <span>See more</span>
      </div>
      <ul>
          {props.notifications.length ? listNotifications() : (
          <div>
              <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}><FiBellOff style={{ color:"#ccc", fontSize:60 }} /></div>
              <p style={{ color:"#ccc", textAlign:"center", fontSize:25 }}>No notifications</p>
          </div>
          )}
      </ul>
    </Content>
  );
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
    user: state.userReducer.user,
  }
}

const mapDispatchToProps = {
  getAllNotifications,
  addUserFriend
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
