import { MdPassword } from "react-icons/md";

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

export const categories = [
   {
      name: 'comics',
      image: 'https://m.media-amazon.com/images/I/A1bJOvEboML.jpg',
   },
   {
      name: 'cosplay',
      image: 'https://pbs.twimg.com/media/FjDvIAHaMAA2jo3?format=jpg&name=large',
   },
   {
      name: 'gaming',
      image: 'https://www.etonline.com/sites/default/files/styles/max_970x546/public/images/2022-11/GettyImages-1345967858.jpg?h=119335f7&itok=ZJ59Rj1A',
   },
   {
      name: 'photography',
      image: 'https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg',
   },
   {
      name: 'programming',
      image: 'https://www.codingem.com/wp-content/uploads/2021/10/juanjo-jaramillo-mZnx9429i94-unsplash-scaled.jpg',
   },
   {
      name: 'food',
      image: 'https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg',
   },
   {
      name: 'nature',
      image: 'https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg',
   },
   {
      name: 'art',
      image: 'https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg',
   }, {
      name: 'travel',
      image: 'https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg',
   },
   {
      name: 'quotes',
      image: 'https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg',
   }, {
      name: 'cats',
      image: 'https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg',
   }, {
      name: 'dogs',
      image: 'https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg',
   },
   {
      name: 'others',
      image: 'https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg',
   },
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
}

export const pinDetailMorePinQuery = (pin) => {
   const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ] {
      image{
         asset->{
            url
         }
      },
      _id,
      destination,
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
}