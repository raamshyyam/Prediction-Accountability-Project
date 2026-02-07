export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  try {
    const { IncomingForm } = await import('formidable');
    const fs = await import('fs');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');
    
    // Import pdf.js
    const pdf = (await import('pdfjs-dist/legacy/build/pdf.js')).default;
    
    // Configure worker
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const workerPath = __dirname.replace(/\\/g, '/') + '/../node_modules/pdfjs-dist/legacy/build/pdf.worker.js';
    pdf.GlobalWorkerOptions.workerSrc = workerPath;
    
    // Use formidable to parse multipart forms
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
          
          // Read the PDF file
          const pdfBuffer = await fs.promises.readFile(uploadedFile.filepath);
          
          // Cleanup temp file
          try {
            await fs.promises.unlink(uploadedFile.filepath);
          } catch {}
          
          // Convert buffer to Uint8Array as required by pdf.js
          const pdfData = new Uint8Array(pdfBuffer);
          
          // Parse PDF
          const pdfDoc = await pdf.getDocument({ data: pdfData }).promise;
          let extractedText = '';
          const pageCount = pdfDoc.numPages;
          
          // Extract text from all pages (limit to first 50 pages for performance)
          for (let i = 1; i <= Math.min(pageCount, 50); i++) {
            const page = await pdfDoc.getPage(i);
            try {
              const content = await page.getTextContent();
              const pageText = content.items
                .map(item => (item.str || ''))
                .join('');
              extractedText += pageText + '\n';
            } catch {
              // Skip pages that fail to extract
            }
          }
          
          res.status(200).json({ 
            text: extractedText.trim(), 
            pages: pageCount 
          });
          resolve(void 0);
        } catch (e) {
          res.status(500).json({
            error: 'PDF extraction failed',
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
