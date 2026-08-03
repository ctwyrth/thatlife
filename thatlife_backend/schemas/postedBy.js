// PostedBy — reference from pins/comments/saves back to a user document.
import {defineType} from 'sanity'

export default defineType({
   name: 'postedBy',
   title: 'Posted By',
   type: 'reference',
   to: [{type: 'user'}],
})
