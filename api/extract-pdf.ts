export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    console.log('[extract-pdf] Request received');
    console.log('[extract-pdf] Content-Type:', req.headers['content-type']);
    console.log('[extract-pdf] Content-Length:', req.headers['content-length']);
    
    const { IncomingForm } = await import('formidable');
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });
    
    console.log('[extract-pdf] Parsing form data...');
    const [fields, files] = await form.parse(req);
    console.log('[extract-pdf] Form parsed');
    console.log('[extract-pdf] Files:', Object.keys(files));
    
    const uploadedFile = files.file?.[0];
    
    if (!uploadedFile) {
      console.error('[extract-pdf] No file in form data');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('[extract-pdf] File info:', { 
      filepath: uploadedFile.filepath, 
      size: uploadedFile.size, 
      mimetype: uploadedFile.mimetype 
    });
    
    // Read the uploaded file
    const fs = await import('fs');
    const pdfBuffer = await fs.promises.readFile(uploadedFile.filepath);
    
    console.log('[extract-pdf] Read buffer size:', pdfBuffer.length, 'bytes');
    console.log('[extract-pdf] First 20 bytes:', pdfBuffer.slice(0, 20).toString('hex'));
    
    const pdfSig = pdfBuffer.toString('utf8', 0, 4);
    console.log('[extract-pdf] PDF signature:', pdfSig === '%PDF' ? 'valid' : `invalid (${pdfSig})`);
    
    if (pdfBuffer.length < 10) {
      return res.status(400).json({ error: 'PDF file too small', size: pdfBuffer.length });
    }
    
    console.log('[extract-pdf] Starting PDF parse...');
    // Extract PDF text
    const pdfLib = await import('pdf-parse');
    const pdf = pdfLib.default;
    const data = await pdf(pdfBuffer);
    
    console.log('[extract-pdf] Parse complete, pages:', data.numpages);
    
    return res.status(200).json({ text: data.text || '', pages: data.numpages });
  } catch (e) {
    const detail = e?.message || String(e);
    console.error('[extract-pdf] Error:', detail);
    console.error('[extract-pdf] Stack:', e?.stack);
    return res.status(500).json({ error: 'Extraction failed', detail });
  }
}
