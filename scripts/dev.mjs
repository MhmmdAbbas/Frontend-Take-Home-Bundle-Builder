import { spawn } from 'node:child_process'

const children = [
  spawn('node', ['server/index.mjs'], { stdio: 'inherit', shell: true }),
  spawn('npx', ['vite'], { stdio: 'inherit', shell: true }),
]

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

for (const child of children) {
  child.on('exit', (code, signal) => {
    if (signal) return
    if (code && code !== 0) shutdown(code)
  })
}
