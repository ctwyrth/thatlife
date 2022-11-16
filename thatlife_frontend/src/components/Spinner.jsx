import React from 'react';
import { Circles, MutatingDots } from 'react-loader-spinner';

const Spinner = ({ message }) => {
   return (
      <div className="flex flex-col justify-center items-center w-full h-full">
         <MutatingDots height="120" width="120" color="#ed1c24" secondaryColor="#ed1c24" radius="14.5" ariaLabel="mutating-dots-loading" wrapperStyle={{}} wrapperClass="" visible={true} className="flex flex-col justify-center align-center" />
         <p className="text-lg text-center px-2">{message}</p>
      </div>
   )
}

export default Spinner;