import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Layout } from "antd"
import Tom from "../../Images/tom.jpg";
import { Button } from "primereact/button";
import { accountsApi } from "../../services/accounts/accounts.service";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { Skeleton } from 'primereact/skeleton';
import Box from '@mui/material/Box';


const Suggestions = props => {
  const [users, setUsers] = useState([])
  const { Content } = Layout;
  const [loader, setLoader] = useState(false)
  const [start, setStart] = useState(0);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(true);
  const carouselRef = useRef()
  const navigate = useNavigate()
  const step = 395;



  useEffect(()=>{
    setLoader(true)
    accountsApi.getUsers().then(resp=> {
      setLoader(false)
      setUsers(resp);
    })
  },[])


  useLayoutEffect(()=>{
  },[])

  const requestFriend = (pk) => {
    toast.promise(accountsApi.friendRequest(pk), {
      loading: "Sending your friend request. Please wait...",
      success: (data)=> {
        console.log(data);
      },
      error:(err)=>{
        console.log(err)
      }
    })
    .then(resp=> {
      console.log(resp);
    })
  }

  const nextSlide = (event) => {
    setPrev(true)
    if(start < 145) {
      setStart(start + 145);
      carouselRef.current.style.transform = `translateX(-${145}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    } else if(start >= (ReactDOM.findDOMNode(carouselRef.current).scrollWidth - step)){
      setStart(start + 145);
      carouselRef.current.style.transform = `translateX(-${start + 145}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    } else {
      setStart(start + step)
      carouselRef.current.style.transform = `translateX(-${start + step}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    }
  }

  const prevSlide = () => {
    setNext(true)
    if(start >= ReactDOM.findDOMNode(carouselRef.current).scrollWidth || start <= 145){
      setStart(start - 145)
      carouselRef.current.style.transform = `translateX(${-start + 145}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    } else {
      setStart(start - step)
      carouselRef.current.style.transform = `translateX(${-start + step}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    }
  }


  const handlePress = event => {
    event.currentTarget.style.boxShadow = "2px 1px 5px #999";
    event.currentTarget.style.transform = "scale(0.9)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const handleRelease = event => {
    event.currentTarget.style.transform = "scale(1.0)";
    event.currentTarget.style.transition = "scale 0.7s ease-in-out linear";
  }

  const goToProfile = (profile)=>{
    navigate(`/${profile.username}-${profile.pk}`)
  }



  useEffect(()=>{
    let width = ReactDOM.findDOMNode(carouselRef.current).scrollWidth;
    console.log(width)
    if(start >= (width - step)) setNext(false);
    if(start <= 0) setPrev(false);
  },[start])

  return (
    <Content>
      <div className="related">
        <div className="headTagger">
           <h3>People you may know</h3>
           <span className="pi pi-ellipsis-h" style={{ display:"inline-block", margin:"0 10px", paddingRight:"10px" }}></span>
        </div>
        <div ref={carouselRef} className="carousel-container">
          {!loader ? users.map(item=>{
            return (
              <div key={item.pk} className="contentDiv">
                <div style={{ height:"70%", borderRadius:"10px 10px 0 0", width:"100%", backgroundImage:`url(${item.avatar})`, backgroundSize:"cover", backgroundRepeat:"none", objectFit:"cover" }}></div>
                <div className="relateContent">
                 <p>{item.first_name} {item.last_name}</p>
                 <Button onClick={()=>goToProfile(item)} iconPos="left" icon="pi pi-user-plus" className="add friend" label="View Profile" />
                </div>
              </div>
            )
          }) : (
            Array.from(new Array(3)).map(item=>{
              return (
                <div key={item} className="contentDiv flex mb-3">
                  <Skeleton width="100%" height="70%" className="mb-2"></Skeleton>
                  <Skeleton shape="rectangle" width="70%" height="15px" className="skele-text" ></Skeleton>
                  <Skeleton shape="rectangle" width="50%" height="30px" className="skele-text" ></Skeleton>
                </div>
              )
            })

          )}
        </div>
        <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={prevSlide} className={prev ? "previous" : "hideControls"}>&#10094;</span>
        {users.length <= 3 ? null : <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={nextSlide} className={next ? "next" : "hideControls"}>&#10095;</span>}
      </div>
    </Content>
  );
}

export default Suggestions;
