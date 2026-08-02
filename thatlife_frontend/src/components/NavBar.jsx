// Top search bar; guests can search, signed-in users can create pins.
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const NavBar = ({ searchTerm, setSearchTerm, user }) => {
   const navigate = useNavigate();

   return (
      <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
         <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
            <IoMdSearch fontSize={21} className="ml-1" />
            <input type="text" name="search" id="search" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." value={searchTerm} onFocus={() => navigate('/search')} className="p-2 w-full bg-white outline-none" />
         </div>
         <div className="flex gap-3 items-center">
            {user ? (
               <>
                  <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                     <img src={user.image} alt="user avatar" className="w-14 h-12 rounded-lg" referrerPolicy="no-referrer" />
                  </Link>
                  <Link to='create-pin' className="bg-black text-white rounded-lg w-12 h-12 md:h-12 md:w-14 flex items-center justify-center">
                     <IoMdAdd />
                  </Link>
               </>
            ) : (
               <Link to="/login" className="bg-black text-white rounded-lg px-4 h-12 flex items-center justify-center text-sm font-semibold whitespace-nowrap">
                  Sign in
               </Link>
            )}
         </div>
      </div>
   )
}

export default NavBar;
