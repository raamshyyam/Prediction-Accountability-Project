export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    // Collect raw request body as buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'No file data received' });
    }
    
    // Dynamic import to avoid module loading issues
    const pdfLib = await import('pdf-parse');
    const pdf = pdfLib.default;
    const data = await pdf(buffer);
    
    return res.status(200).json({ text: data.text || '' });
  } catch (e) {
    const detail = e?.message || String(e);
    console.error('PDF extraction error:', detail);
    return res.status(500).json({ error: 'Extraction failed', detail });
  }
}
