export const displayComments = item => {
  if(item.comments === 0){
    return `${item.comments} comments`;
  } else if(item.comments === 1){
    return `${item.comments} comment`;
  } else if(item.comments > 1 && item.comments < 1000){
    return `${item.comments} comments`;
  } else if(item.comments >= 1000){
    let num_comments = item.comments / 1000
    return `${num_comments}k comments`;
  }
}
