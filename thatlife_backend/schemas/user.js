// User document — Google auth identity mirrored into Sanity.
import {defineType, defineField} from 'sanity'

export default defineType({
   name: 'user',
   title: 'User',
   type: 'document',
   fields: [
      defineField({
         name: 'userName',
         title: 'User Name',
         type: 'string',
      }),
      defineField({
         name: 'email',
         title: 'Email',
         type: 'string',
      }),
      defineField({
         name: 'emailConfirmation',
         title: 'Email Confirmation',
         type: 'boolean',
         initialValue: false,
         description: 'Whether the user has confirmed their email',
      }),
      defineField({
         name: 'bio',
         title: 'Bio',
         type: 'string',
         description: 'A short public bio of the user',
      }),
      defineField({
         name: 'profileComplete',
         title: 'Profile Complete',
         type: 'boolean',
         initialValue: false,
         description: 'Whether the user has completed their profile',
      }),
      defineField({
         name: 'notifyOnLike',
         title: 'Notify On Like',
         type: 'boolean',
         initialValue: true,
         description: 'Whether the user wants to be notified when someone likes their post',
      }),
      defineField({
         name: 'notifyOnComment',
         title: 'Notify On Comment',
         type: 'boolean',
         initialValue: true,
         description: 'Whether the user wants to be notified when someone comments on their post',
      }),
      defineField({
         name: 'theme',
         title: 'Theme',
         type: 'string',
         initialValue: 'light',
         description: 'The theme of the user',
         options: {
            list: ['light', 'dark'],
         },
      }),
      defineField({
         name: 'image',
         title: 'Image',
         type: 'string',
         description: 'Avatar URL (Google profile picture or uploaded asset URL)',
      }),
   ],
   preview: {
      select: {
         title: 'userName',
         subtitle: 'image',
      },
   },
})
