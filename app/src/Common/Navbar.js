import React, { useRef, useState, useEffect } from "react";
import { Layout } from "antd";
import { Link, NavLink, useNavigate, useLocation, useMatch } from "react-router-dom";
import { connect } from "react-redux";
import { CgMenuGridO } from 'react-icons/cg';
import { IoNotifications } from "react-icons/io5";
import {GoTriangleDown} from "react-icons/go";
import { FaPhotoVideo } from "react-icons/fa";
import { AiFillHome } from 'react-icons/ai';
import { FaUserFriends } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import DropdownMenu from "./DropdownMenu";
import { accountsApi } from "../services/accounts/accounts.service";
import { ScaleLoader } from "react-spinners";
import ImgHolder from "../Images/avatar2.jpg";
import { Badge } from 'primereact/badge';
import Notifications from "../Common/NotificationDropdown";
import { VscTriangleDown } from "react-icons/vsc";
import { store } from "../redux/store";
import { w3cwebsocket as WC3Websocket } from "websocket";



const Navbar  = (props) => {
  const [selected, setSelected] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [searchOutput, setSearchOutput] = useState("")
  const match = useMatch("/:username")
  const location = useLocation();
  const { Content } = Layout;
  const menu = useRef()
  const navigate = useNavigate();


  useEffect(()=>{

  },[])

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

  return (
    <Content className="newsArea">
      <nav className="navbarFeed">
          <div className="titleFeed">
            <h1>Exo</h1>

            <form autoComplete="off" className="searchForm">
              <input on onChange={handleSearch} onInput={handleDisplayResult} type='search' name="search" placeholder="search friends, photos, videos" value={searchOutput}/>
              {selected == "search" ?
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
            </form>
          </div>
          <ul className="middle-hl">
            <li className={location.pathname === "/feed" ? "activeIndex" : "indexList"}>
            <NavLink to="/feed" className={location.pathname === "/feed" ? "activeBar" : "middlelist"}>
                <AiFillHome style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle"  }} />
            </NavLink>
            </li>
            <li className={location.pathname === "/friends" ? "activeIndex" : "indexList"}>
            <NavLink to="/friends" className={location.pathname === "/friends" ? "activeBar" : "middlelist"}>
            <FaUserFriends style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle" }} />
            </NavLink>
            </li>
            <li className={location.pathname === "/group" ? "activeIndex" : "indexList"}>
            <NavLink to="/grouo" className={location.pathname === "/group" ? "activeBar" : "middlelist"}>
            <TiGroup style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle" }} />
            </NavLink>
            </li>
          </ul>

          <ul className="leftMenuTab">
            <li className="menuList" style={{ verticalAlign:"middle", display:"inline-flex", justifyContent:"center", alignItems:"center" }}>
              <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={goToProfile} className={match.pattern.path === "/:username" ? "cloned" : "profilePill"}>
                <img src={props.user.avatar} style={{ borderRadius:"50%" }} width={26} height={26} alt="avatar" />{" "}
                  {props.user.first_name}
              </span>
            </li>
            <li className="menuList">
                <span className="menuIcon"><CgMenuGridO style={{ fontSize:"25px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
            </li>
            <li className="menuList">
              <span className="menuIcon"><FaPhotoVideo style={{ fontSize:"20px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
            </li>
            <li className="menuList">
                <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={handleNotifyDropdown} className={selected === "notifications" ? "clicked2" : "notificIcon"}><IoNotifications style={{ fontSize:"20px", padding:0, margin:0, verticalAlign:"middle" }}/></span>
                <Badge className="navBadge" value="2" severity={"danger"}></Badge>
                {selected === "notifications" ? <Notifications /> : null}
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
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps, null)(Navbar);
