import { writeFileSync } from 'fs';

// Create a minimal but valid PDF using raw PDF syntax
// This is a bare minimum PDF that should be parseable
const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000273 00000 n
0000000367 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
463
%%EOF
`;

const buf = Buffer.from(pdfContent, 'utf8');
writeFileSync('test_minimal.pdf', buf);
console.log('Minimal PDF written to test_minimal.pdf');
console.log('Size:', buf.length);
