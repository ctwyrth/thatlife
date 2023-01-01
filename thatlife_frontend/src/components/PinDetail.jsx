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

   const fetchPinDetails = () => {
      let query = pinDetailQuery(pinId);

      if (query) {
         client.fetch(query)
            .then((data) => {
               setPinDetails(data[0]);

               if (data[0]) {
                  query = pinDetailMorePinQuery(data[0]);

                  client.fetch(query)
                     .then((res) => setPins(res));
               }
            })
      }
   }

   useEffect(() => {
      fetchPinDetails();
   }, [pinId])
   
   if (!pinDetails) return <Spinner message="Loading pin..." />
   
   return (
      <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
         <div className="flex justify-center items-center md:item-start flex-initial">
            <img src={pinDetails?.image && urlFor(pinDetails.image).url()} alt="" />
         </div>
      </div>
   )
}

export default PinDetail;