import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import shareVideo from '../assets/video.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
   const navigate = useNavigate();

   const responseGoogle = (response) => {
      let userObject = jwt_decode(response.credential);

      localStorage.setItem('user', JSON.stringify(userObject));
      const { name, sub, picture } = userObject;
      
      const doc = {
         _id: sub,
         _type: 'user',
         userName: name,
         image: picture,
      }

      client.createIfNotExists(doc)
         .then(() => {
            navigate('/', { replace: true });
         })
   }

   return (
      <div className="flex justify-start item-center flex-col h-screen">
         <div className="relative w-full h-full">
            <video 
               src={shareVideo}
               type="video/mp4"
               loop
               controls={false}
               muted
               autoPlay
               className="w-full h-full object-cover"
            />
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
               <div className="p-5">
                  <img src={logo} width="200px" alt="thatlife logo" />
               </div>
               <div className="shadow-2xl">
                  <GoogleLogin
                     type="standard"
                     theme="filled_black"
                     size="large"
                     shape="pill"
                     onSuccess={responseGoogle}
                     onError={() => {
                        console.log('Login Failed');
                     }}
                     cookiePolicy="single_host_origin"
                  />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Login;