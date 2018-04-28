const API_URL =
    process.env.NODE_ENV === 'production' ? '/api/v2' : 'http://localhost:3001';

export function get(endpoint: string) {
    return fetchJSON(endpoint);
}

export function post(endpoint: string, _body: any) {
    const body = JSON.stringify(_body);
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    };
    return fetchJSON(endpoint, options);
}

async function fetchJSON(endpoint: string, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return response.json();
}
