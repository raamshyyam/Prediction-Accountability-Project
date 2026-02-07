export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    // Collect raw request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'No file data received' });
    }
    
    // Extract file content from multipart form data
    // Find the boundary from Content-Type header
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    const boundary = boundaryMatch ? boundaryMatch[1] : null;
    
    let pdfBuffer = buffer;
    
    if (boundary) {
      // Extract data between boundaries
      const boundaryStr = `--${boundary}`;
      const startIdx = buffer.indexOf(boundaryStr, 0);
      const endIdx = buffer.indexOf(boundaryStr, startIdx + boundaryStr.length);
      
      if (startIdx >= 0 && endIdx > startIdx) {
        // Extract content between boundaries
        let contentStart = startIdx + boundaryStr.length;
        // Skip to actual file data (after headers)
        const headerEnd = buffer.indexOf('\r\n\r\n', contentStart);
        if (headerEnd >= 0) {
          contentStart = headerEnd + 4;
        }
        // Extract up to the closing boundary
        let contentEnd = endIdx - 2;
        pdfBuffer = buffer.slice(contentStart, contentEnd);
      }
    }
    
    // Dynamic import to avoid module loading issues
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
