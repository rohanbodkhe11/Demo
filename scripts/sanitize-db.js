const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'db.json')
const outPath = path.join(__dirname, '..', 'data', 'db.example.json')

function sanitize(obj) {
  if (Array.isArray(obj)) return obj.map(sanitize)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase().includes('password')) continue
      if (k.toLowerCase().includes('email')) out[k] = 'redacted@example.com'
      else if (k.toLowerCase().includes('mobile') || k.toLowerCase().includes('phone')) out[k] = '0000000000'
      else out[k] = sanitize(obj[k])
    }
    return out
  }
  return obj
}

try {
  const raw = fs.readFileSync(dbPath, 'utf8')
  const parsed = JSON.parse(raw)
  const sanitized = sanitize(parsed)
  fs.writeFileSync(outPath, JSON.stringify(sanitized, null, 2), 'utf8')
  console.log('Wrote', outPath)
} catch (e) {
  console.error('Failed to sanitize db:', e.message)
  process.exit(1)
}
