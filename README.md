# Add Interactive Studio — Company Website

The public site for Add Interactive Studio (addinteractive.com), rebuilt from the Canva original.

## Local dev

```bash
npm install
npm start
```

Then open http://localhost:3000

## Deploy (Railway)

1. Create a new Railway project → Deploy from GitHub → select this repo.
2. Railway auto-detects Node.js and runs `npm start`.
3. No environment variables required.

## Structure

- `index.html` — the full site (single-file build, assets inlined)
- `server.js` — minimal Express static server for Railway
- `package.json` — Node dependencies
