// Usage: node scripts/screenshot.mjs <url> <out.png> [--offline] [--wait selector]
import { chromium } from 'playwright-core'

const [url, out, ...flags] = process.argv.slice(2)
const waitFor = flags.includes('--wait') ? flags[flags.indexOf('--wait') + 1] : '.react-flow__node'
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 })
page.on(
  'console',
  (m) => ['error', 'warning'].includes(m.type()) && console.log(`[${m.type()}]`, m.text()),
)
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
const requests = []
page.on('request', (r) => requests.push(r.url()))
await page.goto(url)
if (flags.includes('--offline')) await page.context().setOffline(true)
await page.waitForSelector(waitFor, { timeout: 60000 })
await page.waitForTimeout(1500)
await page.screenshot({ path: out })
console.log(
  'external requests:',
  requests.filter(
    (u) =>
      !u.startsWith(url.split('/').slice(0, 3).join('/')) &&
      !u.startsWith('data:') &&
      !u.startsWith('blob:'),
  ),
)
await browser.close()
