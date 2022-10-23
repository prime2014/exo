import React, { useState, useRef, useEffect  } from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import { FcGallery } from "react-icons/fc";
import { MdOutlineEmojiEmotions, MdSettingsInputAntenna } from "react-icons/md";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { FaUserTag, FaMapMarkerAlt } from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import { BsFlagFill } from "react-icons/bs";
import { InputTextarea } from 'primereact/inputtextarea';
import EmojiPicker from "./EmojiPicker";
import { BiImageAdd } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import { feedAPI } from "../services/feed/feed.service";
import { accountsApi } from "../services/accounts/accounts.service";
import axios from "axios";
import { store } from "../redux/store";
import { MoonLoader } from "react-spinners";
import { addPostContent } from "../redux/actions";
import Compressor from "compressorjs";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const PostPopup = props => {
  const { TextArea } = Input;
  const [postContent, setPostContent] = useState({
    post: "",
    tag: []
  })
  const [error, setError] = useState(null);
  const [loadFriends, setLoadFriends] = useState(false);
  const [tagged, setTagged] = useState([])
  const [friends, setFriends] = useState([])
  const [postSection, setPostSection] = useState("postWrite");
  const [base,setBase] = useState(postContent);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loader, setLoader] = useState(false);
  const imageRef = useRef();
  const postRef = useRef();
  const textRef = useRef()
  const defaultRef = useRef();
  const tagRef = useRef();
  const popupRef = useRef();
  const searchRef = useRef(null);

  const showIcon = event => event.currentTarget.nextElementSibling.style.display = "inline-block";
  const hideTooltipIcon = event => event.currentTarget.nextElementSibling.style.display = "none";
  const openPictureUpload = event => setShowImageUpload(true);




  useEffect(()=>{
    setFriends([]);

  },[postContent, postSection, tagged])


  const closeModal = () => {
    setPostContent(base);
    setTagged([])
    setPostSection("postWrite");
    setFile(null);
    setPreview(false);
    setShowImageUpload(false);
    props.close();
  }

  const uploadMedia = async (content, array) => {
    await axios.post(process.env.REACT_APP_API_URL + "/feeds/api/v1/post/media/", content, {
      headers : {
        "Content-Type": "multipart/form-data",
        "authorization": `Token ${store.getState().userReducer.token}`
      }
    }).then(resp=>{

      if(resp.data["posted_photos"].length === array.length){
        console.log(resp.data);
        props.addPostContent(resp.data);
        setLoader(false);
        setSuccess(true);
        props.openSuccess();
        hideModal()
      }
    }).catch(error=> console.log(error));
  }


  const compressImage = (file, index, array, post, mypost_with_images) => {
    new Compressor(file, {
      quality: 0.8,
      resize: "cover",
      async success(result) {
        let content = new FormData();
        content.append("post", post.id)
        content.append("file", result, result.name)

        // upload the images
        uploadMedia(content, array);
      },
      error(err){

      }
    })
  }



  const closeAlert = () => {
    setError(null);
  }


  const submitPost = async () => {

    setLoader(true)
    let content = {
      post: postContent.post,
      tag: tagged.length ? tagged.map(item=>{ return { user:item.pk } }) : []
    }
    let mypost_with_images = []

    await feedAPI.postFeed(content).then( async resp=>{
      if(resp.message){
        throw resp.message;
      }

      if(file ) {
        Object.values(file).forEach(async (item, index, array)=>{
          let media_type = item.type.split("/")[0]
          if(media_type == "image"){
            compressImage(item, index, array, resp, mypost_with_images); // compress images before upload
          } else if(media_type === "video"){
            let content = new FormData();
            content.append("post", resp.id)
            content.append("file", item, item.name)
            uploadMedia(content, array)
          }
        })
      } else {
        console.log(resp)
        props.addPostContent(resp);
        setLoader(false);
        props.openSuccess();
        hideModal();
      }
    }).catch(error=> {
      setLoader(false);
      if(error) setError(error);
    });
  }


  const slideTag = () => {
    defaultRef.current.style.transform = "translateX(-105%) translateZ(1px)";
    tagRef.current.style.transform = "translateX(-3%) translateZ(1px)";
    popupRef.current.style.height = "550px";
    defaultRef.current.style.transition = "all 0.3s ease-in-out";
    tagRef.current.style.transition = "all 0.4s ease-in-out";
    popupRef.current.style.transition = "all 0.3s ease-in-out";

  }

  const setDefaultPoster = () => {
    defaultRef.current.style.transform = "translateX(0%) translateZ(1px)";
    tagRef.current.style.transform = "translateX(95%) translateZ(1px)";
    popupRef.current.style.height = "500px";
    defaultRef.current.style.transition = "all 0.4s ease-in-out";
    tagRef.current.style.transition = "all 0.4s ease-in-out";

    popupRef.current.style.transition = "all 0.3s ease-in-out";
  }



  const renderFooter = () =>{
    return (
      <div>
        <div className="postExtra">
          <span>Add to your post</span>
            <ul>

              <li>
                <span onMouseLeave={hideTooltipIcon} onMouseEnter={showIcon} className={showImageUpload ? "svgClicked" : "svgIcon"} onClick={openPictureUpload}><FcGallery /></span>
                <span className="iconTooltip">photos/videos</span>
              </li>
              <li>
                <span onClick={slideTag} onMouseLeave={hideTooltipIcon} onMouseEnter={showIcon} className="svgIcon"><FaUserTag  color={"blue"}/></span>
                <span className="iconTooltip">Tag People</span>
              </li>
              <li>
                <span onMouseLeave={hideTooltipIcon} onMouseEnter={showIcon} className="svgIcon"><MdOutlineEmojiEmotions color="goldenrod" /></span>
                <span className="iconTooltip">Feeling/Activity</span>
              </li>
              <li>
                <span onMouseLeave={hideTooltipIcon} onMouseEnter={showIcon} className="svgIcon"><FaMapMarkerAlt color="crimson" /></span>
                <span className="iconTooltip">Check in</span>
              </li>
              <li>
                <span onMouseLeave={hideTooltipIcon} onMouseEnter={showIcon} className="svgIcon"><BsFlagFill color="grey" /></span>
                <span className="iconTooltip">Life Event</span>
              </li>
            </ul>
        </div>
        <Button onClick={submitPost} id={postContent.post.length !== 0  | file !== null ? "posted" : "disabledBtn"} disabled={postContent.post.length !== 0  | file !== null ? false : true} label="post" style={{ width:"100%" }} ref={postRef} />
      </div>
    )
  }


  const hideModal = event => {
    setPostContent(base);
    setTagged([])
    setPostSection("postWrite");
    setFile(null);
    setPreview(false);
    setShowImageUpload(false);

    props.close();

  }


  const closeImageUpload = event => {
    if(preview){
      event.currentTarget.parentElement.lastChild.remove();
      setFile(null);
      setPreview(false);
    }
    setShowImageUpload(false);
    return;
  }

  const handlePost = ev => setPostContent({
    ...postContent,
    post: ev.target.value
  })

  const expandEmoji = event => event.target.nextElementSibling.classList.toggle("emojiChoice");

  const setEmojiChoice = emoticon => setPostContent({ ...postContent,  post: postContent.post.concat(`${emoticon}`) });


  const handleImageUpload = event => {
      let { files } = event.target;
      setFile(files);
      setPreview(true);
      let data = files[0].type.split("/")[0];

      let divElement = document.createElement("div");
      for(let i = 0; i < files.length; i++){
        if(data == "image"){
          let div = document.createElement("div");
          let img = document.createElement("img");
          let btn = document.createElement("button");
          div.style.position = "relative";
          btn.className = "editBTn"
          btn.innerHTML= "<span style='font-size:14px' class='pi pi-pencil'></span> <span style='font-size:14px'>Edit Image</span>";
          img.src = URL.createObjectURL(files[i]);
          img.style.display = "block";
          img.style.width = "100%";
          div.appendChild(img);
          div.appendChild(btn);
          btn.onclick = () => {
            alert(img.src);
          }
          divElement.appendChild(div);
          img.onload = ()=> URL.revokeObjectURL(img.src);
        } else if (data == "video") {
          let reader = new FileReader();
          let div = document.createElement("div");
          let video = document.createElement("video")
          let source = document.createElement("source")
          let btn = document.createElement("button");
          div.style.position = "relative";
          btn.className = "editBTn"
          btn.innerHTML= "<span style='font-size:14px' class='pi pi-pencil'></span> <span style='font-size:14px'>Edit Video</span>";

          reader.onload = () => {
            // video.autoplay = true;
            video.controls = true;
            source.src = reader.result;
            video.appendChild(source);
            video.style.width = "100%";
            video.style.height = "300px";
          }
          div.appendChild(video);
          div.appendChild(btn);
          divElement.appendChild(div);
          btn.onclick = () => {
            alert(video.src);
          }
          reader.readAsDataURL(files[i]);



          // let div = document.createElement("div");
          // let video = document.createElement("video");
          // let btn = document.createElement("button");
          // div.style.position = "relative";
          // btn.className = "editBTn"
          // btn.innerHTML= "<span style='font-size:14px' class='pi pi-pencil'></span> <span style='font-size:14px'>Edit Image</span>";
          // video.src = URL.createObjectURL(files[i]);
          // video.style.display = "block";
          // video.controls = true;
          // video.style.width = "100%";
          // div.appendChild(video);
          // div.appendChild(btn);
          // btn.onclick = () => {
          //   alert(video.src);
          // }
          // divElement.appendChild(div);
          // video.onload = ()=> URL.revokeObjectURL(video.src);
        }
      }
      imageRef.current.appendChild(divElement);
  };
  const handleFilePrompt = event => {
    // triggers click on the input[file]
    let file_input = document.getElementById("filePrompt");
    file_input.click();
  };

  const renderBack = () => {
    return (
      <div style={{ display:"flex", width:"100%" }}>
        <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-outlined p-button-info" />
      </div>
    )
  }

  const renderHeader = () => {
    return(
      <div style={{borderBottom:"1px solid #c4c4c4", padding:"10px 0", position:"relative" }}>
          <div onClick={hideModal} className="closeOut"><CloseIcon /></div>
          <span style={{ fontSize:"20px", fontFamily:"Roboto", width:"100%", display:"block", textAlign:"center" }}>Create Post</span>
      </div>
    )
  }
  const renderHeaderTag = () => {
    return(
      <div style={{borderBottom:"1px solid #c4c4c4", padding:"10px 0", display:"flex", alignItems:"center", position:"relative" }}>
          <div onClick={setDefaultPoster} className="back2back"><ArrowBackIcon /></div>
          <span style={{ fontSize:"20px", fontFamily:"Roboto", display:"block", textAlign:"center", width:"100%" }}>Tag People</span>
      </div>
    )
  }

  const searchFriends = event => {
    if (event.target.value.length){
      let name = event.target.value;
      setLoadFriends(true);
      accountsApi.searchFriends(name, props.user.pk).then(resp=>{
        let pks = tagged.map(item=> item.pk)
        // let new_array = resp.filter(item=>  !pks.some(item.pk) )
        setFriends([ ...resp ])
        setLoadFriends(false)
      })
    } else {
      setFriends([])
    }
  }

  const selectUserToTag = (ev, item) =>{

    let selected = tagged.some(tag => tag.pk === item.pk)
    if(!selected){
      ev.currentTarget.classList.add("added");
      setTagged([ ...tagged, item ])
      searchRef.current.value = "";
    } else {
      ev.currentTarget.classList.remove("added")
      let index = tagged.findIndex(tag=> tag.pk === item.pk)
      let ndarray = tagged;
      ndarray.splice(index, 1);
      setTagged(ndarray);
      searchRef.current.value = "";
    }
  }




  const removeTag = item => {
    console.log(item)
    let ind = tagged.findIndex(tag=> tag.pk === item.pk)
    console.log(ind)
    let new_tag = tagged;
    new_tag.splice(ind, 1)
    setTagged(new_tag);
    setFriends([])
  }

  const closeSuccess = () => {
    setSuccess(false)
  }


  const displayFriends = () => {
    return friends.length ?
      friends.map(item=> {
      return(
        <div onClick={(event)=>selectUserToTag(event, item)} className={tagged.includes(item) ? "hiddenTaggy" : "friendsTag"} key={item.pk}>
          <div>
            <img src={item.avatar} alt="profile" style={{ width:"35px", height:"35px", borderRadius:"50%", objectFit:"cover" }} />
            <span> {item.first_name} {item.last_name}</span>
          </div>
          {/* <span className="pi pi-check-circle hiddenCheck"></span> */}
        </div>
      )
    }) : (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"20px 0" }}>
        <span style={{ fontSize:"22px", display:"block", margin:"0 auto" }} className="pi pi-user-plus"></span>
        <p style={{ fontFamily:"Roboto", display:"block", margin:"0 auto" }}>No friends with these initials</p>
    </div>)
  }

  return (
    <React.Fragment>
      <Snackbar open={success} autoHideDuration={6000} onClose={closeSuccess}>
          <Alert onClose={closeSuccess} severity="success" sx={{ width: '100%' }}>
            Your post has been created successfully!
          </Alert>
      </Snackbar>
    <div className="popupDisplayer">
      <div id="dialog" ref={popupRef}>
      <div ref={defaultRef} id="postWrite" style={{ width:"100%" }}>
              <div>{renderHeader()}</div>
              <div className="postBanner">
                <img src={props.user.avatar} width={35} height={35} style={{ borderRadius:"50%", objectFit:"cover" }} alt="profile" />
                <h5>{props.user.first_name} {props.user.last_name}
                  {tagged.length ? <span> is with {tagged.map((item, index, array)=> {
                    if(index < array.length -2){
                      return <b>{item.first_name} {item.last_name}, </b>;
                    } else if(index == array.length - 2){
                      return <b>{item.first_name} {item.last_name} and </b>
                    } else if(index == array.length - 1){
                      return <b>{item.first_name} {item.last_name}</b>
                    }
                  })}</span> : null}
                </h5>
              </div>
              <div className="mediaActions">
                  <div className="postWrapper">
                  <div className="actionIconsTwo">
                    <InputTextarea value={postContent.post} onChange={handlePost} className="postText" rows={5} cols={30} placeholder={`What's on your mind, ${props.user.first_name}?`}  autoResize />
                    <div className="actionIconss">
                      <GrEmoji onClick={expandEmoji} style={{ fontSize: "22px", color:"goldenrod", fontWeight:"bold", zIndex:"40px"  }} />
                      <EmojiPicker setEmoji={setEmojiChoice} />
                    </div>
                  </div>
                    <input id="filePrompt" onChange={handleImageUpload} className="imageHold" type={"file"} accept={"image/*, video/*"} multiple={true} />
                    <div ref={imageRef} className={showImageUpload ? "uploaderWrapper" : "hideUpload"}>
                      <span onClick={closeImageUpload} className="cancel">
                          <i className="pi pi-times"></i>
                      </span>
                      {!preview ? <div onClick={handleFilePrompt} className="imgTemplate">
                        <div>
                          <span style={{
                            display:"inline-flex",
                            justifyContent:"center",
                            alignItems:"center",
                            width:"35px",
                            height:"30px",
                            borderRadius:"50%",
                            backgroundColor:"#d4d4d4"
                          }}><BiImageAdd fontSize={25}/></span>
                          <p>Add photos/videos</p>
                        </div>
                      </div> : null}
                    </div>
                  </div>
              </div>
              <div>
                {renderFooter()}
              </div>
      </div>
      <div ref={tagRef} id="postTag" className="postModal">
              <div>{renderHeaderTag()}</div>
              <div className="postBanner">
                <img  src={props.user.avatar} width={35} height={35} style={{ borderRadius:"50%", objectFit:"cover" }} alt="profile" />
                <h5>{props.user.first_name} {props.user.last_name}</h5>
              </div>
              <div className="inputArr">
                    {tagged.length ? <div ref={textRef} style={{ width:"100%" }} className={tagged.length ? "displayArea" : "hideArea"} cols={100} rows='2'>
                      <Stack direction="row" spacing={1}>
                        {tagged.map(item=>{
                            return (
                              <Chip
                                key={item.pk}
                                label={item.first_name}
                                onDelete={()=>removeTag(item)}
                              />
                            )
                        })}
                      </Stack>
                    </div> : null}
                </div>
              <div className="searchInp">
                <p style={{ padding:0, margin:0 }}>Select friend/friends</p>
                <input ref={searchRef} autoComplete="off" onChange={searchFriends} style={{ lineHeight:"40px", width:"100%", borderRadius:"50px", outline:"none", border:"1px solid #ccc", backgroundColor:"#F0F2F5" }} type="search" name="friends" placeholder="search friends" />
                <div style={{ display:"flex", flexWrap:"wrap", margin:"10px 0" }}>
                  {loadFriends === false ?
                  (searchRef.current !== null && searchRef.current.value && displayFriends()) :
                  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%" }}>
                    <MoonLoader size={60} color="lightblue"/>
                  </div>
                  }
                </div>

              </div>
      </div>

      <div className={loader ? "postLoader" : "hideLoader"}>
        <ClipLoader color="black" size={32} />
        <p>Posting...</p>
      </div>
      <Snackbar open={error !== null} autoHideDuration={6000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostPopup);
