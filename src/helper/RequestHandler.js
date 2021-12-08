const { default: Axios } = require('axios');
const { config } = require('../config');
const CookieHandler = require('./cookieHandler');
const session_id = new CookieHandler().get();

const headers = {
    'cache-control': 'no-cache',
    'user-agent': config.android,
    'cookie': `sessionid=${session_id};`,
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6,ru;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'pragma': 'no-cache',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1'
}

const IGFetch = Axios.create({
    baseURL: config.instagram_base_url,
    headers
});

const IGUser = Axios.create({
    baseURL: config.instagram_user_url,
    headers
});

const IGStories = Axios.create({
    baseURL: config.instagram_stories_url,
    headers
});

module.exports = {
    IGFetch,
    IGUser,
    IGStories
}