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
         name: 'mediaType',
         title: 'Media Type',
         type: 'string',
         initialValue: 'image',
         description: 'The type of media for the pin',
         options: {
            list: ['image', 'video'],
         },
      }),
      defineField({
         name: 'image',
         title: 'Image',
         type: 'image',
         options: {
            hotspot: true,
         },
         description: 'The image for the pin',
      }),
      defineField({
         name: 'altText',
         title: 'Alt Text',
         type: 'string',
         description: 'The alt text for the image',
      }),
      defineField({
         name: 'video',
         title: 'Video',
         type: 'file',
         options: {
            accept: 'video/*',
         },
         description: 'The video for the pin',
      }),
      defineField({
         name: 'poster',
         title: 'Poster',
         type: 'image',
         options: {
            hotspot: true,
         },
         description: 'The poster image for the video',
      }),
      defineField({
         name: 'allowDownload',
         title: 'Allow Download',
         type: 'boolean',
         initialValue: true,
         description: 'Whether the user wants to allow downloads of the image',
      }),
      defineField({
         name: 'tags',
         title: 'Tags',
         type: 'array',
         of: [{type: 'string'}],
         options: { layout: 'tags' },
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
