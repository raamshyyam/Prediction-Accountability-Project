export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    // Parse multipart form data without using formidable's file write
    const { IncomingForm } = await import('formidable');
    const form = new IncomingForm();
    
    return new Promise((resolve) => {
      // Accumulate file chunks in memory
      const fileChunks = [];
      
      form.on('file', (fieldname, file, { filename, encoding, mimetype }) => {
        if (fieldname === 'file') {
          file.on('data', (chunk) => {
            fileChunks.push(chunk);
          });
          file.on('error', (err) => {
            console.error('[extract-pdf] File stream error:', err.message);
          });
        }
      });
      
      form.on('error', (err) => {
        console.error('[extract-pdf] Form error:', err.message);
        res.status(400).json({ error: 'Form parsing failed', detail: err.message });
        resolve(void 0);
      });
      
      form.on('close', async () => {
        try {
          const pdfBuffer = Buffer.concat(fileChunks);
          
          if (pdfBuffer.length === 0) {
            return res.status(400).json({ error: 'No file data received' });
          }
          
          const debugInfo = {
            bufferSize: pdfBuffer.length,
            first30Hex: pdfBuffer.slice(0, 30).toString('hex'),
            last30Hex: pdfBuffer.slice(-30).toString('hex'),
            pdfSig: pdfBuffer.toString('utf8', 0, 4)
          };
          
          // Try to parse PDF
          const pdfLib = await import('pdf-parse');
          const pdf = pdfLib.default;
          const data = await pdf(pdfBuffer);
          
          res.status(200).json({ text: data.text || '', pages: data.numpages });
          resolve(void 0);
        } catch (e) {
          const debugInfo = {
            bufferSize: fileChunks.reduce((s, c) => s + c.length, 0),
            first30Hex: Buffer.concat(fileChunks).slice(0, 30).toString('hex'),
            last30Hex: Buffer.concat(fileChunks).slice(-30).toString('hex')
          };
          
          res.status(500).json({
            error: 'PDF parsing failed',
            detail: e?.message || String(e),
            debug: debugInfo
          });
          resolve(void 0);
        }
      });
      
      // Parse the incoming request
      form.parse(req);
    });
  } catch (e) {
    return res.status(500).json({
      error: 'Server error',
      detail: e?.message || String(e)
    });
  }
}
