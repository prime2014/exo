import React, { useState } from "react";
import { BsInfoSquareFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineHelp } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { BsFillMoonFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { accountsApi } from "../services/accounts/accounts.service";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, clearFeed, clearNotifications } from "../redux/actions";


const DropdownMenu = props => {

  const navigate = useNavigate()

  const logoutUser = event => {
    event.stopPropagation()
    toast.promise(accountsApi.logoutUserSession(), {
      loading: "Logging you out in a moment...",
      success: (data)=> {

        let { success } = data;
        if (success) {
          localStorage.clear()
          props.logoutUser();
          props.clearFeed();
          props.clearNotifications();
          navigate("/")
          return "Logout successful";
        } else {
          throw "There was a problem with the operation!"
        }
      },
      error: (err)=>{
        return err;
      }
    },{
      style: {
        borderRadius: "10px",
        color:"#fff",
        background:"#3bd4d4"
      }
  })
  }

  const goToSettings = (event) => {
    event.stopPropagation()
    navigate(`/${props.user.pk}/settings`);
  }


  return (
    <section onClick={event=> event.stopPropagation()} className="dropdown">
      <div>
        <ul className="contextDrop">
          <li>
            <div className="submenuDrop">
              <img className="profilePhoto" src={props.user ? props.user.avatar : null} width={57} height={57} loading="lazy" alt="profile-photo" />
              <div>
                <h3>{props.user ? `${props.user.first_name} ${props.user.last_name}` : null}</h3>
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
            <div onClick={goToSettings}>
              <span className="iconLL"><IoSettingsSharp /></span>
              <span style={{ padding:"0 5px" }}>Settings &amp; Privacy</span>
            </div>

            <div onClick={logoutUser}>
              <span className="iconLL"><GiExitDoor /></span>
              <span style={{ padding:"0 5px" }}>Log Out</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps  = {
  logoutUser,
  clearFeed,
  clearNotifications
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
