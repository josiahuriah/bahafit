#!/usr/bin/env node
/* eslint-disable */
/**
 * Simulate a Fygaro payment webhook against a running local dev server.
 *
 * Usage:
 *   node scripts/simulate-fygaro-webhook.js <registrationId> [--status=succeeded|failed|refunded] [--url=http://localhost:3000]
 *
 * It calls /api/dev/fygaro-simulate, which signs and POSTs a fake webhook
 * to /api/webhooks/fygaro using the same secret your app is using.
 */

const args = process.argv.slice(2)
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node scripts/simulate-fygaro-webhook.js <registrationId> [--status=succeeded|failed|refunded] [--url=http://localhost:3000]`)
  process.exit(args.length === 0 ? 1 : 0)
}

const registrationId = args.find(a => !a.startsWith('--'))
const statusArg = args.find(a => a.startsWith('--status='))
const urlArg = args.find(a => a.startsWith('--url='))

const status = statusArg ? statusArg.split('=')[1] : 'succeeded'
const baseUrl = urlArg ? urlArg.split('=')[1] : 'http://localhost:3000'

if (!registrationId) {
  console.error('Error: registrationId is required.')
  process.exit(1)
}

const endpoint = `${baseUrl.replace(/\/$/, '')}/api/dev/fygaro-simulate`

;(async () => {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId, status }),
    })
    const json = await res.json().catch(() => ({}))
    console.log(`HTTP ${res.status}`)
    console.log(JSON.stringify(json, null, 2))
    if (!res.ok) process.exit(2)
  } catch (e) {
    console.error('Request failed:', e.message)
    process.exit(3)
  }
})()
