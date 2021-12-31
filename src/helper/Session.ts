import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { config } from "../config";
import { csrfToken, password, session_id, username } from "../types";

const getCsrfToken = async(): Promise<csrfToken> => {
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
            'user-agent': config.iPhone,
            'cache-Control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            referer: 'https://www.instagram.com/accounts/login/?source=auth_switcher'
        }
    
        const { headers, data }: AxiosResponse = await axios({
            method: 'POST',
            url: 'https://www.instagram.com/accounts/login/ajax/',
            data: `username=${username}&enc_password=#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${password}&queryParams=%7B%7D&optIntoOneTap=false`,
            headers: genHeaders
        });
    
        const { userId: userID, authenticated } = (data);
        if (authenticated) {
            let session_id: session_id = headers["set-cookie"]?.find(x => x.match(/sessionid=(.*?);/)?.[1])?.match(/sessionid=(.*?);/)?.[1] || '';
            return session_id;
        } else {
            throw new Error('Username or password is incorrect. Please check and try again');
        }
    } catch (error) {
        throw error;
    }
}