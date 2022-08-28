import React, { useState } from "react";
import LoginWrapper from "../../Common/LoginWrapper";
import { Layout, Row, Col } from "antd";
import { Button } from "primereact/button";
import { registerUser } from "../../redux/actionDispatch";
import { connect } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const Signup = props => {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email:"",
    password:"",
    username:""
  })

  const changeUsername = event => setCredentials({ ...credentials, username: event.target.value });
  const changeFirstname = event => setCredentials({ ...credentials, first_name: event.target.value });
  const changeLastname = event => setCredentials({ ...credentials, last_name: event.target.value });
  const changeEmail = event => setCredentials({ ...credentials, email: event.target.value });
  const changePassword = event => setCredentials({ ...credentials, password: event.target.value });

  const { Content } = Layout;

  const handleSubmitCredentials = event => {
    event.preventDefault();
    toast.promise(props.registerUser(credentials), {
      loading: "Signing you up...",
      success: (data)=> {
        return "Sign up was successful.Check your email for an activation link"
      },
      error: (error)=> {
        return "Error! There was an error, please try again!"
      }
    })
  }

  return (
      <LoginWrapper>
        <Toaster />
        <Content className="loginWrapper">
          <section className="loginSection">
             <form onSubmit={handleSubmitCredentials}>
             <Row gutter={[16, 16]} className="loginRow">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <h1>Sign Up to <strong>Exo</strong></h1>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <div className="inputDiv">
                        <label htmlFor="email">Email:</label>
                        <input onChange={changeEmail} className="signupInput" type={"email"} name="email" placeholder="Enter your email" value={credentials.email} />
                      </div>
                      <div className="inputDiv">
                        <label htmlFor="firstname">Firstname:</label>
                        <input onChange={changeFirstname} className="signupInput" type={"text"} name="firstname" placeholder="Enter your firstname" value={credentials.first_name}/>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <div className="inputDiv">
                        <label htmlFor="password">Password:</label>
                        <input onChange={changePassword} className="signupInput" type={"password"} name="password" placeholder="Enter your password" value={credentials.password}/>
                      </div>
                      <div className="inputDiv">
                        <label htmlFor="lastname">Lastname:</label>
                        <input onChange={changeLastname} className="signupInput" type={"text"} name="lastname" placeholder="Enter your lastname" value={credentials.last_name}/>
                      </div>
                    </Col>
                  </Row>
                  <div className="inputDiv">
                      <label htmlFor="username">Username:</label>
                      <input onChange={changeUsername} className="signupInput" type="text" name="username" placeholder="Enter your username" value={credentials.username}/>
                  </div>
                </Col>
             </Row>
             <Button className="signupBtn" label="Sign up" role={"submit"} />
             </form>
          </section>
        </Content>
      </LoginWrapper>
  )
}

const mapDispatchToProps = {
  registerUser
}


export default connect(null, mapDispatchToProps)(Signup);
