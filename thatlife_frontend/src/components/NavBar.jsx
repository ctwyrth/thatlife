// Top search bar + theme toggle (localStorage + optional Sanity user.theme patch).
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoMdMoon, IoMdSunny } from 'react-icons/io';
import { toggleTheme, getStoredTheme, } from '../utils/theme';
import { client } from '../client';

const NavBar = ({ searchTerm, setSearchTerm, user }) => {
   const navigate = useNavigate();
   const [theme, setTheme] = useState(() => getStoredTheme());

   const handleThemeToggle = () => {
      const newTheme = toggleTheme();
      setTheme(newTheme);

      if (user?._id) {
         client.patch(user._id)
         .set({ theme: newTheme})
         .commit()
         .catch(() => {
            // ignore local theme applied already
         });
      }
   };
   
   return (
      <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
         <div className="flex justify-start items-center w-full px-2 rounded-md bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 outline-none focus-within:shadow-sm">
            <IoMdSearch fontSize={21} className="ml-1 text-gray-600 dark:text-gray-300" />
            <input type="text" name="search" id="search" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." value={searchTerm} onFocus={() => navigate('/search')} className="p-2 w-full bg-white dark:bg-gray-800 outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400" />
         </div>
         <div className="flex gap-3 items-center">
            {user ? (
               <>
                  <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                     <img src={user.image} alt="user avatar" className="w-14 h-12 rounded-lg" referrerPolicy="no-referrer" />
                  </Link>
                  <Link to='create-pin' className="bg-black dark:bg-white text-white dark:text-black rounded-lg w-12 h-12 md:h-12 md:w-14 flex items-center justify-center">
                     <IoMdAdd />
                  </Link>
               </>
            ) : (
               <>
                  <Link to="/login" className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-4 h-12 flex items-center justify-center text-sm font-semibold whitespace-nowrap">
                     Sign in
                  </Link>
               </>
            )}
            <button type="button" onClick={handleThemeToggle} aria-label="Toggle color theme" className="bg-black dark:bg-white text-white dark:text-black rounded-lg w-12 h-12 md:h-12 md:w-14 flex items-center justify-center">
               {theme === 'dark' ? <IoMdMoon /> : <IoMdSunny />}
            </button>
         </div>
      </div>
   )
}

export default NavBar;
