import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Common/Navbar";
import { FileUpload } from "primereact/fileupload";
import Banner from "../../Images/wild.jpg";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Layout, Row, Col, Avatar } from "antd";
import { BsSliders } from "react-icons/bs";
import { AiFillTag, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { accountsApi } from "../../services/accounts/accounts.service";
import ImgHolder from "../../Images/ss3.webp";
import { feedAPI } from "../../services/feed/feed.service";
import PostDisplay from "../../Common/ProfileDisplay";
import { IoNewspaperOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import { BsHeartFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ProfileUpload from "../../Common/imageUploadModal";
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import { setFriends } from "../../Common/setFriends";
import { BiEnvelope } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "primereact/skeleton";

const Profile = props => {

  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const { username } = useParams();
  const { Content } = Layout;
  const profileBannerRef = useRef();
  const location = useLocation();
  const toastao = useRef(null);
  const [addFriend, setAddFriend] = useState(false)
  const [confirm,setConfirm] = useState(false)
  const [myLoader, setMyLoader] = useState(false)
  const [requestFriend, setRequestFriend] = useState(false)
  const [profileLoader, setProfileLoader] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(false);
  const navigate = useNavigate()


  const handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.backgroundColor = "#e1e1e1";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }


  const items = [
    {
        label: 'Cancel Request',
        icon: 'pi pi-times-circle',
        command: (e) => cancelFriendRequest()
    }
]



  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.backgroundColor = "#f1f1f1";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }


  window.onscroll = ()=>{
    if(profileBannerRef.current.getBoundingClientRect().bottom <= 115){
      document.getElementsByClassName("showupMenu")[0].style.zIndex = 1150;
      document.getElementsByClassName("showupMenu")[0].style.display = "block";
      document.getElementsByClassName("showupMenu")[0].style.opacity = 1;
      document.getElementsByClassName("showupMenu")[0].style.transition = "opacity 0.8s ease-in-out";
    } else {
      document.getElementsByClassName("showupMenu")[0].style.zIndex = -1;
      document.getElementsByClassName("showupMenu")[0].style.display = "none";
      document.getElementsByClassName("showupMenu")[0].style.opacity = 0;
      document.getElementsByClassName("showupMenu")[0].style.transition = "opacity 0.8s ease-in-out";
    }
  }


  useEffect(()=> {
    let id = parseInt(username.split("-").pop())
    window.scrollTo(0, 0);
    setProfileLoader(true)
    accountsApi.getUserProfile(id).then(async resp=>{
      console.log("THIS PROFILE: ", resp)
      if(resp.pk){
        setProfileLoader(false)
        setProfile(resp);
      } else {
        throw "The account associated with this profile page was not found."
      }

    }).catch(error=> {
      setProfileLoader(false)
      console.log(error);
      toast.error(error)
      navigate("/feed")
    });

  },[props.user, username])

  const displayFeeds = () => {
    let data = props.feed.map(item=> {
      return (
        <div className="postCard">

          <div className="topSection">
            <span>
              <Avatar src={item.author.avatar} size={40} alt="profile-image" />
                <span className="postOwner">
                  <Link to={{
                    pathname: `/${item.author.username}-${item.author.pk}`,
                  }} style={{ fontSize:"14px", fontWeight:"bold", color:"darkslateblue" }} >
                    {item.author.first_name} {item.author.last_name}
                  </Link>
                  <span>3wks ago</span>
                </span>
            </span>
            <span className="pi pi-ellipsis-h" style={{ display:"inline-block", margin:"0 10px", paddingRight:"10px" }}></span>
          </div>
          <div className="postContent">
            <p>{item.post}</p>
          </div>
          <div className="postActions">
            <div className="leftAction">
              <span aria-pressed={false} className="like">
                <AiOutlineHeart style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }} />
                {item.likes}
                <span className="likeTooltip">Like</span>
              </span>
            </div>
            <div className="rightActions">
              <span className="postIcons">
                <BiCommentDetail style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }}/>
                  0
                  <span className="tooltip">Comments</span>
              </span>
                <span className="postIcons">
                <IoIosShareAlt style={{ fontSize:"21px", verticalAlign:"middle", marginRight:"5px" }}/>
                {item.share}
                <span className="tooltip">Shares</span>
                </span>
            </div>
          </div>
        </div>
      )
    });
    return data;
  }

  const setLoader = state => setMyLoader(state);

  const sendFriendReuqest = () => {
    let user_profile = profile;
    user_profile.meta.requests.push(parseInt(props.user.pk))
    let { pk, ...rest } = user_profile;
    rest.id = pk;
    console.log(rest);
    setRequestFriend(true)
    toast.promise(accountsApi.friendRequest(rest), {
      loading: `Sending a friend request to ${profile.first_name} ${profile.last_name}`,
      success: (data)=>{
        console.log(data);
        setRequestFriend(false);
        setProfile(data)
        return "Friend request was successfully sent";
      },
      error: (error)=>{
        setRequestFriend(false)
        return "There was a problem with your request"
      }
    }, {
      style: {
        borderRadius: "10px",
        color:"#fff",
        background:"#3bd4d4"
      }
    })
  }

  const cancelFriendRequest = () => {
    let user_profile = profile;
    let myrequests = user_profile.meta.requests;
    let indx = myrequests.findIndex(item=> item === parseInt(props.user.pk))
    myrequests.splice(indx, 1)
    user_profile.meta.requests = myrequests;

    let { pk, ...rest } = user_profile;
    rest.id = pk;
    setRequestFriend(true)
    toast.promise(accountsApi.cancelFriendRequest(rest), {
      loading: `Cancelling friend request.`,
      success: (data)=>{
        console.log(data);
        setRequestFriend(false);
        setProfile(data)
        return "Friend request was successfully cancelled";
      },
      error: (error)=>{
        setRequestFriend(false)
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


  const unfriend = () => {
    let { pk } = profile;
    setDeleteLoader(true);
    toast.promise(accountsApi.unfriendUser(pk), {
      loading: "Unfriending user...",
      success: (status)=>{
        setDeleteLoader(false)
        if(status.detail){
          let new_profile = profile;
          new_profile.is_friend = false;
          setProfile(new_profile);
          return "Request successful! You are no longer friends.";
        } else {
          throw "There was a problem with this operation";
        }
      },
      error: (error)=>{
        setDeleteLoader(false)
        return "We encountered a problem tryin to process your request"
      }
    }, {
      style: {
        borderRadius: "10px",
        color:"#fff",
        background:"#3bd4d4"
      }
    })
  }

  const save = () => {
    let id = parseInt(username.split("-").pop())
    setAddFriend(true);
    accountsApi.addFriend(id).then(resp=> {
      if(resp.from_person){
        setConfirm(true)
      }
      setAddFriend(false)
      toastao.current.show({severity:'success', summary:'Friend Connection', detail:'You have successfully added a new friend!'});
    }).catch(err=> {
      console.log(err)
      setAddFriend(false)
      toastao.current.show({severity:'error', summary:'Connection Refused', detail:'There was a problem processing your request'});

    })
  }

  const updateProfile = avatar => {
    setProfile({...profile, ...avatar})
    setDisplayModal(false)
  }

  return(
    <Navbar>
      <Toaster />
       <Toast ref={toastao}></Toast>
      <ProfileUpload update={updateProfile} open={()=>setDisplayModal(true)} close={()=>setDisplayModal(false)} visible={displayModal}/>
      <div className="profileWrapper">
        <div className="showupMenu" style={{ padding:"10px 0", backgroundColor:"#fff" }}>
          <div className="popoo">
            <div style={{ display:"flex", justifyContent:"center" }}>
              <div>
                <img src={profile.avatar} style={{ width:"40px", height:"40px", borderRadius:"50%", objectFit:"cover" }} alt="profile" />
              </div>

              <span>{profile.first_name} {profile.last_name}</span>
            </div>
            <div onMouseDown={handlePress} onMouseUp={handleRelease} className="profellbtn">
              <span className="pi pi-ellipsis-h"></span>
            </div>
          </div>
        </div>
        <Content ref={profileBannerRef} className="profileBanner"  style={{ background: `linear-gradient(to bottom, #8f8b94 30%,  #fff 55%)` }}>
            <div className="coverBanner">
              <div className="bannerCoverPhoto">
                <div className="coverImagery" style={{ backgroundImage:`url(${Banner})`, backgroundSize:"cover", backroundRepeat:"no-repeat" }}>
                  <div className="profileEmbed">
                      <Avatar style={{ border:"7px solid #fff", boxShadow:"2px 2px 5px #444", zIndex:99 }} src={profile.avatar} alt="profile" size={170} />
                      {parseInt(username.split("-").pop()) === props.user.pk ?
                      <div onClick={()=>setDisplayModal(true)} className="eduprof">
                          <AddAPhotoIcon style={{ fontSize:"25px" }} />
                      </div> : null}
                  </div>

                </div>
                <Row className="profileDetails" gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}></Col>
                  <Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
                    <div className="nameDisplay" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div className="profileName" style={{ minWidth:200 }}>
                        {profileLoader !== true ?
                        <><p>{profile.first_name} {profile.last_name}</p>
                        <span>{setFriends(profile.friends)}</span></> :
                          <>
                          <Skeleton shape="rectangle" width="100%" height="40px" className="skele-name"></Skeleton>
                          <Skeleton shape="rectangle" width="50%" height="20px" className="skele-friends"></Skeleton>
                          </>
                        }
                      </div>
                      <div className="flex mb-1" style={{ display:"flex", alignItems:"center", minWidth:"100px" }}>
                        {profileLoader === true ? <>
                          <Skeleton shape="rectangle" width="100%" height="40px" className="skele-name"></Skeleton>
                        </> : <>
                        {(profile.pk !== props.user.pk) && (profile && profile.is_friend === false) && (Object.keys(profile).length && Object.keys(profile.meta).length && !profile.meta.requests.includes(parseInt(props.user.pk))) &&  !props.user.meta.requests.includes(profile.pk) &&
                        <Button loading={requestFriend} loadingIcon={"pi pi-sun"} onClick={sendFriendReuqest} label={"Add Friend"} icon="pi pi-user-plus" />}
                        {(profile.is_friend === true) && <Button onClick={unfriend} loading={deleteLoader} loadingIcon={"pi pi-sun"} label={"Unfriend"} icon="pi pi-user-minus" style={{ background:"#BD2031", color:"#fff" }} />}
                        {(props.user.pk !== profile.pk) && (Object.keys(profile).length && Object.keys(profile.meta).length && profile.meta.requests.includes(parseInt(props.user.pk))) && (profile && profile.is_friend === false) && <SplitButton loading={requestFriend} loadingIcon={"pi pi-sun"} label="Friend Request Sent" icon={<BiEnvelope style={{margin:"0 3px"}}/>} iconPos="left"  model={items}></SplitButton>}
                        </>}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="profileNavigation">
              <div className="condenseMenu">
                <ul className="menuProfile">
                  <li>Posts</li>
                  <li>About</li>
                  <li>Friends</li>
                  <li>Photos</li>
                  <li>Videos</li>
                  <li>Check-Ins</li>
                  <li>More</li>
                </ul>
                <div onMouseDown={handlePress} onMouseUp={handleRelease} className="profellbtn">
                  <span className="pi pi-ellipsis-h"></span>
                </div>
              </div>
            </div>
        </Content>

        <Content>
          <section className="bodyContent">
            <Row gutter={[16, 16]}>
              <Col xs={0} sm={24} md={10} lg={10} xl={10} xxl={10}>
                <div className="stickyContent">
                  <div className="leftSection">
                    <div className="metaDetails">
                      <p>Intro</p>
                      <p>Great things happen to people who are willing to work hard and chase their dreams</p>
                    </div>
                    <ul className="infoList">
                      <li style={{ display:"flex", alignItems:"center", lineHeight:"40px" }}><BsHeartFill style={{ color:"#888", fontSize:"20px", marginRight:"10px" }}/> In a relationship</li>
                      <li style={{ display:"flex", alignItems:"center", lineHeight:"40px"  }}><FaMapMarkerAlt style={{ color:"#888", fontSize:"20px", marginRight:"10px" }}/> From Nairobi, Kenya</li>
                      <li style={{ display:"flex", alignItems:"center", lineHeight:"40px"  }}><MdOutlineRssFeed style={{ color:"#888", fontSize:"20px", marginRight:"10px" }}/> Followed by 3,613 people</li>
                    </ul>
                  </div>
                  <div className="leftSection">
                    <p>intro</p>
                  </div>
                  <div className="leftSection">
                    <p>intro</p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
                <div className="leftSection">
                    <p>Posts</p>
                </div>
                <div>
                  <PostDisplay profile={profile} />
                </div>
              </Col>
            </Row>
          </section>
        </Content>
      </div>
    </Navbar>
  );
}


const mapStateToProps = state => {
  console.log(state);
  return {
    user: state.userReducer.user,
    feed: state.feedReducer.feed
  }
}


export default connect(mapStateToProps, null)(Profile);
