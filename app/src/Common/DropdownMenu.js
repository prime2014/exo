import React, { useState } from "react";
import { BsInfoSquareFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineHelp } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { BsFillMoonFill } from "react-icons/bs";

const DropdownMenu = props => {
  return (
    <section className="dropdown">
      <div>
        <ul className="contextDrop">
          <li>
            <div className="submenuDrop">
              <img className="profilePhoto" src={props.user.avatar} width={57} height={57} loading="lazy" alt="profile-photo" />
              <div>
                <h3>{props.user.first_name} {props.user.last_name}</h3>
                <p>See your profile</p>
              </div>
            </div>
          </li>
          <li>
            <div className="submenuDrop">
              <span><BsInfoSquareFill style={{ fontSize:22 }}/></span>
              <div>
                <h3>Give Feedback</h3>
                <p>Help us improve Exo</p>
              </div>
            </div>
          </li>
          <li className="bottomDrop">
            <div>
              <span className="iconLL"><IoSettingsSharp /></span>
              <span style={{ padding:"0 5px" }}>Settings &amp; Privacy</span>
            </div>
            <div>
              <span className="iconLL"><MdOutlineHelp /></span>
              <span style={{ padding:"0 5px" }}>Help &amp; Support</span>
            </div>
            <div>
              <span className="iconLL"><BsFillMoonFill /></span>
              <span style={{ padding:"0 5px" }}>Display &amp; accessibility</span>
            </div>
            <div>
              <span className="iconLL"><GiExitDoor /></span>
              <span style={{ padding:"0 5px" }}>Log Out</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default DropdownMenu;
