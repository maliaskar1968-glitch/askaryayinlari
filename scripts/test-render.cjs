const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlContent = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 900px;
    height: 900px;
    background: linear-gradient(135deg, #090d2e 0%, #1e1b4b 50%, #4338ca 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: white;
  }
  h1 { font-size: 54px; font-weight: 800; }
</style>
</head>
<body>
  <h1>Test Banner</h1>
</body>
</html>`;

const tempHtml = path.resolve('temp_test.html');
const tempPng = path.resolve('temp_test.png');
fs.writeFileSync(tempHtml, htmlContent);

try {
  const cmd = `"${chromePath}" --headless=new --disable-gpu --screenshot="${tempPng}" --window-size=900,900 "${tempHtml}"`;
  console.log('Running cmd...');
  execSync(cmd, { stdio: 'inherit' });
  console.log('Exists:', fs.existsSync(tempPng), 'Size:', fs.existsSync(tempPng) ? fs.statSync(tempPng).size : 0);
} catch (e) {
  console.error('Error:', e.message);
} finally {
  if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
  if (fs.existsSync(tempPng)) fs.unlinkSync(tempPng);
}
