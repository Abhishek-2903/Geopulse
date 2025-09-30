/** @type {import('next').NextConfig} */
     const nextConfig = {
       webpack: (config, { isServer }) => {
         if (!isServer) {
           // Prevent Node.js-specific modules in client-side bundle
           config.resolve.fallback = {
             fs: false,
             path: false,
           };
         }
         // Ensure sql-wasm.wasm is treated as an asset
         config.module.rules.push({
           test: /\.wasm$/,
           type: 'asset/resource',
         });
         return config;
       },
       // Enable WASM support
       experiments: {
         asyncWebAssembly: true,
       },
     };

     module.exports = nextConfig;