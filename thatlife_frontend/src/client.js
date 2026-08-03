// Sanity client — production reads/writes go through /api/* proxies to avoid CORS.
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const token = import.meta.env.VITE_SANITY_TOKEN
const useProxy =
   typeof window !== 'undefined' &&
   !['localhost', '127.0.0.1'].includes(window.location.hostname)

const directClient = createClient({
   projectId,
   dataset: 'production',
   apiVersion: '2021-11-16',
   useCdn: false,
   token,
   ignoreBrowserTokenWarning: true,
})

const builder = imageUrlBuilder(directClient)

export const urlFor = (source) => builder.image(source)

// Run a GROQ query via same-origin proxy (production) or direct client (local).
async function proxyFetch(query) {
   const response = await fetch(`/api/query?query=${encodeURIComponent(query)}`)
   if (!response.ok) {
      throw new Error(`Sanity proxy error: ${response.status}`)
   }
   const payload = await response.json()
   return payload.result
}

// POST Sanity mutations through the Vercel proxy.
async function proxyMutate(mutations) {
   const response = await fetch('/api/mutate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({mutations}),
   })
   const payload = await response.json()
   if (!response.ok) {
      throw new Error(payload?.error || `Sanity mutate proxy error: ${response.status}`)
   }
   return payload
}

// Chainable patch builder that commits through /api/mutate.
function proxyPatch(documentId) {
   const patch = {id: documentId}

   const api = {
      setIfMissing(fields) {
         patch.setIfMissing = {...(patch.setIfMissing || {}), ...fields}
         return api
      },
      set(fields) {
         patch.set = {...(patch.set || {}), ...fields}
         return api
      },
      insert(position, path, items) {
         patch.insert = {[position]: path, items}
         return api
      },
      commit() {
         return proxyMutate([{patch}])
      },
   }

   return api
}

// Upload an image file through /api/asset and return a Sanity asset-shaped doc.
async function proxyUploadImage(file) {
   const response = await fetch(`/api/asset?filename=${encodeURIComponent(file.name || 'upload.bin')}`, {
      method: 'POST',
      headers: {
         'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
   })
   const payload = await response.json()
   if (!response.ok) {
      throw new Error(payload?.error || `Sanity asset proxy error: ${response.status}`)
   }
   return payload.document || payload
}

export const client = {
   fetch: (query) => (useProxy ? proxyFetch(query) : directClient.fetch(query)),
   createIfNotExists: (doc) =>
      useProxy
         ? proxyMutate([{createIfNotExists: doc}]).then(() => doc)
         : directClient.createIfNotExists(doc),
   create: (doc) =>
      useProxy
         ? proxyMutate([{create: doc}]).then((result) => result?.results?.[0]?.document || doc)
         : directClient.create(doc),
   patch: (id) => (useProxy ? proxyPatch(id) : directClient.patch(id)),
   delete: (id) =>
      useProxy
         ? proxyMutate([{delete: {id}}])
         : directClient.delete(id),
   assets: {
      upload: (type, file, options = {}) => {
         if (!useProxy) {
            return directClient.assets.upload(type, file, options)
         }
         if (type !== 'image') {
            return Promise.reject(new Error('Only image uploads are proxied'))
         }
         return proxyUploadImage(file)
      },
   },
}
