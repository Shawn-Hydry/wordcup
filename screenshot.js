const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });

  // 获取API数据
  console.log('Fetching data from API...');
  const matchesRes = await fetchJSON('http://localhost:3001/api/matches');
  const predictRes = await fetchJSON('http://localhost:3001/api/predict/match-001/full');
  console.log('Data fetched, matches:', matchesRes.data.length);

  // 读取HTML并注入数据
  let html = fs.readFileSync('c:\\Users\\linso\\Documents\\wordcup\\preview.html', 'utf-8');
  const dataScript = `<script>window.__INIT_DATA__=${JSON.stringify({matches:matchesRes.data,predictData:predictRes.data})};</script>`;
  html = html.replace('<script>', dataScript + '\n<script>');

  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const text = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('Page content:', text);

  // 截4个Tab
  for (let tab = 0; tab < 4; tab++) {
    await page.evaluate((t) => { if(window._tab) window._tab(t); }, tab);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `c:\\Users\\linso\\Documents\\wordcup\\screenshot-tab${tab}.png` });
    console.log(`Tab ${tab} done`);
  }

  // 默认Tab 0全页截图
  await page.evaluate(() => { if(window._tab) window._tab(0); });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'c:\\Users\\linso\\Documents\\wordcup\\screenshot-final.png' });
  console.log('All done!');
  await browser.close();
})();