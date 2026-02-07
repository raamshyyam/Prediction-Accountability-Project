// E2E test: upload a small generated PDF to deployed extraction endpoint
// Usage: DEPLOY_URL=https://pap-red.vercel.app node scripts/e2e-deploy-test.js

import PDFDocument from 'pdfkit';
import fs from 'fs';

const DEPLOY_URL = process.env.DEPLOY_URL || 'https://pap-red.vercel.app';

async function createPdfBuffer() {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const bufs = [];
    doc.on('data', (c) => bufs.push(c));
    doc.on('end', () => resolve(Buffer.concat(bufs)));
    doc.text('E2E test PDF from CI. This should be extracted by the serverless endpoint.');
    doc.end();
  });
}

(async () => {
  try {
    const pdfBuf = await createPdfBuffer();
    const formData = new FormData();
    const file = new Blob([pdfBuf], { type: 'application/pdf' });
    formData.append('file', file, 'e2e-test.pdf');

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
