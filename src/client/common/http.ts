let token: string | null = null;

// TODO: Rewrite into a class
export const API_URL =
    process.env.NODE_ENV === 'production' ? '/api' : 'https://10.0.0.5:3001';

export function updateToken(newToken: string | null) {
    token = newToken;
}

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
    return fetchJSON(`${API_URL}${endpoint}`, options);
}

export async function fetchJSON(url: string, requestOptions: RequestInit = {}) {
    const options = {
        ...requestOptions,
        headers: {
            ...requestOptions.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };
    const response = await fetch(url, options);
    if (response.status >= 400) {
        const responseBody = await response.text();
        throw new Error(responseBody);
    }
    return response.json();
}
