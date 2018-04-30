const API_URL =
    process.env.NODE_ENV === 'production' ? '/api/v2' : 'http://localhost:3001';

export function get(endpoint: string) {
    return fetchJSONFromAPI(endpoint);
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
    return fetchJSONFromAPI(endpoint, options);
}

export function fetchJSONFromAPI(endpoint: string, options = {}) {
    return fetchJSON(`${API_URL}${endpoint}`);
}

export async function fetchJSON(url: string, options = {}) {
    const response = await fetch(url, options);
    if (response.status >= 400) {
        const responseBody = await response.text();
        throw new Error(responseBody);
    }
    return response.json();
}
