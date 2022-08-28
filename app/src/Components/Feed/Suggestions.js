import React, { useState, useRef, useEffect } from "react";
import { Layout } from "antd"
import Tom from "../../Images/tom.jpg";
import { Button } from "primereact/button";
import { accountsApi } from "../../services/accounts/accounts.service";


const Suggestions = props => {
  const [users, setUsers] = useState([])
  const { Content } = Layout;
  const [start, setStart] = useState(0);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(true);
  const carouselRef = useRef()
  const step = 395;

  useEffect(()=>{
    accountsApi.getUsers().then(resp=> {
      setUsers(resp);
    })
  },[])

  const requestFriend = (pk) => {
    accountsApi.friendRequest(pk).then(resp=> {
      console.log(resp);
    })
  }

  const nextSlide = (event) => {
    setPrev(true)
    if(start < 145) {
      setStart(start + 145);
      carouselRef.current.style.transform = `translateX(-${145}px)`;
      carouselRef.current.style.transition = "all 0.5s ease-in-out";
    } else if(start === 1330){
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
    if(start === 1475 || start === 145){
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



  useEffect(()=>{
    if(start === 1475) setNext(false);
    if(start === 0) setPrev(false);
  },[start])

  return (
    <Content>
      <div className="related">
        <div className="headTagger">
           <h3>People you may know</h3>
           <span className="pi pi-ellipsis-h" style={{ display:"inline-block", margin:"0 10px", paddingRight:"10px" }}></span>
        </div>
        <div ref={carouselRef} className="carousel-container">
          {users.map(item=>{
            return (
              <div key={item.pk} className="contentDiv">
                <div style={{ height:"70%", borderRadius:"10px 10px 0 0", width:"100%", backgroundImage:`url(${item.avatar})`, backgroundSize:"cover", backgroundRepeat:"none", objectFit:"cover" }}></div>
                <div className="relateContent">
                 <p>{item.first_name} {item.last_name}</p>
                 <Button onClick={()=>requestFriend(item.pk)} iconPos="left" icon="pi pi-user-plus" className="add friend" label="Add Friend" />
                </div>
              </div>
            )
          })}
        </div>
        <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={prevSlide} className={prev ? "previous" : "hideControls"}>&#10094;</span>
        <span onMouseDown={handlePress} onMouseUp={handleRelease} onClick={nextSlide} className={next ? "next" : "hideControls"}>&#10095;</span>
      </div>
    </Content>
  );
}

export default Suggestions;
