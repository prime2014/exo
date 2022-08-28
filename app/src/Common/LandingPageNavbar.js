import React from "react";
import { BsFacebook, BsInstagram, BsLinkedin, BsTelephoneFill } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import { Button } from "primereact/button";
import { BiLogIn } from "react-icons/bi";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";
import { Link } from "react-router-dom";
import "react-contexify/dist/ReactContexify.css";


const MENU_ID = "menu-id";

const Navbar = props => {
  const { show } = useContextMenu({
    id:MENU_ID
  })

  const displayMenu = e =>{
    show(e)
  }

  const handleItemClick = ({ event, props, triggerEvent, data }) =>{
    console.log(event, props, triggerEvent, data );
  }

  const handleStickyNavbar = event => {
    console.log(event);
  }

  return (
    <React.Fragment>
    <div className="topBar">
      <ul className="topIcons">
        <li><BsFacebook /></li>
        <li><AiFillTwitterCircle /></li>
        <li><BsInstagram /></li>
        <li><BsLinkedin /></li>
      </ul>

      <ul className="companyInfo">
        <li><BsTelephoneFill className="infoIcons" style={{ margin:0, padding:0, verticalAlign:"middle" }} /> (+1) 234 5678 9101</li>
        <li><FaEnvelope className="infoIcons"  style={{ margin:0, padding:0, verticalAlign:"middle" }} /> exo@info.com</li>
      </ul>
    </div>

    <nav onScroll={handleStickyNavbar} className="navBar p-scrolltop-sticky">
      <h1 className="bannerTitle">Exo</h1>

      <ul>
        <li>Home</li>
        <li>About Us</li>
        <li>Special</li>
        <li>
          Testimonials
        </li>
        <li>Contact</li>
        <li>Marketing</li>
        <li>
          <Button onClick={show} icon="pi pi-user" className="p-button-rounded" />
        </li>
      </ul>
      <Menu className="contextMenu" style={{ lineHeight:"40px" }} id={MENU_ID}>
        <Link to="/account/signup">
          <Item onClick={handleItemClick}>
            <FaUserCircle style={{ fontSize:"16px", verticalAlign:"middle" }}/> <span style={{ padding:"0 5px" }}>Signup/Register</span>
          </Item>
        </Link>
        <Link to="/account/login">
          <Item onClick={handleItemClick}>
            <BiLogIn style={{ fontSize:"16px", verticalAlign:"middle" }}/> <span style={{ padding:"0 5px" }}>Login</span>
          </Item>
        </Link>
      </Menu>
    </nav>
    <div className="bannerWrapper">
    <div className="bodyTemplate">
      {props.children}
    </div>
    </div>
    </React.Fragment>
  )
}


export default Navbar;
