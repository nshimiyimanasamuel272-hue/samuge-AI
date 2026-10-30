# SamugeAI

A bilingual Kinyarwanda/English AI chat website.

## GitHub Pages frontend
Upload `index.html`, `style.css`, `script.js`, `robots.txt`, and `sitemap.xml` to the **root** of the `main` branch. In Settings → Pages, choose `main` and `/(root)`.

## Backend
The `backend/` folder is a Node.js/Express service. Deploy it to a Node.js hosting service. Set these environment variables on the backend host:
- `OPENAI_API_KEY`: your secret OpenAI API key
- `FRONTEND_ORIGIN`: `https://nshiyimiyamasamuel272-hue.github.io`
- `OPENAI_MODEL`: `gpt-4.1-mini` (optional)
- `PORT`: provided automatically by most hosts

After deploying, copy the backend service URL into `API_BASE_URL` in `script.js`, replacing `https://YOUR-BACKEND-URL`. Commit the updated `script.js`.

Never upload `.env`, API keys, or secret values to GitHub. GitHub Pages only serves static frontend files; it does not run the Node.js backend.
