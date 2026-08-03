// Save object — embedded “like/save” entry on a pin.
import {defineType, defineField} from 'sanity'

export default defineType({
   name: 'save',
   title: 'Save',
   type: 'object',
   fields: [
      defineField({
         name: 'postedBy',
         title: 'Posted By',
         type: 'postedBy',
      }),
      defineField({
         name: 'userId',
         title: 'User ID',
         type: 'string',
      }),
   ],
})
