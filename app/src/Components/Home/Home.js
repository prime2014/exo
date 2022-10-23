import React from "react";
import Navbar from "../../Common/LandingPageNavbar";
import TweenOne from "rc-tween-one";
import 'rc-texty/assets/index.css';
import AboutImg from "../../Images/about-us.jfif";
import John from "../../Images/johnRooster.jfif";
import Tom from "../../Images/tomSharp.jfif";
import Winston from "../../Images/winstonHodson.jfif";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsPieChartFill,
  BsClockFill,
  BsPatchCheck,
  BsBriefcaseFill,
  BsCloudCheckFill
} from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Row, Col, Layout, Carousel, Form, Input } from "antd";
import { Link, Navigate } from "react-router-dom";
import CountUp from "react-countup";
import { Toaster } from "react-hot-toast";
import { connect } from "react-redux";
import Footer from "../../Common/Footer";



class Home extends React.Component {


    goToSignup = event => {
      return <Navigate to={"/account/signup"} />;
    }

    goTologin = event => {
      return <Navigate to={"/account/login"} />
    }


    render(){
      const { TextArea } = Input;
      const { Content } = Layout;
        return(
            <div>

                <Navbar>
                  <Toaster />
                   <div className="bannerImg">

                     <TweenOne className="bannerTextContent"
                        animation={{ y: 120, opacity: 0, type: 'from', delay: 800 }}
                     >
                        <h1 style={{ color:"#fff" }}>Get On Board</h1>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam assumenda ea quo cupiditate facere deleniti fuga officia</p>
                       <div className="actionBtns">
                         <button onClick={this.goToSignup}>SIGN UP</button>
                         <button onClick={this.goTologin}>LOGIN</button>
                       </div>
                       </TweenOne>
                   </div>
                   <section className="lowerSection">
                   <div>
                    <div className="aboutUsSection">
                          <img src={AboutImg} alt="about-us" className="aboutUs" />

                          <div>
                            <h4 className="companyTitle">Laytext Company</h4>

                            <h2>About Us</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui fuga ipsa, repellat blanditiis nihil, consectetur.
                              Consequuntur eum inventore, rem maxime, nisi excepturi ipsam libero ratione adipisci alias eius vero vel!</p>

                            <button>Learn More</button>
                          </div>
                    </div>

                    <div className="myTeam">
                        <h2>Team</h2>
                        <h1>Leadership</h1>

                        <div className="teamSection">
                          <div>
                            <img className="staff" src={John} alt="team" />
                            <h3>John Rooster</h3>
                            <h4>CO-FOUNDER, PRESIDENT</h4>
                            <p>
                              Nisi at consequatur unde molestiae quidem provident voluptatum deleniti quo iste error eos est
                              praesentium distinctio cupiditate tempore suscipit inventore deserunt tenetur.
                            </p>
                            <ul className="iconLinks">
                              <li><BsFacebook /></li>
                              <li><AiFillTwitterCircle /></li>
                              <li><BsInstagram /></li>
                              <li><BsLinkedin /></li>
                            </ul>
                          </div>
                          <div>
                            <img className="staff" src={Tom} alt="team" />
                            <h3>Tom Sharp</h3>
                            <h4>CO-FOUNDER, CEO</h4>
                            <p>
                              Nisi at consequatur unde molestiae quidem provident voluptatum deleniti quo iste error eos est
                              praesentium distinctio cupiditate tempore suscipit inventore deserunt tenetur.
                            </p>
                            <ul className="iconLinks">
                              <li><BsFacebook /></li>
                              <li><AiFillTwitterCircle /></li>
                              <li><BsInstagram /></li>
                              <li><BsLinkedin /></li>
                            </ul>
                          </div>
                          <div>
                            <img className="staff" src={Winston} alt="team" />
                            <h3>Wisnton Hodson</h3>
                            <h4>MARKETING</h4>
                            <p>
                              Nisi at consequatur unde molestiae quidem provident voluptatum deleniti quo iste error eos est
                              praesentium distinctio cupiditate tempore suscipit inventore deserunt tenetur.
                            </p>
                            <ul className="iconLinks">
                              <li><BsFacebook /></li>
                              <li><AiFillTwitterCircle /></li>
                              <li><BsInstagram /></li>
                              <li><BsLinkedin /></li>
                            </ul>
                          </div>
                        </div>
                    </div>
                    <div className="servicesWrap">
                      <div className="services">
                          <h2>Our Services</h2>
                          <h1>We Offer Services</h1>

                          <Content style={{ margin:"40px 0" }} className="content">
                          <Row align="top" gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                  <span className="iconService"><BsPieChartFill style={{ marginRight:"30px", fontSize:"40px"}} /></span>
                                  <div className="contentHeads">
                                      <h3>Business Consulting</h3>
                                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                      <Link to="services">Learn More</Link>
                                  </div>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                    <span className="iconService"><RiDeleteBack2Fill style={{ marginRight:"30px", fontSize:"40px"}}/></span>
                                    <div className="contentHeads">
                                      <h3>Market Analysis</h3>
                                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                      <Link to="services">Learn More</Link>

                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                  <span className="iconService"><BsClockFill style={{ marginRight:"30px", fontSize:"40px"}}/></span>
                                  <div className="contentHeads">
                                    <h3>User Monitoring</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                    <Link to="services">Learn More</Link>

                                  </div>
                                </Col>
                            </Row>


                            <Row align="top" gutter={[16, 16]} className="serviceRows">
                                <Col flex={1} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                  <span className="iconService"><BsPatchCheck style={{ marginRight:"30px", fontSize:"40px"}}/></span>
                                  <div className="contentHeads">
                                      <h3>Seller Consulting</h3>
                                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                      <Link to="services">Learn More</Link>

                                  </div>
                                </Col>
                                <Col flex={1} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                    <span className="iconService"><BsBriefcaseFill style={{ marginRight:"30px", fontSize:"40px"}}/></span>
                                    <div className="contentHeads">
                                      <h3>Advertising</h3>
                                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                      <Link to="services">Learn More</Link>
                                    </div>
                                </Col>
                                <Col flex={1} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ display:"flex", alignItems:"flex-start" }}>
                                  <span className="iconService"><BsCloudCheckFill style={{ marginRight:"30px", fontSize:"40px"}}/></span>
                                  <div className="contentHeads">
                                    <h3>Business Pages</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quis molestiae vitae eligendi at.</p>
                                    <Link to="services">Learn More</Link>

