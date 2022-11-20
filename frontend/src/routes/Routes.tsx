import { useReactiveVar } from '@apollo/client'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbarmenu from '../components/shared/layout/header/Navbarmenu';
import { getFeatureToggleByChainId } from '../featureToggle'
import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { Page404 } from '../pages/Page404'
import {AppContext} from '../contexts';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignupPage = lazy(() => import('../pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'))
const ProfileCollectedPage = lazy(() => import('../pages/ProfileCollectedPage'))

export default function Routes() {
  const chainId = useReactiveVar(chainIdVar)
  const featureToggle = getFeatureToggleByChainId(chainId)
  const [theme, setTheme] = useState({theme: localStorage.getItem('theme')})

  useEffect(() => {
    if (theme.theme === 'dark') {
      themeVar(ThemeProviderEnum.dark)
    } else {
      themeVar(ThemeProviderEnum.light)
    }
  }, [theme])

  const [user, setUser] = useState({
    authenticated: false,
    username: "", 
    password: "",
    email: "",
    exp: 0,
    first_name: "",
    last_name: "",
    phone: "",
    private_key: "",
    public_key: "",
    profile_cover: "",
    profile_image: "",
    paypal: "",
    role: 2,
    status: ""
  });

  useEffect(()=>{
    const cookies = new Cookies();
    if(cookies.get('token')){
      cookies.set('token', cookies.get('token'));
      if(user.authenticated) return;
      let userdata = jwt(cookies.get('token'));      
      setUser({
        authenticated: true,
        username: userdata["username"],
        password: userdata["password"],
        email: userdata["email"],
        exp: userdata["exp"],
        first_name: userdata["first_name"],
        last_name: userdata["last_name"],
        phone: userdata["phone"],
        private_key: userdata["private_key"],
        public_key: userdata["public_key"],
        profile_cover: userdata["profile_cover"],
        profile_image: userdata["profile_image"],
        paypal: userdata["paypal"],
        role: userdata["role"],
        status: userdata["status"]
      })
    }
  },[])

  return (    
      <Suspense fallback={<Navbarmenu />}>
        <AppContext.Provider value={{user, setUser, theme, setTheme}}>
          <Switch>
            {!featureToggle?.page.marketplaceIntro && <Route path='/' exact component={LoginPage} />}
            <Route path='/main' exact component={ProfileCollectedPage} />
            <Route path='/login' exact component={LoginPage} />
            <Route path='/register' exact component={SignupPage} />
            <Route path='/forgot_password' exact component={ForgotPasswordPage} />
            <Route path='**' component={Page404} />
          </Switch>
        </AppContext.Provider>
      </Suspense>
  )
}
