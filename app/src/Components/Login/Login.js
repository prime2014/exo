import React, { useState, useEffect } from "react";
import LoginWrapper from "../../Common/LoginWrapper";
import { Layout, Row, Col } from "antd";
import LoginIMG from "../../Images/loginSVG.svg";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import Google from "../../Images/google.svg";
import Twitter from "../../Images/twitter.svg";
import Facebook from "../../Images/facebook.svg";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { loginUser } from "../../redux/actionDispatch";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";



const Login = props => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email:"",
    password:""
  })
  const [loader, setLoader] = useState(false)

  const { Content } = Layout;

  const showResponse = () => {

  }


  const handleEmail = event => setCredentials({ ...credentials, email:event.target.value });
  const handlePassword = event => setCredentials({ ...credentials, password:event.target.value });

  const handleLogin = (event) => {
    event.preventDefault();
    setLoader(true)
    toast.promise(props.loginUser(credentials), {
      loading: "Logging you in...",
      success: (data)=>{
        setLoader(false)
        if(data.token){
          const expires = new Date()
          expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14)
          cookie.save('exo_token', data.token, { path: '/', expires, maxAge: 12345678, domain:"127.0.0.1", sameSite:"lax"});
          navigate("/feed");
          return "Login successful!"
        }
        throw data;
      },
      error: (err)=>{
        setLoader(false)
        return "Invalid user credentials!";
      }
    }, {
        style: {
          borderRadius: "10px",
          color:"#fff",
          background:"#3bd4d4"
        }
    });
  }

  return (
    <LoginWrapper {...props}>
        <Toaster />
        <Content className="loginWrapper">
            <section className="loginSection">
                <Row justify={"space-around"} gutter={[16, 16]} className="loginRow">
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <h1>Sign In to <strong>Exo</strong></h1>
                    <p>Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>

                    <form onSubmit={handleLogin}>
                      <div>
                        <label htmlFor="email">Email</label>
                        <input onChange={handleEmail} id="email" required type="email" name="email" value={credentials.email} />
                      </div>
                      <div>
                        <label htmlFor="password">Password</label>
                        <input onChange={handlePassword} id="password" required type="password" name="password" value={credentials.password}/>
                      </div>
                      <div className="remind">
                        <span><Checkbox checked={true} /> Remember me</span>
                        <span>
                          <Link to="/account/reset/password">Forgot Password?</Link>
                        </span>
                      </div>

                      <div>
                        <Button icon="pi pi-sign-in" iconPos="left" loading={loader} loadingIcon="pi pi-sun" label="Log In"  className="loginBtn" />
                      </div>

                      <div>
                        or sign in with

                        <div>
                          <span>
                              <img src={Google} alt="google" width={50} height={50} />
                          </span>
                          <span>
                              <img src={Facebook} alt="google" width={50} height={50} />
                          </span>
                          <span>
                              <img src={Twitter} alt="google" width={50} height={50} />
                          </span>
                        </div>
                      </div>
                    </form>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <img src={LoginIMG} alt="login" className="sideImage" />
                  </Col>
                </Row>
            </section>
        </Content>
    </LoginWrapper>
  )
}

const mapDispatchToProps = {
  loginUser
}


export default connect(null, mapDispatchToProps)(Login);
