// Masonry feed of Sanity pins by category or home query.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
   const [loading, setLoading] = useState(false);
   const [pins, setPins] = useState(null);
   const { categoryId } = useParams();

   useEffect(() => {
      setLoading(true);

      const request = categoryId
         ? client.fetch(searchQuery(categoryId))
         : client.fetch(feedQuery);

      request
         .then((data) => {
            setPins(data);
            setLoading(false);
         })
         .catch((error) => {
            console.error('Feed fetch failed', error);
            setPins([]);
            setLoading(false);
         });
   }, [categoryId])

   if (loading) return <Spinner message="We're working to bring you new content." />;

   if (!pins?.length) return <h2 className="text-gray-900 dark:text-gray-100">No pins available.</h2>

   return (
      <div>
         {pins && <MasonryLayout pins={pins} />}
      </div>
   )
}

export default Feed;