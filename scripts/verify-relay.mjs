// End-to-end check of the agent bridge: real relay process <-stdio-> scripted MCP client, and
// <-WebSocket-> the app in Chrome with "Agent bridge" turned on.
// Usage: URL=http://localhost:5199/ node scripts/verify-relay.mjs
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { chromium } from 'playwright-core'

const URL_ = process.env.URL ?? 'http://localhost:5199/'
const relay = spawn('node_modules/.bin/webmcp-local-relay', [], {
  stdio: ['pipe', 'pipe', 'inherit'],
})
const pending = new Map()
let nextId = 1
createInterface({ input: relay.stdout }).on('line', (line) => {
  try {
    const msg = JSON.parse(line)
    pending.get(msg.id)?.(msg)
  } catch {}
})
const rpc = (method, params) =>
  new Promise((resolve, reject) => {
    const id = nextId++
    const timer = setTimeout(() => reject(new Error(`timeout: ${method}`)), 20000)
    pending.set(id, (m) => (clearTimeout(timer), resolve(m)))
    relay.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
  })
const text = (r) => r.result?.content?.map((c) => c.text).join('\n') ?? JSON.stringify(r.error)
const fail = (msg) => {
  console.error('FAIL:', msg)
  relay.kill()
  process.exit(1)
}

await rpc('initialize', {
  protocolVersion: '2025-06-18',
  capabilities: {},
  clientInfo: { name: 'verify', version: '1' },
})
relay.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.goto(URL_)
await page.waitForSelector('.react-flow__node', { timeout: 60000 })
await page.waitForFunction(() => document.modelContext, null, { timeout: 15000 })
console.log('bridge banner before toggle:', (await page.$('.bridge-banner')) !== null)
await page.click('button:has-text("Agent bridge")')
await page.waitForSelector('.bridge-banner')
console.log(
  'bridge banner after toggle:',
  true,
  '| relay iframe present:',
  await page
    .waitForSelector('iframe[data-webmcp-relay]', { state: 'attached', timeout: 10000 })
    .then(
      () => true,
      () => false,
    ),
)

let names = []
for (let i = 0; i < 20 && !names.some((n) => n.includes('read_sql')); i++) {
  await new Promise((r) => setTimeout(r, 1000))
  names = (await rpc('tools/list', {})).result?.tools?.map((t) => t.name) ?? []
}
console.log('MCP client sees tools:', names)
const readSql = names.find((n) => n.includes('read_sql'))
const writeSql = names.find((n) => n.includes('write_sql'))
if (!readSql || !writeSql) fail('page tools were not relayed to the MCP client')

const before = text(await rpc('tools/call', { name: readSql, arguments: {} }))
console.log('read_sql via relay, first line:', before.split('\n')[0])
const ddl = 'CREATE TABLE relayed (id int primary key, note text);'
console.log(
  'write_sql via relay:',
  text(await rpc('tools/call', { name: writeSql, arguments: { sql: ddl } })),
)
await page
  .waitForFunction(
    () =>
      [...document.querySelectorAll('.react-flow__node')].some((n) =>
        n.textContent.includes('relayed'),
      ),
    null,
    { timeout: 15000 },
  )
  .then(
    () => console.log('diagram shows the relayed table: true'),
    () => fail('diagram did not update'),
  )
const bad = await rpc('tools/call', {
  name: writeSql,
  arguments: { sql: 'create table x (id int,, );' },
})
console.log('invalid write via relay:', text(bad).slice(0, 140), '| isError:', bad.result?.isError)

// turning the bridge off must disconnect
await page.click('button:has-text("Agent bridge")')
await page.waitForFunction(
  () =>
    !document.querySelector('iframe[data-webmcp-relay]') &&
    !document.querySelector('.bridge-banner'),
)
console.log('after turning off: iframe removed, banner gone')
await browser.close()
relay.kill()
