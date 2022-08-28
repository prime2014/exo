import React from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import { FaRegBell } from "react-icons/fa"
import { BiBookmarkAlt } from "react-icons/bi";
import { BsClockHistory } from "react-icons/bs";
import { BiMessageSquareEdit } from "react-icons/bi";
import { RiDeleteBack2Line } from "react-icons/ri";



const PostMenu = props => {
  return (
      <ul className="postMenu">
        <li>
          <BiMessageSquareEdit fontSize={24}/>
          <span>
             <span>Edit post</span>
             <span>Modify your post content</span>
          </span>
        </li>
        <li>
          <RiDeleteBack2Line fontSize={24}/>
          <span>
             <span>Delete post</span>
          </span>
        </li>
        <li>
          <BiBookmarkAlt fontSize={24}/>
          <span>
             <span>Save video</span>
             <span>Add this to your saved items</span>
          </span>
        </li>
        <li>
          <LinkIcon style={{ fontSize: 24 }}/>
          <span>
             <span>Copy link</span>
          </span>
        </li>
        <li>
          <FaRegBell  fontSize={24}/>
          <span>
             <span>Turn on notifications for this post</span>
          </span>
        </li>
        <li>
          <BsClockHistory fontSize={24} />
          <span>
             <span>Snooze Prime Omondi for 30 days</span>
             <span>Temporarily stop seeing posts</span>
          </span>
        </li>
        <li>
          <RemoveCircleOutlineIcon />
          <span>
             <span>Hide Post</span>
             <span>See fewer posts like this</span>
          </span>
        </li>
      </ul>
  )
}

export default PostMenu;
