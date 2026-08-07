// Home shell: collapsible sidebar + routes; applies Sanity user.theme for dark mode.
import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile, About } from '../components';
import { client } from '../client';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logo-white.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';
import { applyTheme } from '../utils/theme';

const SIDEBAR_COLLAPSED_KEY = 'thatlife-sidebar-collapsed';

const Home = () => {
   const [toggleSidebar, setToggleSidebar] = useState(false);
   const [user, setUser] = useState(null);
   const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
      try {
         return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
      } catch {
         return false;
      }
   });
   const scrollRef = useRef(null);

   const userInfo = fetchUser();

   useEffect(() => {
      if (!userInfo?.sub) return;

      const query = userQuery(userInfo.sub);

      client.fetch(query)
         .then((data) => {
            setUser(data[0]);
            if (data[0]?.theme === 'light' || data[0]?.theme === 'dark') {
               applyTheme(data[0].theme);
            }
         })
   }, [])

   useEffect(() => {
      scrollRef.current.scrollTo(0, 0);
   }, [])

   const handleToggleCollapse = () => {
      setSidebarCollapsed((prev) => {
         const next = !prev;
         try {
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
         } catch {
            /* ignore quota / private mode */
         }
         return next;
      });
   };

   return (
      <div className="flex bg-gray-50 dark:bg-gray-800 md:flex-row flex-col h-screen transaction-height duration-75 ease-out text-gray-900 dark:text-gray-100">
         <div className="hidden md:flex h-screen flex-initial">
            <Sidebar
               user={user && user}
               collapsed={sidebarCollapsed}
               onToggleCollapse={handleToggleCollapse}
            />
         </div>
         <div className="flex md:hidden flex-row">
            <div className="p-2 w-full flex flex-row justify-between items-center shadow-md bg-white dark:bg-gray-900">
               <HiMenu fontSize={40} className="cursor-pointer text-gray-900 dark:text-gray-100" onClick={() => setToggleSidebar(true)} />
               <Link to="/">
                  <img src={logo} alt="logo" className="w-36 dark:hidden" />
                  <img src={logoWhite} alt="logo" className="w-36 hidden dark:block" />
               </Link>
               <Link to={`user-profile/${user?._id}`}>
                  <img src={user?.image} alt="user avatar" className="w-12 h-12 rounded-lg" referrerPolicy="no-referrer" />
               </Link>
            </div>
            {toggleSidebar && (
               <div className="fixed w-4/5 bg-white dark:bg-gray-900 h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                  <div className="absolute w-full flex justify-end items-center p-2">
                     <AiFillCloseCircle fontSize={30} className="cursor-pointer text-gray-900 dark:text-gray-100" onClick={() => setToggleSidebar(false)} />
                  </div>
                  <Sidebar user={user && user} closeToggle={setToggleSidebar} />
               </div>
            )}
         </div>
         <div className="pb-2 flex-1 h-screen overflow-y-scroll bg-gray-50 dark:bg-gray-800" ref={scrollRef}>
            <Routes>
               <Route path="/user-profile/:userId" element={<UserProfile />} />
               <Route path="/about" element={<About />} />
               <Route path="/*" element={<Pins user={user && user} />} />
            </Routes>
         </div>
      </div>
   )
}

export default Home;
