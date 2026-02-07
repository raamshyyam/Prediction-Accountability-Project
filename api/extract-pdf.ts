import { promises as fs } from 'fs';
import { parse } from 'pdf-parse';
import { IncomingForm } from 'formidable';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    // Use formidable in callback mode and manually manage file writing
    const form = new IncomingForm({ 
      keepExtensions: true,
      // Store in /tmp but don't use filter
      uploadDir: '/tmp'
    });
    
    return new Promise((resolve) => {
      let pdfFile = null;
      let error = null;
      
      form.on('file', (fieldname, file) => {
        if (fieldname === 'file' && !pdfFile) {
          pdfFile = file;
        }
      });
      
      form.on('error', (err) => {
        error = err;
      });
      
      form.parse(req, async (formErr, fields, files) => {
        try {
          if (error || formErr) {
            const msg = error?.message || formErr?.message || 'Form parsing failed';
            res.status(400).json({ error: 'Form error', detail: msg });
            return resolve(void 0);
          }
          
          const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
          
          if (!uploadedFile) {
            res.status(400).json({ error: 'No file uploaded' });
            return resolve(void 0);
          }
          
          // Read the file
          const pdfBuffer = await fs.readFile(uploadedFile.filepath);
          
          // Cleanup temp file
          try {
            await fs.unlink(uploadedFile.filepath);
          } catch (e) {
            // Ignore cleanup errors
          }
          
          // Try to parse PDF
          try {
            const data = await parse(pdfBuffer);
            res.status(200).json({ text: data.text || '', pages: data.numpages });
            resolve(void 0);
          } catch (parseErr) {
            const debugInfo = {
              bufferSize: pdfBuffer.length,
              first30Hex: pdfBuffer.slice(0, 30).toString('hex'),
              pdfSig: pdfBuffer.toString('utf8', 0, 4)
            };
            
            res.status(500).json({
              error: 'PDF parsing failed',
              detail: parseErr?.message || String(parseErr),
              debug: debugInfo
            });
            resolve(void 0);
          }
        } catch (e) {
          res.status(500).json({
            error: 'Server error',
            detail: e?.message || String(e)
          });
          resolve(void 0);
        }
      });
    });
  } catch (e) {
    return res.status(500).json({
      error: 'Endpoint error',
      detail: e?.message || String(e)
    });
  }
}
