import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// Optional Sentry integration: set VERCEL_SENTRY_DSN in project env to enable
let Sentry: any = null;
try {
  if (process.env.VERCEL_SENTRY_DSN) {
    // lazy require to avoid adding hard dependency if not provided
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Sentry = require('@sentry/node');
    Sentry.init({ dsn: process.env.VERCEL_SENTRY_DSN });
  }
} catch (e) {
  // ignore
}

const LOG_PATH = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_PATH)) {
  try { fs.mkdirSync(LOG_PATH); } catch (e) { /* ignore */ }
}

const appendLocalLog = (msg: string) => {
  if (process.env.LOCAL_LOG !== 'true') return;
  try {
    fs.appendFileSync(path.join(LOG_PATH, 'extract-errors.log'), `${new Date().toISOString()} ${msg}\n`);
  } catch (e) {
    // ignore
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const bb = new Busboy({ headers: req.headers });
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      bb.on('file', (_name, file) => {
        file.on('data', (data: Buffer) => chunks.push(data));
        file.on('end', () => {});
      });
      bb.on('error', (err) => reject(err));
      bb.on('finish', () => resolve());
      req.pipe(bb as any);
    });

    const buffer = Buffer.concat(chunks);
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'No file data received' });
    }

    const data = await pdf(buffer);
    return res.status(200).json({ text: data.text || '' });
  } catch (e: any) {
    const detail = e?.message || String(e);
    console.error('Serverless extraction error', detail);
    appendLocalLog(detail);
    if (Sentry) Sentry.captureException(e);
    return res.status(500).json({ error: 'Extraction failed', detail });
  }
}
