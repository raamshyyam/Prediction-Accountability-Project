export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    const { IncomingForm } = await import('formidable');
    const fs = await import('fs');
    const pdfLib = await import('pdf-parse');
    const pdf = pdfLib.default;
    
    // Use formidable in callback mode
    const form = new IncomingForm({ 
      keepExtensions: true,
      uploadDir: '/tmp'
    });
    
    return new Promise((resolve) => {
      form.parse(req, async (formErr, fields, files) => {
        try {
          if (formErr) {
            res.status(400).json({ error: 'Form error', detail: formErr.message });
            return resolve(void 0);
          }
          
          const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
          
          if (!uploadedFile) {
            res.status(400).json({ error: 'No file uploaded' });
            return resolve(void 0);
          }
          
          // Read the file
          const pdfBuffer = await fs.promises.readFile(uploadedFile.filepath);
          
          // Cleanup temp file
          try {
            await fs.promises.unlink(uploadedFile.filepath);
          } catch {}
          
          // Try to parse PDF
          const data = await pdf(pdfBuffer);
          res.status(200).json({ text: data.text || '', pages: data.numpages });
          resolve(void 0);
        } catch (e) {
          const bufSize = files.file ? (Array.isArray(files.file) ? files.file[0].size : files.file.size) : 0;
          
          res.status(500).json({
            error: 'PDF parsing failed',
            detail: e?.message || String(e),
            fileSize: bufSize
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
