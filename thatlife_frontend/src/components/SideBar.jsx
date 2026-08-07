// Sectioned sidebar: Main / Discover / Account; desktop icons-only collapse.
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { MdInfoOutline, MdMenuOpen, MdMenu } from 'react-icons/md';

import logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black dark:border-white text-gray-900 dark:text-white transition-all duration-200 ease-in-out capitalize';
const isNotActiveCollapsed = 'flex items-center justify-center py-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 ease-in-out';
const isActiveCollapsed = 'flex items-center justify-center py-2 font-extrabold border-r-2 border-black dark:border-white text-gray-900 dark:text-white transition-all duration-200 ease-in-out';

const sectionLabel = 'mt-4 mb-1 px-5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500';

const SideBar = ({ user, closeToggle, collapsed = false, onToggleCollapse }) => {
   const handleCloseSidebar = () => {
      if (closeToggle) closeToggle(false);
   };

   const linkClass = ({ isActive }) => {
      if (collapsed) return isActive ? isActiveCollapsed : isNotActiveCollapsed;
      return isActive ? isActiveStyle : isNotActiveStyle;
   };

   return (
      <div
         className={`flex flex-col justify-between bg-white dark:bg-gray-900 h-full overflow-y-scroll hide-scrollbar text-gray-900 dark:text-gray-100 transition-[width,min-width] duration-200 ease-in-out ${
            collapsed ? 'w-16 min-w-16' : 'min-w-210 w-210'
         }`}
      >
         <div className="flex flex-col">
            <div className={`flex items-center my-4 pt-1 ${collapsed ? 'flex-col gap-2 px-1' : 'px-3 gap-2'}`}>
               <Link
                  to="/"
                  className={`flex items-center ${collapsed ? 'justify-center w-full' : 'w-190 mx-auto'}`}
                  onClick={handleCloseSidebar}
                  title="Home"
               >
                  <img
                     src={logo}
                     alt="thatlife logo"
                     className={`dark:invert ${collapsed ? 'w-8 h-8 object-contain' : 'w-full'}`}
                  />
               </Link>
               {onToggleCollapse && (
                  <button
                     type="button"
                     onClick={onToggleCollapse}
                     className={`p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        collapsed ? '' : 'ml-auto'
                     }`}
                     aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                     title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                     {collapsed ? <MdMenu fontSize={22} /> : <MdMenuOpen fontSize={22} />}
                  </button>
               )}
            </div>

            <div className={`flex flex-col ${collapsed ? 'gap-1' : 'gap-1'}`}>
               {!collapsed && <h3 className={sectionLabel}>Main</h3>}
               <NavLink to="/" end className={linkClass} onClick={handleCloseSidebar} title="Home">
                  <RiHomeFill className="w-5 h-5 shrink-0" />
                  {!collapsed && 'Home'}
               </NavLink>
               <NavLink to="/about" className={linkClass} onClick={handleCloseSidebar} title="About">
                  <MdInfoOutline className="w-5 h-5 shrink-0" />
                  {!collapsed && 'About'}
               </NavLink>

               {!collapsed && <h3 className={sectionLabel}>Discover</h3>}
               {collapsed && <div className="my-2 border-t border-gray-200 dark:border-gray-700 mx-2" aria-hidden />}
               {categories.slice(0, categories.length - 1).map((category) => {
                  const Icon = category.icon;
                  return (
                     <NavLink
                        to={`/category/${category.name}`}
                        className={linkClass}
                        onClick={handleCloseSidebar}
                        key={category.name}
                        title={category.name}
                     >
                        <Icon className="w-5 h-5 shrink-0" aria-hidden />
                        {!collapsed && category.name}
                     </NavLink>
                  );
               })}
            </div>
         </div>

         <div className={collapsed ? 'px-1 mb-3' : ''}>
            {!collapsed && <h3 className={sectionLabel}>Account</h3>}
            {user ? (
               <Link
                  to={`/user-profile/${user._id}`}
                  className={`flex my-3 gap-2 p-2 items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg ${
                     collapsed ? 'mx-1 justify-center' : 'mx-3'
                  }`}
                  onClick={handleCloseSidebar}
                  title={user.userName}
               >
                  <img src={user.image} alt="user avatar" className="w-10 h-10 rounded-lg shrink-0" referrerPolicy="no-referrer" />
                  {!collapsed && <p className="truncate">{user.userName}</p>}
               </Link>
            ) : (
               <Link
                  to="/login"
                  className={`flex my-3 items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-lg font-semibold ${
                     collapsed ? 'mx-1 px-1 py-2 text-xs' : 'mx-3 px-4 py-2'
                  }`}
                  onClick={handleCloseSidebar}
                  title="Sign in"
               >
                  {collapsed ? 'In' : 'Sign in'}
               </Link>
            )}
         </div>
      </div>
   );
};

export default SideBar;
