import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Common/Navbar";
import { FileUpload } from "primereact/fileupload";
import Banner from "../../Images/wild.jpg";
import { useParams, Link, useLocation } from "react-router-dom";
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
import PostDisplay from "../../Common/postDisplay";
import { IoNewspaperOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import { BsHeartFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ProfileUpload from "../../Common/imageUploadModal";



const Profile = props => {

  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const { username } = useParams();
  const { Content } = Layout;
  const profileBannerRef = useRef();


  const handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.backgroundColor = "#e1e1e1";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }



  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.backgroundColor = "#f1f1f1";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }


  window.onscroll = ()=>{
    if(profileBannerRef.current.getBoundingClientRect().bottom <= 115){
      document.getElementsByClassName("showupMenu")[0].style.zIndex = 120;
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
    console.log(id);
    window.scrollTo(0, 0);
    accountsApi.getUserProfile(id).then(async resp=>{
      setProfile(resp);
      await feedAPI.getProfilePosts(resp.pk).then(resp=>{
        setPosts(resp.results);
      }).catch(error=> console.log(error));
    }).catch(error=> error);
  },[username])

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

  return(
    <Navbar>
      <ProfileUpload open={()=>setDisplayModal(true)} close={()=>setDisplayModal(false)} visible={displayModal}/>
      <div className="profileWrapper">
        <div className="showupMenu" style={{ padding:"10px 0", backgroundColor:"#fff" }}>
          <div className="popoo">
            <div>
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
                      <img src={profile.avatar} alt="profileImg" className="proffy"/>
                      <div onClick={()=>setDisplayModal(true)} className="eduprof">
                          <AddAPhotoIcon style={{ fontSize:"25px" }} />
                      </div>
                  </div>

                </div>
                <Row className="profileDetails" gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}></Col>
                  <Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
                    <div>
                      <div className="profileName">
                        <p>{profile.first_name} {profile.last_name}</p>
                        <span>1 friends</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="profileNavigation">
              <div className="condenseMenu">
                <ul>
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
              <Col xs={24} sm={24} md={10} lg={10} xl={10} xxl={10}>
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
                    {posts.length ? <PostDisplay feed={posts} /> :
                      <div className="noFeedText">
                        <h3>No post on this profile page</h3>
                        <IoNewspaperOutline style={{ fontSize:"30px" }}/>
                      </div>
                    }
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
