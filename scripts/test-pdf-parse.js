import { readFileSync } from 'fs';
import parse from 'pdf-parse';

const pdfData = readFileSync('test_output.pdf');
console.log('PDF Buffer size:', pdfData.length);
console.log('First 20 bytes (hex):', pdfData.slice(0, 20).toString('hex'));

parse(pdfData)
  .then(data => {
    console.log('✓ PDF parsed successfully!');
    console.log('Pages:', data.numpages);
    console.log('Text sample:', data.text.slice(0, 100));
  })
  .catch(err => {
    console.error('✗ PDF parsing failed:', err.message);
    console.error('Stack:', err.stack);
  });
