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
