import axios from 'axios';
import { config } from '../config';
import { CookieHandler } from './CookieHandler';
const session_id = new CookieHandler().get();

const headers = {
	'cache-control': 'no-cache',
	'user-agent': config.android,
	cookie: `sessionid=${session_id};`,
	'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6,ru;q=0.5',
	'Accept-Encoding': 'gzip, deflate, br',
	pragma: 'no-cache',
	'sec-fetch-mode': 'navigate',
	'sec-fetch-site': 'none',
	'sec-fetch-user': '?1',
	'upgrade-insecure-requests': '1',
};

/** Fetches Using Instagram Base Url */
export const IGFetch = axios.create({
	baseURL: config.instagram_base_url,
	headers,
});

/** Fetches Instagram User */
export const IGUser = axios.create({
	baseURL: config.instagram_user_url,
	headers,
});

/** Fetches Instagram Stories */
export const IGStories = axios.create({
	baseURL: config.instagram_stories_url,
	headers,
});

export const IGHighlight = axios.create({
	baseURL: config.instagram_graphql,
	headers
})

/** Fetches Instagram Search Users | Places | Hashtags*/
export const IGSearch = axios.create({
	baseURL: config.instagram_search_url,
	headers,
});
