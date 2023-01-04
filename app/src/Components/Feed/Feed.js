import React, { Component } from "react";
import Navbar from "../../Common/Navbar";
import { Row, Col, Avatar, Input, Layout } from "antd";
import ProfileImg from "../../Images/johnRooster.jfif";
import Cover from "../../Images/cover.jpg";
import { BsPeopleFill } from "react-icons/bs";
import { GiThreeFriends } from "react-icons/gi";
import { Button } from "primereact/button";
import { ScrollTop } from 'primereact/scrolltop';
import axios from "axios";
import { connect } from "react-redux";
import { getFeed, fetchNextBatch } from "../../redux/actionDispatch";
// import "emoji-mart/css/emoji-mart.css";
import { FcPicture, FcSms, FcNews, FcVideoCall } from "react-icons/fc";
import debounce from "lodash.debounce";
import { feedAPI } from "../../services/feed/feed.service";
import { addPostContent } from "../../redux/actions";
import Suggestions from "./Suggestions";
import PostFeed from "../postFeed/PostFeed";
import PostDisplay from "../../Common/postDisplay";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import Postpopup from "../../Common/Postpopup";
import PeopleNearby from "./img/people_nearby.webp";
import NewsFeed from "./img/feed2.png";
import Imagess from "./img/images.jpg";
import Msgs from "./img/messages.png";
import Friends from "./img/friends.png";
import Videos from "./img/video3.png";
import Favorites from "./img/favorites.png";
import Pages from "./img/pages.png";
import { likeSelectedPost } from "../../redux/actionDispatch";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Feed extends Component {

   constructor(props){
     super(props);
     this.state = {
       post: "",
       file: null,
       image_upload: false,
       visible: false,
       loader: false,
       commentPopup: false,
       setFiles: false,
       status: null,
       success: false,
       error: false,
       create_post: false,
       loadLike: false,

     }
     this.imageRef = React.createRef();
     this.carouselRef = React.createRef();
     this.postRef = React.createRef();
   }




  componentDidMount(){

    if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
      console.log("LET'S GET THIS PARTY STARTED");
    }


    let events = new EventSource(`http://127.0.0.1:8000/events/?channel=user-${this.props.user.pk}`, {
      headers: {
        "Authorization": `Token ${this.props.user.token}`
      }
    })

    events.addEventListener("status_update", (event)=>{
      console.log(event.data);
    })


    return ()=> {
      events.removeEventListener("status_update", ()=>{
        console.log("Event listener removed")
      })
      events.close()
    }

  }


  showFullPost = event => {
    this.setState({ commentPopup: true });
  }


  clickAnimate = event => {
    event.currentTarget.style.animation = "reduce 0.5s normal ease-in-out";
  }

  handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }


  handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  displayMedia = media => {

    let data = media.map(item=> {
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
        <div onClick={this.showFullPost} className="trailor hoverable" key={item.pk}>
          <img loading="lazy" className="post_media" src={item.file} alt="post_media" />
        </div>
      )
    });
    return data;
  }

  handlePostSubmit = async event => {

    let { file, post } = this.state;
    let data_array =[]


    this.setState({
      loader: true
    }, async ()=>{

      await feedAPI.postFeed({ post }).then(resp=>{
        if(file.length){
          for(var i = 0; i < file['length']; i++){
            let formdata = new FormData()
            formdata.append("file", file[i], file.name)
            formdata.append("post", resp.pk)

            axios.post(process.env.REACT_APP_API_URL + "/feeds/api/media/", formdata, {
              headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Token ${this.props.token}`
              },
              onUploadProgress: (progressEvent)=> {
                var percentCompleted = Math.round(progressEvent.loaded * 100) / progressEvent.total;
                console.log(percentCompleted);
              },

            }).then(resp=> data_array.push(resp.data)).catch(err=>console.log(err))
          }
        } else {
          console.log("SETTING THINGS UP")
          this.props.addPostContent(resp);
        }
        if (file.length) {
          let media_post = data_array.pop();
          this.props.addPostContent(media_post);
        }
        this.setState({
          loader:false,
          image_upload: false
        })
      }).catch(error=> error);
    })


    // console.log(data_array);


  }

  slideRelated = event => {

  }

  expandEmoji = event => event.target.nextElementSibling.classList.toggle("emojiChoice");

  handleEmoji = event => {

  }

  showIcon = event => event.currentTarget.nextElementSibling.style.display = "inline-block";
  hideTooltipIcon = event => event.currentTarget.nextElementSibling.style.display = "none";

  handlePost = event => {
    this.setState({
      post:event.target.value
    })
  }


  postText = event => this.setState({ post: event.target.value })


  handleFileUpload = event => {
      let { file } = this.state;

      let formdata = new FormData();
      for(let i = 0; i < file['length']; i++){
          formdata.append("file", file[i]);
      }
      formdata.append(this.state.post);
      console.log(formdata.getAll())
      // axios.post(process.env.REACT_APP_API_URL + "/feeds/api/v1/feeds/", formdata, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     "authorization": `Token ${this.props.token}`
      //   },
      //   onUploadProgress: (progressEvent)=> {
      //     var percentCompleted = Math.round(progressEvent.loaded * 100) / progressEvent.total;
      //     console.log(percentCompleted);
      //   },

      // }).then(resp=>{
      //   console.log(resp.data)
      // }).catch(err=>console.log(err))
  }

  handleLike = event => {
    let target = event.currentTarget.getAttribute("aria-pressed")
    event.currentTarget.setAttribute("aria-pressed", !target);
    console.log(event.currentTarget.getAttribute("aria-pressed"))
  }

  renderGrids = () => {
    const media = [`${ProfileImg}`,`${ProfileImg}`,`${ProfileImg}`,`${ProfileImg}`]
    return media.map(md=>{
      return (
        <div style={{ background: `url(${md})`, backgroundSize:"cover", backgroundRepeat:"no-repeat" }}></div>
      )
    })
  }

  openUpload = event => {
    this.setState({
      visible: true
    })
  }



  hideModal = () => {
    this.setState({
      image_upload: false,
      visible: false
    })
  }

  openUploadModal = event => {
    this.setState({
      image_upload:true
    })
  }

  handleImageUpload = event => {
    let file = event.target.files;
    console.log(event.target.files)
    this.setState({
      file,
      setFiles:true
    })
    console.log(file);
    let div = document.createElement("div");

    for(var i=0; i < file['length']; i++){

      if (file[i].name.match(/mp4/)){
        let reader = new FileReader()
        let video = document.createElement("video")

        reader.onload = () => {
          // video.autoplay = true;
          video.controls = true;
          video.src = reader.result
        }
        this.imageRef.current.appendChild(video);
        reader.readAsDataURL(file[i])
      }
      else {
          let img = document.createElement("img")
          img.src = URL.createObjectURL(file[i]);
          img.style.display = "block";
          img.style.width = "100%";
          div.appendChild(img);
      }

    }
    this.imageRef.current.appendChild(div);

  }

  closeUpload = event => {
    event.stopPropagation();
    this.imageRef.current.lastElementChild.remove();
    this.setState({
      file: null,
      setFiles: false,
      // visible:false,
    })
  }

  setEmojiChoice = emoticon => {
    this.setState({ post: this.state.post.concat(` ${emoticon}`) })
  }

  closePost = () => this.setState({ commentPopup: false })

  handleFilePrompt = event => {
    let filePrompt = document.getElementById("filePrompt");
    filePrompt.click();
  }

  closeAlert = () => {
    this.setState({
      ...this.state,
      success: false,
      error: false
    })
  }

  openSuccessAlert = () => {
    this.setState({
      ...this.state,
      success:true
    })
  }


  closePostModal = () => {
    this.setState({
      ...this.state,
      create_post: false
    })
  }





  // componentDidUpdate(prevProps, prevState){
  //   if(this.props.feed !== this.state.myfeed){
  //     this.props.getFeed();
  //   }
  // }


  render(){
    // console.log(this)
    window.onscroll = debounce(()=>{
      let measuredHeight = Math.floor(window.innerHeight + document.documentElement.scrollTop);
      let url = this.props.next.replace("http", "https")

      if(Math.ceil(measuredHeight) === document.documentElement.scrollHeight && url){
          this.props.fetchNextBatch(this.props.next);
      }
    }, 100);


    const { TextArea } = Input;
    const { Content } = Layout;


    return(
      <section style={{ position:"relative" }}>
          <Toaster />
          {Object.keys(this.props.user).length ? null : <Navigate to="/" />}
          {this.state.create_post && <Postpopup openSuccess={this.openSuccessAlert} close={this.closePostModal} />}
          <Navbar>
              <Snackbar open={this.state.success} autoHideDuration={6000} onClose={this.closeAlert}>
                <Alert onClose={this.closeAlert} severity="success" sx={{ width: '100%' }}>
                  Your post has been created successfully!
                </Alert>
              </Snackbar>

              <div className="newsRow">
                <Row gutter={[16, 16]}>
                <Col xs={0} sm={24} md={7} lg={7} xl={7} className="firstCol">
                    <div className="leftAside">
                    <div className="profileBio" style={{ background:`url(${Cover})`, backgroundSize:"cover", backgroundRepeat:"no-repeat" }}>
                      <Avatar style={{ border:"7px solid #fff", boxShadow:"2px 2px 5px #444", marginTop:"-15px", marginRight:"-5px", zIndex:99 }} src={this.props.user.avatar} alt="profile" size={80} />

                      <div className="profName">
                         <h3>{this.props.user.first_name} {this.props.user.last_name}</h3>
                         <h4>1269 followers</h4>
                      </div>
                    </div>

                    <ul className="feedMenu">
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={NewsFeed} alt="newsfeed" width={35} height={35}/></span>
                          <p>News Feed</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={PeopleNearby} alt="newsfeed" width={35} height={35}/></span>
                          <p>People Nearby</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Friends} alt="newsfeed" width={35} height={35}/></span>
                          <p>Friends</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Msgs} alt="newsfeed" width={35} height={35}/></span>
                          <p>Messages</p>
                      </li>

                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Imagess} alt="newsfeed" width={35} height={35}/></span>
                          <p>Images</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Videos} alt="newsfeed" width={35} height={35}/></span>
                          <p>Videos</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Favorites} alt="newsfeed" width={35} height={35}/></span>
                          <p>Favorites</p>
                      </li>
                      <li>
                          <span><img style={{  backgroundImage: "none", backgroundSize:"cover"}} src={Pages} alt="newsfeed" width={35} height={35}/></span>
                          <p>Pages</p>
                      </li>
                    </ul>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={11} lg={11} xl={11} style={{ padding:"0 10px" }}>
                  <PostFeed open={()=>this.setState({ ...this.state, create_post:true })}/>
                  <div>
                      <Suggestions />
                  </div>

                  <Content style={{ margin:"40px 0" }}>
                      <PostDisplay />
                  </Content>
                </Col>
                <Col xs={0} sm={24} md={6} lg={6} xl={6}>
                  <div className="suggestions">
                    <div>
                      <h4>Friend Suggestions</h4>
                      <span className="pi pi-ellipsis-h"></span>
                    </div>
                    <div className="friendDetails">
                      <div>
                        <Avatar src={ProfileImg} size={35} alt="friend_suggestion"/>
                        <span className="friendName" style={{ paddingLeft:"14px", fontSize:"13px", display:"flex" }}>
                            <span><strong>Francine Smith</strong></span>
                            <span>8 Friends in Common</span>
                        </span>
                      </div>
                      <Button tooltip="Add Friend" className="p-button-raised p-button-rounded" icon={"pi pi-user-plus"} />
                    </div>
                    <div className="friendDetails">
                      <div>
                        <Avatar src={ProfileImg} size={35} alt="friend_suggestion"/>
                        <span className="friendName" style={{ paddingLeft:"14px", fontSize:"13px", display:"flex" }}>
                            <span><strong>Francine Smith</strong></span>
                            <span>8 Friends in Common</span>
                        </span>
                      </div>
                      <Button tooltip="Add Friend" className="p-button-raised p-button-rounded" icon={"pi pi-user-plus"} />
                    </div>
                    <div className="friendDetails">
                      <div>
                        <Avatar src={ProfileImg} size={35} alt="friend_suggestion"/>
                        <span className="friendName" style={{ paddingLeft:"14px", fontSize:"13px", display:"flex" }}>
                            <span><strong>Francine Smith</strong></span>
                            <span>8 Friends in Common</span>
                        </span>
                      </div>
                      <Button tooltip="Add Friend" className="p-button-raised p-button-rounded" icon={"pi pi-user-plus"} />
                    </div>
                  </div>
                  <div className="createGroup">
                      <h3>Group Conversations</h3>
                      <p><span className="pi pi-plus"></span> Create new group</p>
                  </div>
                </Col>
                </Row>
              </div>
              <ScrollTop style={{ backgroundColor:"darkslateblue", color:"white" }} icon="pi pi-angle-double-up" threshold={100} />
          </Navbar>
      </section>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    token: state.userReducer.token,
    user: state.userReducer.user,
    feed: state.feedReducer.feed,
    next: state.feedReducer.next
  }
}

const mapDispatchToProps = {
  getFeed,
  fetchNextBatch,
  addPostContent,
  likeSelectedPost
}



export default connect(mapStateToProps, mapDispatchToProps)(Feed);
