export class HTTP {
    public static ApiURL = process.env.NODE_ENV === 'production'
        ? '/api'
        : 'https://10.0.0.5:3001';
    private token: string | null = null;

    public updateToken(token: string | null) {
        this.token = token;
    }

    public get(endpoint: string) {
        return this.fetchJSONFromAPI(endpoint);
    }

    public post(endpoint: string, body: any) {
        const bodyJSON = JSON.stringify(body);
        const options: RequestInit = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyJSON,
        };
        return this.fetchJSONFromAPI(endpoint, options);
    }

    public fetchJSONFromAPI(endpoint: string, options: RequestInit = {}) {
        return this.fetchJSON(`${HTTP.ApiURL}${endpoint}`, options);
    }

    public async fetchJSON(url: string, requestOptions: RequestInit = {}) {
        const options = {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                ...(this.token
                    ? { Authorization: `Bearer ${this.token}` }
                    : {}),
            },
        };
        const response = await fetch(url, options);
        if (response.status >= 400) {
            const responseBody = await response.text();
            throw new Error(responseBody);
        }
        return response.json();
    }
}

export const http = new HTTP();
