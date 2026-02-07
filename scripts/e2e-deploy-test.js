// E2E test: upload a small generated PDF to deployed extraction endpoint
// Usage: DEPLOY_URL=https://pap-red.vercel.app node scripts/e2e-deploy-test.js

import PDFDocument from 'pdfkit';

const DEPLOY_URL = process.env.DEPLOY_URL || 'https://pap-red.vercel.app';

async function createPdfBuffer() {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const bufs = [];
    doc.on('data', (c) => bufs.push(c));
    doc.on('end', () => {
      const buf = Buffer.concat(bufs);
      console.log('Generated PDF buffer size:', buf.length, 'bytes');
      console.log('First 20 bytes (hex):', buf.slice(0, 20).toString('hex'));
      resolve(buf);
    });
    doc.fontSize(12).text('E2E test PDF from CI.', 100, 100);
    doc.text('This should be extracted by the serverless endpoint.', 100, 130);
    doc.end();
  });
}

(async () => {
  try {
    const pdfBuf = await createPdfBuffer();
    const formData = new FormData();
    const file = new Blob([pdfBuf], { type: 'application/pdf' });
    formData.append('file', file, 'e2e-test.pdf');

    console.log(`\nUploading to ${DEPLOY_URL}/api/extract-pdf...`);
    const resp = await fetch(`${DEPLOY_URL}/api/extract-pdf`, { method: 'POST', body: formData });
    const txt = await resp.text();
    console.log('Status:', resp.status);
    console.log('Response:', txt);
    process.exit(resp.ok ? 0 : 2);
  } catch (e) {
    console.error('E2E test failed', e);
    process.exit(1);
  }
})();
