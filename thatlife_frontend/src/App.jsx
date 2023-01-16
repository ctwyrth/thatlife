import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Home from './containers/Home';

const App = () => {
   
   return (
      <Routes>
         <Route path="login" element={<Login />} />
         <Route path="/*" element={<CheckUser />} />
      </Routes>
   )
}

function CheckUser() {
   const navigate = useNavigate();

   console.log(localStorage.getItem('user') === null);

   if (localStorage.getItem('user') === null) {
      useEffect(() => {
         navigate('login');
      }, [])
   }
   return <Home />;
}

export default App;
