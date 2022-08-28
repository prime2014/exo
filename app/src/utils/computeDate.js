export function setReadableTime(time){
  let posted_date = new Date(time);

  // computes the number of milliseconds since epoch of time (1 Jan 1970 00:00:00) to the time when the post was created
  let posted_date_in_ms = posted_date.getTime()

  // computes the number of milliseconds since the epoch of time until the current time
  let current_date_in_ms = Date.now()

  //get difference between the two times
  let time_diff_in_ms = current_date_in_ms - posted_date_in_ms;

  // convert the time difference in to seconds
  let time_diff_in_sec = time_diff_in_ms / 1000;

  // classification of time in sec
  let min = 60;
  let hour = min ** 2;
  let day = hour * 24;
  let week = day * 7;
  let month = day * 30;
  let year = day * 365;

    if(time_diff_in_sec < 59)
      return "Just now";
    else if(time_diff_in_sec >= 1 && time_diff_in_sec < min){
      //records time in sec
      let posted_sec = Math.floor(time_diff_in_sec / 1)
      return `${posted_sec}sec ago`;
    }
    else if(time_diff_in_sec >= min &&  time_diff_in_sec < hour){
      // converts time into minutes
      let posted_min = Math.floor(time_diff_in_sec / min)
      return `${posted_min}min ago`;
    }
    else if (time_diff_in_sec >= hour && time_diff_in_sec < day){
      // converts time into hours
      let posted_hrs = Math.floor(time_diff_in_sec / hour)
      return posted_hrs === 1 ? `${posted_hrs}hr ago` : `${posted_hrs}hrs ago`;
    }
    else if(time_diff_in_sec >= day && time_diff_in_sec < week){
      // converts time into days
      let posted_days = Math.floor(time_diff_in_sec / day)
      return posted_days === 1 ? `${posted_days}day ago` : `${posted_days} days ago`;
    }
    else if(time_diff_in_sec >= week && time_diff_in_sec < month){
      // converts time into weeks
      let posted_wks = Math.floor(time_diff_in_sec / week)
      return posted_wks === 1 ? `${posted_wks}wk ago` : `${posted_wks}wks ago`;
    }
    else if(time_diff_in_sec >= month && time_diff_in_sec < year){
      // converts time into months
      let posted_mnths = Math.floor(time_diff_in_sec / month)
      return `${posted_mnths}mo ago`;
    }
    else if(time_diff_in_sec >= year){
      //converts time to years
      let posted_yrs = Math.floor(time_diff_in_sec / year)
      return posted_yrs === 1 ? `${posted_yrs} yr ago` : `${posted_yrs} yrs ago`;
    }
    else {
      return "unknown";
    }
}
