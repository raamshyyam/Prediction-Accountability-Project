export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    const { IncomingForm } = await import('formidable');
    const form = new IncomingForm();
    
    const [fields, files] = await form.parse(req);
    const uploadedFile = files.file?.[0];
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Read the uploaded file (formidable writes to tmp by default)
    const fs = await import('fs');
    const pdfBuffer = await fs.promises.readFile(uploadedFile.filepath);
    
    // Extract PDF text
    const pdfLib = await import('pdf-parse');
    const pdf = pdfLib.default;
    const data = await pdf(pdfBuffer);
    
    return res.status(200).json({ text: data.text || '' });
  } catch (e) {
    const detail = e?.message || String(e);
    console.error('PDF extraction error:', detail);
    return res.status(500).json({ error: 'Extraction failed', detail });
  }
}
