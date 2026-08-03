// Pin document — image post with optional destination, saves, and comments.
import {defineType, defineField} from 'sanity'

export default defineType({
   name: 'pin',
   title: 'Pin',
   type: 'document',
   fields: [
      defineField({
         name: 'title',
         title: 'Title',
         type: 'string',
      }),
      defineField({
         name: 'about',
         title: 'About',
         type: 'string',
      }),
      defineField({
         name: 'destination',
         title: 'Destination',
         type: 'url',
      }),
      defineField({
         name: 'category',
         title: 'Category',
         type: 'string',
      }),
      defineField({
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
         hotspot: true,
         },
      }),
      defineField({
         name: 'userId',
         title: 'User ID',
         type: 'string',
      }),
      defineField({
         name: 'postedBy',
         title: 'Posted By',
         type: 'postedBy',
      }),
      defineField({
         name: 'save',
         title: 'Saves',
         type: 'array',
         of: [{type: 'save'}],
      }),
      defineField({
         name: 'comments',
         title: 'Comments',
         type: 'array',
         of: [{type: 'comment'}],
      }),
   ],
   preview: {
      select: {
         title: 'title',
         subtitle: 'category',
         media: 'image',
      },
   },
})
