import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { MdDownloadForOffline } from 'react-icons/md';

import { client, urlFor } from '../client';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';

const PinDetail = ({ user }) => {
   const [pins, setPins] = useState(null);
   const [pinDetails, setPinDetails] = useState(null);
   const [comment, setComment] = useState('');
   const [addingComment, setAddingComment] = useState(false);
   const { pinId } = useParams();

   const addComment = () => {
      if (comment) {
         setAddingComment(true);

         client
            .patch(pinId)
            .setIfMissing({ comments: [] })
            .insert('after', 'comments[-1]', [{
               comment,
               _key: uuidv4(),
               postedBy: {
                  _type: 'postedBy',
                  _ref: user._id
               }
            }])
            .commit()
            .then(() => {
               console.log("immediately after the commit");
               fetchPinDetails();
               setComment('');
               setAddingComment(false);
            });
      }
   }
   
   const fetchPinDetails = () => {
      let query = pinDetailQuery(pinId);

      if (query) {
         client.fetch(query)
            .then((data) => {
               setPinDetails(data[0]);

               if (data[0]) {
                  console.log("getting similar pins")
                  query = pinDetailMorePinQuery(data[0]);
                  
                  client.fetch(query)
                  .then((res) => {
                        setPins(res);
                     });
               }
            })
      }
   }

   useEffect(() => {
      fetchPinDetails();
   }, [pinId])
   
   if (!pinDetails) return <Spinner message="Loading pin..." />
   
   return (
      // pinned image and posting information
      <>
         <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            <div className="flex justify-center items-center md:item-start flex-initial">
               <img src={pinDetails?.image && urlFor(pinDetails.image).url()} alt="user-post" className="rounded-t-3xl" />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
         {/* image */}
               <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                     <a href={`${pinDetails.image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()} className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
                        <MdDownloadForOffline className="w-7 h-7" />
                     </a>
                  </div>
                  <a href={pinDetails.destination} target="_blank" rel="noreferrer">{pinDetails.destination}</a>
               </div>
               <div>
                  <h1 className="text-4xl font-bold break-words mt-3">{pinDetails.title}</h1>
                  <p className="mt-2 ml-2">{pinDetails.about}</p>
               </div>
         {/* posted by */}
               <Link to={`/user-profile/${pinDetails.postedBy?._id}`} className="flex gap-2 my-6 items-center bg-white rounded-lg">
                  <img src={pinDetails.postedBy?.image} alt="user avatar" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer"/>
                  <p className="font-semibold capitalize">{pinDetails.postedBy?.userName}</p>
               </Link>

               <hr style={{ width: '95%', margin: '0 auto' }} />

         {/* comments on pin */}
               <h2 className="mt-5 text-2xl pl-6">Comments:</h2>
               <div className="max-h-370 overflow-y-auto pl-8 mb-7">
                  {pinDetails?.comments?.map((comment, i) => (
                     <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                        <img src={comment.postedBy.image} alt="user-profile" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col">
                           <p className="font-bold">{comment.postedBy.userName}</p>
                           <p>{comment.comment}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <hr style={{ width: '95%', margin: '0 auto' }} />

         {/* add a comment from current user */}
               <div className="flex flex-wrap items-center mt-6 gap-3">
                  <Link to={`/user-profile/${user?._id}`}>
                     <img src={user?.image} alt="user avatar" className="w-10 h-10 rounded-full cursor-pointer" referrerPolicy="no-referrer"/>
                  </Link>
                  <input type="text" className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                  <button type="button" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none" onClick={addComment}>
                     {addingComment ? 'Posting...' : 'Post'}
                  </button>
               </div>
            </div>
         </div>

         {/* related pins */}
         {pins?.length > 0 ? (
            <>
               <h2 className="text-center font-bold text-2xl mt-8 mb-4">More like this:</h2>
               <MasonryLayout pins={pins} />
            </>
         ) : (
            <Spinner message="Loading more pins..." />
         )}
      </>
   )
}

export default PinDetail;