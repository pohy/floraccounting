import { fbRedirectURI, fbAppID, fbAPI, fbSecret } from './config';
import fetch from 'node-fetch';

export interface IParams {
    [parameter: string]: string;
}

export class Facebook {
    public static OAuthDialogURL = `https://facebook.com/dialog/oauth?client_id=${fbAppID}&redirect_uri=${fbRedirectURI}&scope=email`;

    private accessToken?: string;

    public async authenticate(code: string) {
        const { access_token, rest } = await this.get('/oauth/access_token', {
            client_id: fbAppID,
            redirect_uri: fbRedirectURI,
            client_secret: fbSecret,
            code,
        });
        console.log('TOKEN: ', access_token);
        console.log('REST: ', rest);
        this.accessToken = access_token;
        return access_token;
    }

    public async get(endpoint: string, parameters: IParams): Promise<any> {
        if (!this.accessToken) {
            console.warn(
                `Attempting to fetch '${endpoint}' without an access token`,
            );
        }
        const urlParameters = Object.keys(parameters)
            .map(
                (parameterKey) => `${parameterKey}=${parameters[parameterKey]}`,
            )
            .concat(
                this.accessToken ? [`access_token=${this.accessToken}`] : [],
            )
            .join('&');
        const url = `${fbAPI}${endpoint}${
            urlParameters ? '?' + urlParameters : ''
        }`;
        console.log(url);
        return await fetch(url).then((response) => response.json());
    }
}

export const facebook = new Facebook();
