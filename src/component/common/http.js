const API_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:3001';

export function get(endpoint) {
    return fetchJSON(endpoint);
}

export function post(endpoint, _body) {
    const body = JSON.stringify(_body);
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    };
    return fetchJSON(endpoint, options);
}

async function fetchJSON(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return response.json();
}
