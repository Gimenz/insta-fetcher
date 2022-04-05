import axios, { AxiosRequestHeaders, AxiosResponse, AxiosError } from "axios";
import { config } from "../config";
import { csrfToken, password, session_id, username } from "../types";

export const getCsrfToken = async(): Promise<csrfToken> => {
    try {
        const { headers } = await axios({
            method: 'GET',
            url: 'https://www.instagram.com/accounts/login/'
        });
        let csrfToken: csrfToken = headers["set-cookie"]?.find(x => x.match(/csrftoken=(.*?);/)?.[1])?.match(/csrftoken=(.*?);/)?.[1] || '';      
        return csrfToken
    } catch (error) {
        throw error
    }
}

/**
 * get session id using login method
 * @param {username} username instagram username
 * @param {password} password instagram password
 * @returns {session_id} session id
 */
export const getSessionId = async (username: username, password: password): Promise<session_id> => {
    if (typeof username !== 'string' || typeof password !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof username !== 'string' ? typeof username : typeof password}`);
    }

    try {
        const csrfToken = await getCsrfToken();
        const genHeaders: AxiosRequestHeaders = {
            'X-CSRFToken': csrfToken,
            'user-agent': config.desktop,
            'cache-Control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            referer: 'https://www.instagram.com/accounts/login/?source=auth_switcher',
            'authority': 'www.instagram.com',
            'origin': 'https://www.instagram.com',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'x-ig-app-id': '936619743392459',
            'x-ig-www-claim': 'hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf',
            'x-instagram-ajax': '1',
            'x-requested-with': 'XMLHttpRequest',
            'Cookie': 'csrftoken=' + csrfToken + ';'
        }
    
        const { headers, data }: AxiosResponse = await axios({
            method: 'POST',
            url: 'https://www.instagram.com/accounts/login/ajax/',
            data: `username=${username}&enc_password=#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${password}&queryParams=%7B%22source%22%3A%22auth_switcher%22%7D&optIntoOneTap=false`,
            headers: genHeaders
        });
    
        const { userId: userID, authenticated } = (data);
        if (authenticated) {           
            let session_id: session_id = headers["set-cookie"]?.find(x => x.match(/sessionid=(.*?);/)?.[1])?.match(/sessionid=(.*?);/)?.[1] || '';
            return session_id;
        } else {
            throw new Error('Username or password is incorrect. Please check and try again');
        }
    } catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw error.toJSON()
        } else {
            throw error
        }
    }
}