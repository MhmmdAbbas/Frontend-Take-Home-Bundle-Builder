import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.API_PORT) || 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.join(__dirname, '../src/data/products.json')

function sendJson(res, status, body) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(payload)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, '')
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    try {
      const data = await readFile(productsPath, 'utf8')
      sendJson(res, 200, data)
    } catch {
      sendJson(res, 500, { error: 'Failed to load products' })
    }
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, { error: 'Not found' })
})

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use.\n` +
        `Stop the other process, or set API_PORT to a free port.\n` +
        `Windows:  Get-NetTCPConnection -LocalPort ${PORT} | Select OwningProcess\n` +
        `          Stop-Process -Id <PID> -Force\n` +
        `macOS/Linux:  lsof -i :${PORT} then kill <PID>\n`,
    )
    process.exit(1)
  }
  throw err
})

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
  console.log(`  GET /api/products`)
})
