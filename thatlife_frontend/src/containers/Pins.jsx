// Pin routes shell — light gray-50 / dark gray-800 canvas (cards stay gray-900 in dark).
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { NavBar, Feed, PinDetail, CreatePin, Search } from '../components';

const Pins = ({ user }) => {
   const [searchTerm, setSearchTerm] = useState('');

   return (
      <div className="px-2 md:px-5 min-h-full bg-gray-50 dark:bg-gray-800">
         <div>
            <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
         </div>
         <div className="h-full">
            <Routes>
               <Route path="/" element={<Feed />} />
               <Route path="/category/:categoryId" element={<Feed />} />
               <Route path="/pin-detail/:pinId" element={<PinDetail user={user} />} />
               <Route path="/create-pin" element={<CreatePin user={user} />} />
               <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
            </Routes>
         </div>
      </div>
   )
}

export default Pins;