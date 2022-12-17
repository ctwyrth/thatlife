import React, { useState } from 'react';
import { useNavigate, useSubmit } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

const CreatePin = ({ user }) => {
   const [title, setTitle] = useState('');
   const [about, setAbout] = useState('');
   const [destination, setDestination] = useState('');
   const [loading, setLoading] = useState(false);
   const [fields, setFields] = useState(false);
   const [category, setCategory] = useState(null);
   const [imageAsset, setImageAsset] = useState(null);
   const [wrongImageType, setWrongImageType] = useState(false);

   const navigate = useNavigate();

   const uploadImage = (e) => {
      const { type, name } = e.target.files[0];

      if (type === 'image/png' || type === 'image/svg' || type === 'image/jpg' || type === 'image/gif') {
         setWrongImageType(false);
         setLoading(true);

         client.assets
            .upload('image', e.target.files[0], { contentType: type, filename: name })
            .then((document) => {
               setImageAsset(document);
               setLoading(false);
            })
            .catch((error) => {
               console.log('Image upload error ', error);
            })
      } else {
         setWrongImageType(true);
      }
   }

   return (
      <div className="flex flex-col justify-center items-center mt-5 lg:4/5">
         {fields && (
            <p className="text-red-500 mb-5 text-xl transition-duration-150 ease-in">Please fill in all the fields.</p>
         )}
         <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
            <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
               <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                  {loading && <Spinner />}
                  {wrongImageType && <p>That image type is not supported.</p>}
                  {!imageAsset ? (
                     <label htmlFor="">
                        <div className="flex flex-col items-center justify-center h-full">
                           <div className="flex flex-col justify-center items-center">
                              <p className="font-bold text-2xl">
                                 <AiOutlineCloudUpload />
                              </p>
                              <p className="text-lg mt-2">Click to upload an image.</p>
                           </div>
                           <p className="mt-32 text-gray-400">Use a high-quality JPG, SVG, PNG, or GIF, that is less than 20MB in size.
                           </p>
                        </div>
                        <input type="file" name="upload-image" id="upload-image" onChange={uploadImage} className="w-0 h-0" />
                     </label>
                  ) : (
                     <p>something else</p>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default CreatePin;