import React, { useState, useEffect } from "react";
import { Layout, Avatar } from "antd";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { CgMenuGridO } from 'react-icons/cg';
import { IoNotifications } from "react-icons/io5";
import { FaPhotoVideo } from "react-icons/fa";
import { AiFillHome } from 'react-icons/ai';
import DropdownMenu from "./DropdownMenu";
import { accountsApi } from "../services/accounts/accounts.service";
import { ScaleLoader } from "react-spinners";
import ImgHolder from "../Images/avatar2.jpg";
import { Badge } from 'primereact/badge';
import Notifications from "../Common/NotificationDropdown";
import { VscTriangleDown } from "react-icons/vsc";
import { getNotificationsUnreadCount, markNotificationAsRead } from "../redux/actionDispatch";
import { Toaster } from "react-hot-toast";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Sidebar } from 'primereact/sidebar';




const Navbar  = (props) => {

  const [selected, setSelected] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [searchOutput, setSearchOutput] = useState("")
  const [notifyLoader ,setNotifyLoader] = useState(false)
  const [sidebar, setSidebar] = useState(false);
  // const match = useMatch("/:username")
  const location = useLocation();
  const { Content } = Layout;
  const navigate = useNavigate();

  const matches = useMediaQuery('(max-width:500px)');

  const markAsRead = async (id) =>{
    setNotifyLoader(true)
    try {
      let status = null;
      let response = await props.markNotificationAsRead(id);
      if (response) {
        status = response.data;
        console.log(status);
        setNotifyLoader(false)
      }
      return status;
    } catch(error){
      setNotifyLoader(false)
      return error;
    }
  }


  useEffect(()=>{
    props.getNotificationsUnreadCount();
  },[props])

  const handlePress = event => {
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const handleLogoutDropdown = event => {
    event.stopPropagation();
    return selected !== "logoutMenu" ? setSelected(event.currentTarget.id) : setSelected(null);
  }

  const handleNotifyDropdown = event => {
    event.stopPropagation();
    return selected !== "notifications" ? setSelected("notifications") : setSelected(null);
}

  const handleSearch = event => {
    setSearchOutput(event.target.value);
    accountsApi.searchUsers(event.target.value).then(resp=>{
      setSearchResults(resp)
    })
      .catch(error=> error)
  }

  const goToProfile = event => {
    setSelected("profile");
    navigate(`/${props.user.username}-${props.user.pk}`)
  }

  const handleDisplayResult = event => event.target.value.length < 1 ? setSelected(null) : setSelected("search");

  // window.onclick = (event) => selected !== null ? setSelected(null) : null;

  const navigateToProfile = (event, item) => {
    event.stopPropagation();
    navigate(`/${item.username}-${item.pk}`);
  }

  const closeNotification = event => {
    setSelected(null);
  }

  const openSidebar = event => {
    setSidebar(!sidebar);
  }

  window.onclick = () => {
    setSelected(null)
  }

  return (
    <Content className="newsArea">
      <Toaster />
      {matches ? <Sidebar visible={sidebar} position="left" className="p-sidebar-sm" onHide={() => setSidebar(false)}>
      <div>Search Engine</div>
        <form onClick={event=> event.stopPropagation()} autoComplete="off" className="searchForm">
              <input className="sideSearch" onChange={handleSearch} onInput={handleDisplayResult} type='search' name="search" placeholder="search friends, photos, videos" value={searchOutput}/>
              {selected === "search" ?
              <div>
                <div className="searchResults mySearch">
                  {!searchResults ? <div>The search resource does not exist</div>:
                    searchResults.map(item=> {
                      return(
                        <div id={item.pk} onClick={(event)=>navigateToProfile(event, item)} key={item.pk} className="searchItem">
                          <span><span className="iconWrap"><i className="pi pi-search"></i></span> <span style={{ padding:"0 5px" }}>{item.first_name} {item.last_name}</span></span>
                          <img src={item.avatar || ImgHolder} width={30} height={30} style={{ borderRadius:"50%", objectFit:"cover" }} alt="userImg" />
                        </div>
                      )
                    })
                  }
                </div>
                <div className="loaderDisplay">
                  <p>Searching {searchOutput}</p>
                  <ScaleLoader color="#6eb4fb" style={{ padding:0, margin:0, verticalAlign:"bottom" }} height={20} width={2} radius={2} margin={2}/>
                </div>
              </div> : null}
            </form>
      </Sidebar> : null}

      <nav className="navbarFeed">
          <div className="titleFeed">
            {matches ? <span style={{ cursor:"pointer" }} className="pi pi-bars" onClick={openSidebar}></span> : null}
            <h1>Laytext</h1>

            {!matches ? <form onClick={event=> event.stopPropagation()} autoComplete="off" className="searchForm">
              <input on onChange={handleSearch} onInput={handleDisplayResult} type='search' name="search" placeholder="search friends, photos, videos" value={searchOutput}/>
              {selected === "search" ?
              <div className="searchOutput">
                <div className="searchResults">
                  {!searchResults ? <div>The search resource does not exist</div>:
                    searchResults.map(item=> {
                      return(
                        <div id={item.pk} onClick={(event)=>navigateToProfile(event, item)} key={item.pk} className="searchItem">
                          <span><span className="iconWrap"><i className="pi pi-search"></i></span> <span style={{ padding:"0 5px" }}>{item.first_name} {item.last_name}</span></span>
                          <img src={item.avatar || ImgHolder} width={30} height={30} style={{ borderRadius:"50%", objectFit:"cover" }} alt="userImg" />
                        </div>
                      )
                    })
                  }
                </div>
                <div className="loaderDisplay">
                  <p>Searching {searchOutput}</p>
                  <ScaleLoader color="#6eb4fb" style={{ padding:0, margin:0, verticalAlign:"bottom" }} height={20} width={2} radius={2} margin={2}/>
                </div>
              </div> : null}
            </form> : null}
          </div>
          <ul className="middle-hl">
            <li className={location.pathname === "/feed" ? "activeIndex" : "indexList"}>
            <NavLink to="/feed" className={location.pathname === "/feed" ? "activeBar" : "middlelist"}>
                <AiFillHome style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle"  }} />
            </NavLink>
            </li>

            {/* <li className={location.pathname === "/groups" ? "activeIndex" : "indexList"}>
            <NavLink to="/groups" className={location.pathname === "/groups" ? "activeBar" : "middlelist"}>
            <TiGroup style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle" }} />
            </NavLink>
            </li> */}
          </ul>

          <ul className="leftMenuTab">
            <li className="menuList" style={{ verticalAlign:"middle", display:"inline-flex", justifyContent:"center", alignItems:"center" }}>
              <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={goToProfile} className={"cloned"}>
                <Avatar style={{ zIndex:99, objectFit:"cover" }} src={props.user.avatar} alt="profile" size={26} />{" "}
                  <span className="nameBar">{props.user.first_name}</span>
              </span>
            </li>
            {!matches ? <><li className="gridMenu">
                <span className="menuIcon"><CgMenuGridO style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
            </li>
            <li className="gridMenu">
              <span className="menuIcon"><FaPhotoVideo style={{ fontSize:"20px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
            </li></> : null}
            <li className="menuList">
                <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={handleNotifyDropdown} className={selected === "notifications" ? "clicked2" : "notificIcon"}><IoNotifications style={{ fontSize:"20px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
                {props.count >= 1 ? <Badge className="navBadge" value={props.count} severity={"danger"}></Badge> : null}
                {selected === "notifications" ? <Notifications readNotification={markAsRead} close={closeNotification}/> : null}
            </li>
            <li className="menuList loginDrop">
              <span onMouseDown={handlePress} onMouseUp={handleRelease} id="logoutMenu" onClick={handleLogoutDropdown} className={selected === "logoutMenu" ? "clicked" : "loginDropper"}><VscTriangleDown style={{ fontSize:"18px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
              {selected === "logoutMenu" ? <DropdownMenu {...props}/> : null}
            </li>
          </ul>
      </nav>
      <div className="newsTemplate">
        {props.children}
      </div>
    </Content>
  )
}


const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    count: state.notifications.unread_count
  }
}

const mapDispatchToProps = {
  getNotificationsUnreadCount,
  markNotificationAsRead
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
