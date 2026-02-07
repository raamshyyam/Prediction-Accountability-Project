Deploying to Vercel

This repository supports deployment to Vercel with a serverless PDF extraction endpoint.

What I added
- `api/extract-pdf.js` — Vercel serverless function to accept multipart PDF uploads and return extracted text.
- `vercel.json` — Vercel configuration for static build and functions.

Quick deploy steps (recommended)
1. Push your repo to GitHub (or GitLab/Bitbucket) if not already pushed.
2. Go to https://vercel.com and connect your Git provider, then import this repository.
3. Vercel will detect the project and run `npm run build` and publish the `dist` folder.
4. The serverless function will be available at `https://<your-deploy>/api/extract-pdf`.

Manual deploy using Vercel CLI

If you want to deploy from this machine, install the Vercel CLI and deploy:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes
- During development the app calls `/api/extract-pdf`. Vite dev server proxies `/api` to `http://localhost:4000` (see `vite.config.ts`). In production on Vercel, `/api/extract-pdf` will be served by the serverless function.
- If you prefer not to run the local Express server anymore, you can remove the `server/` directory and the `start:server` script in `package.json`.
- If you want, I can push the config and trigger a deploy (requires Vercel login/permissions) or convert the serverless function to TypeScript.
