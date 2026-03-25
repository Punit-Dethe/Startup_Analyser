const fs = require('fs');
const path = require('path');

const txt = fs.readFileSync('c:/Projects/Startup_Analyser/gemini-output.txt', 'utf8').trim();

const targetFile = 'c:/Projects/Startup_Analyser/kore-frontend/src/lib/dummyData.ts';
let content = fs.readFileSync(targetFile, 'utf8');

const anchor = 'export const DUMMY_PAYLOAD: DashboardPayload = ';
const index = content.indexOf(anchor);

if (index !== -1) {
  content = content.slice(0, index + anchor.length) + txt + '\n';
  fs.writeFileSync(targetFile, content);
  console.log('Successfully replaced DUMMY_PAYLOAD!');
} else {
  console.log('Could not find DUMMY_PAYLOAD anchor.');
}
