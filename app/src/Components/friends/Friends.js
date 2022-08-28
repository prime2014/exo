import React from "react";
import Navbar from "../../Common/Navbar";
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';


const Friends = (props) => {
  return (
    <Navbar>
       <div>

          <div className="side-menu">
              <ul className="menuItems">
                <li>
                    <span className="menuIco"><PeopleOutlineTwoToneIcon /></span>
                    <span>Add Friends</span>
                </li>
              </ul>
          </div>

       </div>
    </Navbar>
  )
}

export default Friends;
