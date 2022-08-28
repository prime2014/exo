import React, { useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';



const ProfileUpload = (props) => {
  const [disabled, setDisabled] = useState(true);

  const imageRef = useRef()

  const handleUploadProfile = event => {
    let file_uploader = event.target.nextElementSibling;
    file_uploader.click();
  }

  const displayImageContent =(event) => {
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
    <Dialog blockScroll={true} draggable={false} header="Upload Profile Image" visible={props.visible} onHide={closeModal} breakpoints={{'960px': '75vw'}} style={{width: '50vw', minHeight:"60vh"}}>
        <div className="col-12">
          <Message style={{ width:"100%" }} severity="info" text="Uploading a new image wll preserve your old profile images in your collection" />
        </div>
        <div className="imagePad">
           <div className="profTemplate currentProf">
              <div className="profDelete" style={{ width: 200, height:200}}><img className="deleteTemplate" src={props.user.avatar} alt="profile_img"  width={200} height={200}/>
              <BsFillPatchCheckFill className="badgeIcon" />
              <Button style={{ display:"block", backgroundColor:"crimson", margin:"10px 0" }} label="Delete Profile Image" icon="pi pi-trash" iconPos="left" color="crimson" />
              </div>
           </div>
           <div className="profTemplate">
              <div className="profDelete" style={{ width: 200, height:200}}>
              <div ref={imageRef} onClick={handleUploadProfile} className="UploadTemplate"></div>
              <input onChange={displayImageContent} type={"file"} accept={"image/*"} style={{ width:1, height:1 }} />
              <Button className={disabled ? "blocked" : "normal" } disabled={disabled} style={{ display:"block", backgroundColor:"#5CB85C", margin:"10px 0" }} label="Save" icon="pi pi-check-circle" iconPos="left"  />
              </div>
           </div>
        </div>
    </Dialog>
  );
}


const mapStateToProps = (state) => {
   return {
      user: state.userReducer.user
   }
}

export default connect(mapStateToProps, null)(ProfileUpload);
