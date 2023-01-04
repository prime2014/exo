import React, { useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import axios from "axios";
import { store } from "../redux/store";
import { uploadProfile } from "../redux/actions";
import  toast from "react-hot-toast";
import cookie from "react-cookies";


const ProfileUpload = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [imageUpload, setImageUpload] = useState({});
  const [loader, setLoader] = useState(false)

  const imageRef = useRef()

  const handleUploadProfile = event => {
    let file_uploader = event.target.nextElementSibling;
    file_uploader.click();
  }

  const uploadProfileImage = event => {
    let formData = new FormData()
    formData.append("image", imageUpload, imageUpload.name)
    setLoader(true);
    axios.post(process.env.REACT_APP_API_URL + "/accounts/api/v1/profileimages/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "authorization": `Token ${store.getState().userReducer.token}`,
        "X-CSRFToken": cookie.load("csrftoken")
      }
    }).then(resp=>{
      setLoader(false)
      toast.success("The image was successfully uploaded")
      props.uploadProfile(resp.data)
      props.update(resp.data)
    }).catch(err=> {
      setLoader(false)
      toast.error("There was a problem uploading your profile image")
      closeModal()
    })
  }

  const displayImageContent =(event) => {
    console.log(event.target.files[0])
    setImageUpload(event.target.files[0])
    let profile_image = event.target.files[0];
    let img_element = document.createElement("img")
    img_element.src = URL.createObjectURL(profile_image);
    img_element.style.width = "200px";
    img_element.style.height = "200px";
    img_element.style.objectFit = "cover";
    img_element.style.borderRadius = "50%";
    imageRef.current.appendChild(img_element);
    img_element.onload = ()=> URL.revokeObjectURL(img_element.src);
    setDisabled(false);
    imageRef.current.style.cursor = "no-drop"
  }

  const closeModal = () => {
    setDisabled(true);
    props.close()
  }

  return (
    <React.Fragment>
    <Dialog blockScroll={true} draggable={false} header="Upload Profile Image" visible={props.visible} onHide={closeModal} breakpoints={{'960px': '75vw'}} style={{width: '50vw', minHeight:"60vh"}}>
        <div className="col-12">
          <Message style={{ width:"100%" }} severity="info" text="Uploading a new image wll preserve your old profile images in your collection" />
        </div>
        <div className="imagePad">
           <div className="profTemplate">
              <div className="profDelete" style={{ width: 200, height:200}}>
              <div ref={imageRef} onClick={handleUploadProfile} className="UploadTemplate"></div>
              <input onChange={displayImageContent} type={"file"} accept={"image/*"} style={{ width:1, height:1 }} />
              <Button loading={loader} loadingIcon="pi pi-spin" onClick={uploadProfileImage} className={disabled ? "blocked" : "normal" } disabled={disabled} style={{ display:"block", backgroundColor:"#5CB85C", margin:"10px 0" }} label={loader ? "Uploading..." : "Save"} icon="pi pi-check-circle" iconPos="left"  />
              </div>
           </div>
        </div>
    </Dialog>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => {
   return {
      user: state.userReducer.user
   }
}

const mapDispatchToProps = {
  uploadProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpload);
