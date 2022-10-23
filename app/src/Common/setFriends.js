export const setFriends = num => {
  if(num === 0){
    return `${num} friends`
  }else if(num === 1){
    return `${num} friend`
  } else if (num > 1 && num < 1000){
    return `${num} friends`
  } else if (num >= 1000){
    let new_num = num / 1000;
    return `${new_num}k friends`
  }
}
