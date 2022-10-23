import React, { useEffect, useRef, useState } from 'react'
import LoginWrapper from "../../Common/LoginWrapper";
import { Layout } from 'antd';
import { Button } from "primereact/button";
import { useParams, Link } from "react-router-dom";
import { accountsApi } from "../../services/accounts/accounts.service";
import { Base64 } from "js-base64";
import toast, { Toaster } from "react-hot-toast";
import { Toast } from "primereact/toast";

const Activation = props => {
  const [user, setUser] = useState({})
  const { token, id } = useParams()
  const mytoast = useRef(null);
  const [loader, setLoader] = useState(false)
  const [mypk, setPK] = useState(null);

  useEffect(()=>{
    let uid = Base64.atob(id)
    accountsApi.fetchAuthUser(uid).then(resp=> {
        setUser(resp)
    }).catch(err=> console.log(err))

  },[token, id])

  const activateAccount = ()=> {
    let uid = Base64.atob(id);
    setLoader(true)
    accountsApi.activateAccount(uid, token).then(resp=>{
      setLoader(false)
      if(resp.pk){
        mytoast.current.show({severity:'success', summary: 'Activation Successful', detail:'Your account was successfully activated!', life: 3000});
        setPK(resp.pk)
        return;
      }
      throw "There was a problem activating your account."
    }).catch(error=>{
      setLoader(false)
      mytoast.current.show({severity:'error', summary: 'Activation Error', detail:'We encountered a problem trying to activate your account', life: 3000})
    })

  }


  const { Content } = Layout;

  return (
    <LoginWrapper>
      <Toaster />
      <Toast ref={mytoast}/>
      <Content className="loginWrapper">
        <section className="loginSection">
          <div>
             <h1>Hello {user.first_name} {user.last_name}</h1>
             <h2>Congratulations on creating an account</h2>
             <div>
               <p>In order to effectively use our application, you need to activate your account.
                 To activate your account, click the button below
               </p>
               <div className="activateBtn">
                <Button style={{ display:"block"}} loading={loader} loadingIcon="pi pi-spin" onClick={activateAccount} label='Activate Account' role={"button"} />
                <Link style={{ display:"block" }} to={"/account/login"}>Go to login</Link>
               </div>
             </div>
          </div>
        </section>
      </Content>
    </LoginWrapper>
  );
}

export default Activation;
