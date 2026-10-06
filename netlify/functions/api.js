// Netlify Function yang menjalankan seluruh aplikasi NestJS.
// Kode TypeScript dikompilasi lebih dulu oleh `nest build` ke folder dist/
// (decorator metadata NestJS butuh compiler TypeScript, bukan esbuild).
exports.handler = (...args) => require('../../dist/serverless').handler(...args);
