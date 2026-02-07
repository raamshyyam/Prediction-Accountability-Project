export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    const { IncomingForm } = await import('formidable');
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });
    
    const [fields, files] = await form.parse(req);
    const uploadedFile = files.file?.[0];
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Read the uploaded file
    const fs = await import('fs');
    const pdfBuffer = await fs.promises.readFile(uploadedFile.filepath);
    
    // Debug info to include in error response
    const debugInfo = {
      bufferSize: pdfBuffer.length,
      first30Hex: pdfBuffer.slice(0, 30).toString('hex'),
      last30Hex: pdfBuffer.slice(-30).toString('hex'),
      pdfSig: pdfBuffer.toString('utf8', 0, 4)
    };
    
    if (pdfBuffer.length < 10) {
      return res.status(400).json({ error: 'PDF file too small', ...debugInfo });
    }
    
    try {
      // Extract PDF text
      const pdfLib = await import('pdf-parse');
      const pdf = pdfLib.default;
      const data = await pdf(pdfBuffer);
      
      // Cleanup
      try {
        await fs.promises.unlink(uploadedFile.filepath);
      } catch {}
      
      return res.status(200).json({ text: data.text || '', pages: data.numpages });
    } catch (parseErr) {
      // Include debug info in error response
      return res.status(500).json({ 
        error: 'PDF parsing failed', 
        detail: parseErr?.message || String(parseErr),
        debug: debugInfo
      });
    }
  } catch (e) {
    return res.status(500).json({ 
      error: 'Server error', 
      detail: e?.message || String(e)
    });
  }
}
