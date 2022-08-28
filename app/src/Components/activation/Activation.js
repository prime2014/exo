import React, { useEffect, useState } from 'react'
import LoginWrapper from "../../Common/LoginWrapper";
import { Layout } from 'antd';
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { accountsApi } from "../../services/accounts/accounts.service";
import { Base64 } from "js-base64";
import toast, { Toaster } from "react-hot-toast";

const Activation = props => {
  const [user, setUser] = useState({})
  const { token, id } = useParams()
  useEffect(()=>{
    let uid = Base64.atob(id)
    accountsApi.fetchAuthUser(uid).then(resp=> {
        setUser(resp)
    }).catch(err=> console.log(err))

  },[token, id])

  const activateAccount = ()=> {
    let uid = Base64.atob(id);
    toast.promise(accountsApi.activateAccount(uid, token), {
      loading: "Activating your account...",
      success: (data)=>{
        if(data.pk) return "Your account was successfully activated";
        throw "There was a problem activating your account."
      },
      error: (error)=> {
        return error
      }
    }, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    })
  }

  const { Content } = Layout;

  return (
    <LoginWrapper>
      <Toaster />
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
                <Button onClick={activateAccount} label='Activate Account' role={"button"} />
               </div>
             </div>
          </div>
        </section>
      </Content>
    </LoginWrapper>
  );
}

export default Activation;
