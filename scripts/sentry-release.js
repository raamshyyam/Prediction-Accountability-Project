// Usage: set SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT, then
// node scripts/sentry-release.js

const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
const version = pkg.version || `v${Date.now()}`;

const token = process.env.SENTRY_AUTH_TOKEN;
const org = process.env.SENTRY_ORG;
const project = process.env.SENTRY_PROJECT;

if (!token || !org || !project) {
  console.error('Missing Sentry env vars. Set SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT');
  process.exit(1);
}

(async () => {
  try {
    const url = `https://sentry.io/api/0/organizations/${org}/releases/`;
    const body = JSON.stringify({ version, projects: [project] });
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body
    });
    const json = await res.text();
    if (!res.ok) {
      console.error('Sentry release creation failed', res.status, json);
      process.exit(1);
    }
    console.log('Sentry release created for', version);
  } catch (e) {
    console.error('Error creating Sentry release', e.message || e);
    process.exit(1);
  }
})();
