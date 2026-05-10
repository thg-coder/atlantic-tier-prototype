// Safe sessionStorage wrapper. Falls back to in-memory map when blocked
// (cross-origin iframe privacy, Safari ITP, etc).

const memory = new Map()
let warned = false

function warnOnce(err) {
  if (warned) return
  warned = true
  // eslint-disable-next-line no-console
  console.warn('[Atlantic] sessionStorage unavailable, using in-memory fallback.', err)
}

export function safeGet(key) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const v = sessionStorage.getItem(key)
      return v == null ? null : v
    }
  } catch (err) {
    warnOnce(err)
  }
  return memory.has(key) ? memory.get(key) : null
}

export function safeSet(key, value) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value)
      return
    }
  } catch (err) {
    warnOnce(err)
  }
  memory.set(key, value)
}

export function safeRemove(key) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key)
    }
  } catch (err) {
    warnOnce(err)
  }
  memory.delete(key)
}
