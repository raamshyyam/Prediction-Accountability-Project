// Simple test to POST a tiny PDF to the local extraction server
// Run with: node scripts/test-extract.js

import PDFDocument from 'pdfkit';
import stream from 'stream';

(async () => {
  try {
    // Generate a small PDF in-memory
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    const endPromise = new Promise((res) => doc.on('end', res));
    doc.text('Hello from test PDF for extraction.');
    doc.end();
    await endPromise;
    const pdfBuffer = Buffer.concat(buffers);

    const formData = new (globalThis.FormData)();
    const file = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', file, 'sample.pdf');

    const res = await fetch('http://localhost:4000/api/extract-pdf', {
      method: 'POST',
      body: formData
    });

    const txt = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', txt);
  } catch (e) {
    console.error('Test failed', e);
    process.exit(1);
  }
})();
