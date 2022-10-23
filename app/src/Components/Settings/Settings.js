import React, { useState, useEffect, useLayoutEffect } from "react";
import { Layout } from "antd";
import Navbar from "../../Common/Navbar";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { updatemyProfile } from "../../redux/actionDispatch";
import toast, { Toaster } from "react-hot-toast";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { accountsApi } from "../../services/accounts/accounts.service";
import { useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';



const DeleteAccountDialog = (props) => {
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()

  const closeModal = () => props.close()

  const deleteAccount = () => {
    setLoader(true)
    toast.promise(accountsApi.deleteAccount(props.user.pk), {
      loading: "Deleting your account...",
      success: (data) => {
        setLoader(false)
        closeModal()
        localStorage.clear()
        navigate("/")
        return "Successfully deleted your account"
      },
      error: error => {
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
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <WarningAmberIcon style={{ color:"goldenrod", fontSize: 120 }}/>
          </div>
          <p style={{ padding:"0 10px", fontFamily:"Roboto", fontSize:"16px" }}></p>Are you sure you want to delete your account. Note that this operation cannot be undone
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} label="Cancel" icon="pi pi-trash" iconPos="left" />
        <Button loading={loader} loadingIcon="pi pi-spin" onClick={deleteAccount} style={{ backgroundColor:"crimson", color:"white" }} label="Delete" icon="pi pi-user-minus" iconPos="left" />
      </DialogActions>
    </Dialog>
  )
}


const Settings = props => {

  const [credentials, setCredentials] = useState({
    first_name:"",
    last_name: "",
    avatar: "",
    username: "",
    email: ""
  })
  const [loader, setLoader] = useState(false)
  const [visible, setVisible] = useState(false)
  const matches = useMediaQuery('(max-width:500px)');


  useLayoutEffect(()=>{
    setCredentials({
      first_name: props.user.first_name,
      last_name: props.user.last_name,
      avatar: props.user.avatar,
      username: props.user.username,
      email: props.user.email
    })
  },[props])


  const updateProfile = event => {

    event.preventDefault();
    setLoader(true)
    toast.promise(props.updatemyProfile(credentials, props.user.pk), {
      loading: "Updating your credentials...",
      success: (data)=>{
        setLoader(false)
        return "Successfully updated your account details"
      },
      error: (error)=> {
        setLoader(false)
        return "There was a problem processing your request!"
      }
    }, {
      style: {
        borderRadius: "10px",
        color:"#fff",
        background:"#3bd4d4"
      }
    })

  }

  const handleClose = event => setVisible(false);
  const openDeleteModal = event => setVisible(true);

  const handleFirstname = event => setCredentials({ ...credentials, first_name:event.target.value })
  const handleLastname = event => setCredentials({ ...credentials, last_name:event.target.value })
  const handleEmail = event => setCredentials({ ...credentials, email:event.target.value })
  const handleUsername = event => setCredentials({ ...credentials, username:event.target.value })



  const { Content, Sider } = Layout;

  return (
      <Navbar>
        <Toaster />
        <DeleteAccountDialog {...props} visible={visible} close={handleClose}/>
        <Layout>
        {!matches ? <Sider width={350} className="settings_layout">
            <div className="img-wrapped">
              <img src={props.user.avatar} className="profile_image_settings" alt="profile_image"/>
              <p style={{ textAlign:"center", fontSize:23, fontWeight:"bold" }}>{props.user.first_name} {props.user.last_name}</p>
            </div>
        </Sider> : null}
        <Content>
          <div style={{ padding:"30px 40px" }}>
             <h1 style={{ fontFamily:"Roboto", fontSize:28 }}>Account Settings</h1>
          </div>
          <form style={{ padding:"0 40px" }} onSubmit={updateProfile}>
            <div className="input-templates">
                <div>
                  <label>First Name</label>
                  <input onChange={handleFirstname} type="text" name="first_name" value={credentials.first_name} />
                </div>
                <div>
                  <label>Last Name</label>
                  <input onChange={handleLastname} type="text" name="last_name" value={credentials.last_name} />
                </div>
            </div>
            <div className="input-templates">
                <div>
                  <label>Email</label>
                  <input onChange={handleEmail} type="email" name="email" value={credentials.email} />
                </div>
                <div>
                  <label>Username</label>
                  <input onChange={handleUsername} type="text" name="username" value={credentials.username} />
                </div>
            </div>
            <div>
              <Button loading={loader} loadingIcon="pi pi-spin" label="Update" icon="pi pi-user-edit" iconPos="left"/>
            </div>
          </form>
          <div style={{ padding:"30px 40px", fontFamily:"Roboto" }}>
            <h1>DELETE ACCOUNT</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
            </p>
            <Button onClick={openDeleteModal} label="Delete Account" icon="pi pi-trash" iconPos="left" style={{ backgroundColor:"crimson", color:"white" }}/>
          </div>
        </Content>
        </Layout>
      </Navbar>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps = {
  updatemyProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
