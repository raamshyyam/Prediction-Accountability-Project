import Busboy from 'busboy';
import pdf from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Method Not Allowed');
  }

  try {
    const bb = new Busboy({ headers: req.headers });
    const chunks = [];

    await new Promise((resolve, reject) => {
      bb.on('file', (name, file) => {
        file.on('data', (data) => chunks.push(data));
        file.on('end', () => {});
      });

      bb.on('error', (err) => reject(err));
      bb.on('finish', () => resolve());
      req.pipe(bb);
    });

    const buffer = Buffer.concat(chunks);
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'No file data received' });
    }

    const data = await pdf(buffer);
    return res.status(200).json({ text: data.text || '' });
  } catch (e) {
    console.error('Serverless extraction error', e);
    return res.status(500).json({ error: 'Extraction failed', detail: e && e.message ? e.message : String(e) });
  }
}
