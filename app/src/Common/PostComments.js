import React from "react";
import { Layout } from "antd";
import { Dialog } from "primereact/dialog";

const PostComments = props => {

  const { Content } = Layout;

  const closePost = () => props.hide();

  const headerSection = () => {
    return <h1>Exo</h1>;
  }

  return (
    <Dialog header={headerSection()} onHide={closePost} maximized={true} visible={props.visible}>
      <Content>

      </Content>
    </Dialog>
  )
}

export default PostComments;
