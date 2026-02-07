import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import pdf from 'pdf-parse';

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/api/extract-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    // remove the temporary file
    try { fs.unlinkSync(req.file.path); } catch (e) { console.warn('Failed to remove temp file', e); }
    return res.json({ text: data.text || '' });
  } catch (e) {
    console.error('PDF extraction error', e);
    const msg = e && e.message ? e.message : String(e);
    return res.status(500).json({ error: 'Extraction failed', detail: msg });
  }
});

app.listen(PORT, () => {
  console.log(`PDF extraction server listening on port ${PORT}`);
});