                                  </div>
                                </Col>
                            </Row>
                          </Content>
                      </div>
                    </div>

                    <div className="services">
                          <h2>People Say</h2>
                          <h1>Testimonials</h1>

                          <Content>
                            <Carousel dotPosition="bottom" dots={true} autoplay autoplaySpeed={5000}>
                                <div className="testimonials">
                                  <div>
                                  <img src={John} alt="testimonials" />
                                  </div>
                                  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat"</p>
                                    <span>Kylie McDonald</span>
                                </div>
                                <div className="testimonials">
                                  <div><img src={Tom} alt="testimonials" /></div>
                                  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat"</p>
                                    <span>William Ribosh</span>
                                </div>
                                <div className="testimonials">
                                  <div>
                                  <img src={Winston} alt="testimonials" />
                                  </div>
                                  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat"</p>
                                  <span>Pete Davidson</span>
                                </div>
                            </Carousel>
                          </Content>
                    </div>
                   </div>
                   </section>
                   <div className="marketing">
                      <div>
                        <h1>Marketing</h1>

                        <CountUp
                          start={0}
                          end={1000000}
                          duration={2.75}
                          separator=" "
                          decimal=","
                          prefix="Over "
                          suffix="+"
                          onEnd={() => console.log('Ended! 👏')}
                          onStart={() => console.log('Started! 💨')}
                        ></CountUp>
                        <p style={{ fontSize:"30px" }}>Downloads</p>
                      </div>
                   </div>
                   <section className="contact">
                      <div className="contactSection">
                        <h2>Contact Form</h2>
                        <h1>Get In Touch</h1>
                      </div>

                      <form onSubmit={(event)=>event.stopPropagation()} className="contactForm">
                        <h1>Contact Form</h1>

                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item style={{ display:"flex", flexDirection:"column" }} labelAlign="left" colon={false} label="First Name" name={"firstName"}>
                              <Input className="contactInput" type="text" name="firstName" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item style={{ display:"flex", flexDirection:"column" }} labelAlign="left" colon={false} label="Last Name" name={"lastName"}>
                              <Input className="contactInput" type="text" name="lastName" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item style={{ display:"flex", flexDirection:"column" }} labelAlign="left" colon={false} label="Email" name={"email"}>
                              <Input className="contactInput" type="email" name="email" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item style={{ display:"flex", flexDirection:"column" }} labelAlign="left" colon={false} label="Subject" name={"subject"}>
                              <Input className="contactInput" type="text" name="subject" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item style={{ display:"flex", flexDirection:"column" }} labelAlign="left" colon={false} label="Message" name={"message"}>
                              <TextArea cols={10} rows={7} className="contactInput"></TextArea>
                            </Form.Item>
                          </Col>
                        </Row>
                        <div>
                          <button>SEND MESSAGE</button>
                        </div>
                      </form>
                   </section>
                </Navbar>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps, null)(Home);
