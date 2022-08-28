import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import { Divider } from "antd";


const EmojiPicker = props => {


  const onEmojiClick = (event, emojiObject) => {
    props.setEmoji(emojiObject.emoji);
  }

  return (
    <div className="hideEmojiChoice">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  )
}

export default EmojiPicker;
