import axios from 'axios';
import { config } from '../config';
import { CookieHandler } from './CookieHandler';
let c = new CookieHandler();
let session_id = c.get()

const buildHeaders = (agent: string = config.android) => {
	return {
		'cache-control': 'no-cache',
		'user-agent': agent,
		'cookie': `sessionid=${session_id};`,
		'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6,ru;q=0.5',
		'Accept-Encoding': 'gzip, deflate, br',
		'pragma': 'no-cache',
		'sec-fetch-mode': 'navigate',
		'sec-fetch-site': 'none',
		'sec-fetch-user': '?1',
		'upgrade-insecure-requests': '1',
	};
}

/** Fetches Using Instagram Base Url with Desktop user-agent */
export const IGFetchDesktop = axios.create({
	baseURL: config.instagram_base_url,
	headers: buildHeaders(config.desktop)
});

/** Fetches Using Instagram Base Url with Android user-agent */
export const IGFetchAndroid = axios.create({
	baseURL: config.instagram_base_url,
	headers: buildHeaders(config.android)
});

/** Fetches Using Instagram Base Url with iPhone user-agent */
export const IGFetchiPhone = axios.create({
	baseURL: config.instagram_base_url,
	headers: buildHeaders(config.iPhone)
});

/** Fetches Instagram User */
export const IGUser = axios.create({
	baseURL: config.instagram_user_url,
	headers: buildHeaders(),
});

/** Fetches Instagram Stories */
export const IGStories = axios.create({
	baseURL: config.instagram_stories_url,
	headers: buildHeaders(config.iPhone),
});

/** Fetches Instagram Highlights */
export const IGHighlight = axios.create({
	baseURL: config.instagram_graphql,
	headers: buildHeaders(config.iPhone)
})

/** Fetches Instagram Search Users | Places | Hashtags*/
export const IGSearch = axios.create({
	baseURL: config.instagram_search_url,
	headers: buildHeaders()
});
