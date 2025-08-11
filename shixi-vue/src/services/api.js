export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
    }
    return res.json()
}

export function health() {
    return request('/health')
}

export function predict({ symbol, horizon, model }) {
    return request('/predict', {
        method: 'POST',
        body: JSON.stringify({ symbol, horizon, model }),
    })
}

export function saveAlertRules(rules) {
    return request('/alerts/rules', {
        method: 'POST',
        body: JSON.stringify({ rules }),
    })
}

// Optional endpoints (not yet used)
export function login({ username, password }) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
}
export function forgotPassword(email) {
    return request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
}
export function contactSupport(payload) {
    return request('/support/contact', { method: 'POST', body: JSON.stringify(payload) })
}
export function getPersonalization() { return request('/personalization') }
export function savePersonalization(payload) { return request('/personalization', { method: 'POST', body: JSON.stringify(payload) }) }


