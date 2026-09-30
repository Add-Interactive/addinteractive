const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const IMG_DIR = path.join(__dirname, 'assets', 'img');

// The .webp files in this repo were once committed as base64 *text*
// (an upload tool double-encoded them). This route serves them back as
// real image bytes either way, so the site works regardless of how the
// files are stored. Results are cached in memory.
const imgCache = new Map();
function loadImage(name) {
  if (imgCache.has(name)) return imgCache.get(name);
  const buf0 = fs.readFileSync(path.join(IMG_DIR, name));
  let buf = buf0;
  const txt = buf0.toString('latin1').replace(/\s/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(txt) && txt.length % 4 === 0 && txt.length > 100) {
    try {
      const decoded = Buffer.from(txt, 'base64');
      if (decoded.subarray(0, 4).toString() === 'RIFF' &&
          decoded.subarray(8, 12).toString() === 'WEBP') {
        buf = decoded;
      }
    } catch (_) { /* keep raw bytes */ }
  }
  imgCache.set(name, buf);
  return buf;
}

app.get('/assets/img/:name', (req, res) => {
  const name = path.basename(req.params.name || '');
  if (!/^image-\d+\.webp$/.test(name)) return res.status(404).end();
  try {
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(loadImage(name));
  } catch (_) {
    res.status(404).end();
  }
});

// Serve the site (single-file build + assets)
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// SPA-style fallback: unknown routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Add Interactive Studio site live on port ${PORT}`);
});
