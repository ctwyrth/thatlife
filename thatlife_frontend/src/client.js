// Sanity client — production reads go through /api/query to avoid CORS.
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const token = import.meta.env.VITE_SANITY_TOKEN;
const useProxy =
   typeof window !== 'undefined' &&
   !['localhost', '127.0.0.1'].includes(window.location.hostname);

const directClient = sanityClient({
   projectId,
   dataset: 'production',
   apiVersion: '2021-11-16',
   useCdn: true,
   token,
   ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(directClient);

export const urlFor = (source) => builder.image(source);

async function proxyFetch(query) {
   const response = await fetch(`/api/query?query=${encodeURIComponent(query)}`);
   if (!response.ok) {
      throw new Error(`Sanity proxy error: ${response.status}`);
   }
   const payload = await response.json();
   return payload.result;
}

export const client = {
   fetch: (query) => (useProxy ? proxyFetch(query) : directClient.fetch(query)),
   createIfNotExists: (doc) => directClient.createIfNotExists(doc),
   patch: (...args) => directClient.patch(...args),
   delete: (...args) => directClient.delete(...args),
   assets: directClient.assets,
};
