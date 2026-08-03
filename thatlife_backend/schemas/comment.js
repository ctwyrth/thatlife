// Comment object — embedded on a pin (ShareMe-style array item).
import {defineType, defineField} from 'sanity'

export default defineType({
   name: 'comment',
   title: 'Comment',
   type: 'object',
   fields: [
      defineField({
         name: 'postedBy',
         title: 'Posted By',
         type: 'postedBy',
      }),
      defineField({
         name: 'comment',
         title: 'Comment',
         type: 'string',
      }),
   ],
})
