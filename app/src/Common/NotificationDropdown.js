import React from "react";
import { Layout } from "antd"
import Diane from "../Images/diane.jpg";
import { IoNotifications } from "react-icons/io5";


const Notifications = props => {

  const { Content } = Layout;

  return (
    <Content className="notificationsBar">
      <div className="notifyHeader">
        <h2>Notifications</h2>
        <span className="pi pi-ellipsis-h"></span>
      </div>
      <div className="notifyTag">
        <span>All</span>
        <span>Unread</span>
      </div>
      <div className="notifyHeader groupNew">
        <h4>New</h4>
        <span>See more</span>
      </div>
      <ul>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
          <li className="notifyTip">
            <span className="notifySpace">
              <img loading="lazy" className="notifyImg" src={Diane} width={60} height={60} alt="notify-img" />
              <span><IoNotifications className="nIcon" /></span>
            </span>
            <span>You have a new friend suggestion <strong>Ada Pierce</strong></span>
          </li>
      </ul>
    </Content>
  );
}

export default Notifications;
