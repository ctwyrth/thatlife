// Sanity GROQ helpers and Discover category list (icons for sidebar).
import {
   MdOutlinePhotoCamera,
   MdOutlineCode,
   MdOutlineRestaurant,
   MdOutlinePark,
   MdOutlineBrush,
   MdOutlineFlight,
   MdOutlineFormatQuote,
   MdOutlineMoreHoriz,
   MdOutlineSportsEsports,
   MdOutlineAutoAwesome,
   MdOutlineMenuBook,
} from 'react-icons/md';
import { FaBook, FaPaw, FaDog, FaMask } from 'react-icons/fa';
import { BiCameraMovie } from 'react-icons/bi';

export const userQuery = (userId) => {
   const query = `*[_type == "user" && _id == '${userId}']`;
   return query;
}

export const searchQuery = (searchTerm) => {
   const query = `*[_type == "pin" && title match "${searchTerm}*" || category match "${searchTerm}*" || about match "${searchTerm}*"] {
      image {
         asset -> {
            url
         }
      },
      _id,
      destination,
      allowDownload,
      tags,
      mediaType,
      altText,
      video{
         asset->{
            url
         }
      },
      poster{
         asset->{
            url
         }
      },
      postedBy -> {
         _id,
         userName,
         image
      },
      save[] {
         _key,
         postedBy -> {
            _id,
            userName,
            image
         },
      },
   }`

   return query;
}

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
   image {
      asset -> {
         url
      }
   },
   _id,
   destination,
   allowDownload,
   tags,
   mediaType,
   altText,
   video{
      asset->{
         url
      }
   },
   poster{
      asset->{
         url
      }
   },
   postedBy -> {
      _id,
      userName,
      image
   },
   save[] {
      _key,
      postedBy -> {
         _id,
         userName,
         image
      },
   },
}`

// Discover categories — keep Others last (sidebar hides it; Create Pin includes it).
export const categories = [
   { name: 'Comics', icon: MdOutlineMenuBook },
   { name: 'Cosplay', icon: FaMask },
   { name: 'Gaming', icon: MdOutlineSportsEsports },
   { name: 'Movies', icon: BiCameraMovie },
   { name: 'Books', icon: FaBook },
   { name: 'Celebrities', icon: MdOutlineAutoAwesome },
   { name: 'Photography', icon: MdOutlinePhotoCamera },
   { name: 'Programming', icon: MdOutlineCode },
   { name: 'Food', icon: MdOutlineRestaurant },
   { name: 'Nature', icon: MdOutlinePark },
   { name: 'Art', icon: MdOutlineBrush },
   { name: 'Travel', icon: MdOutlineFlight },
   { name: 'Quotes', icon: MdOutlineFormatQuote },
   { name: 'Cats', icon: FaPaw },
   { name: 'Dogs', icon: FaDog },
   { name: 'Others', icon: MdOutlineMoreHoriz },
];

export const pinDetailQuery = (pinId) => {
   const query = `*[_type == "pin" && _id == '${pinId}'] {
      image{
         asset->{
            url
         }
      },
      _id,
      title, 
      about,
      category,
      destination,
      allowDownload,
      tags,
      mediaType,
      altText,
      video{
         asset->{
            url
         }
      },
      poster{
         asset->{
            url
         }
      },
      postedBy->{
         _id,
         userName,
         image
      },
      save[]{
         postedBy->{
            _id,
            userName,
            image
         },
      },
      comments[]{
         comment,
         _key,
         postedBy->{
            _id,
            userName,
            image
         },
      }
   }`;
   return query;
};

export const pinDetailMorePinQuery = (pin) => {
   const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ] {
      image{
         asset->{
            url
         }
      },
      _id,
      destination,
      allowDownload,
      tags,
      mediaType,
      altText,
      video{
         asset->{
            url
         }
      },
      poster{
         asset->{
            url
         }
      },
      postedBy->{
         _id,
         userName,
         image
         },
      save[]{
         _key,
         postedBy->{
            _id,
            userName,
            image
         },
      },
   }`;
   return query;
};

export const userCreatedPinsQuery = (userId) => {
   const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc) {
      image{
         asset->{
            url
         }
      },
      _id,
      destination,
      allowDownload,
      tags,
      mediaType,
      altText,
      video{
         asset->{
            url
         }
      },
      poster{
         asset->{
            url
         }
      },
      postedBy->{
         _id,
         userName,
         image
      },
      save[]{
         postedBy->{
            _id,
            userName,
            image
         },
      },
   }`;
   return query;
};

export const userSavedPinsQuery = (userId) => {
   const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
      image{
         asset->{
            url
         }
      },
      _id,
      destination,
      allowDownload,
      tags,
      mediaType,
      altText,
      video{
         asset->{
            url
         }
      },
      poster{
         asset->{
            url
         }
      },
      postedBy->{
         _id,
         userName,
         image
      },
      save[]{
         postedBy->{
            _id,
            userName,
            image
         },
      },
   }`;
   return query;
}