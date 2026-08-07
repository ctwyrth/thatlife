// Static About page linked from the Main sidebar section.
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
   return (
      <div className="flex flex-col items-start max-w-2xl mx-auto mt-10 px-4 pb-16 text-gray-900 dark:text-gray-100">
         <h1 className="text-4xl font-bold mb-4">About thatLife</h1>
         <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            thatLife is a Pinterest-style photo board for sharing inspiration across comics, cosplay, gaming, film, books, and more.
         </p>
         <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Browse as a guest, or sign in with Google to create pins, save posts, and leave comments. Themes and profile preferences sync when you are signed in.
         </p>
         <Link
            to="/"
            className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-5 py-2 font-semibold"
         >
            Back to feed
         </Link>
      </div>
   );
};

export default About;
