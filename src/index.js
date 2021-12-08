/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Rabu, 8 Desember 2021
 */

const { UrlFormatter } = require("../utils");
const { IGFetch, IGUser, IGStories } = require("./helper/RequestHandler");
const Cookie = require('./helper/cookieHandler')
const cookie = new Cookie()

/**
 * Set cookie before making all requests using this module
 * @param {String} session_id 
 * @returns boolean
 */
async function setCookie(session_id) {
    try {
        if (cookie.check()) {
            cookie.save(session_id);
        } else {
            cookie.update(session_id);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * get user id by username
 * @param {String} username 
 * @returns data
 */
async function getIdByUsername(username) {
    try {
        const { data } = await IGFetch.get(`/${username}/?__a=1`);
        return data.graphql.user.id;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * fetch instagram post by url
 * @param {String} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
 * @returns {Object}
 */
async function fetchPost(url) {
    try {
        const shortcode = UrlFormatter(url);
        const { data } = await IGFetch.get(`/p/${shortcode}/?__a=1`);
        const metaData = data.graphql.shortcode_media;
        if (metaData.__typename == 'GraphVideo') {
            let data = {
                username: metaData.owner.username,
                name: metaData.owner.full_name,
                likes: metaData.edge_media_preview_like.count,
                caption: metaData.edge_media_to_caption.edges[0].node.text ? metaData.edge_media_to_caption.edges[0].node.text : '-',
                media_count: 1,
                comment_count: metaData.edge_media_to_parent_comment.count,
                links: [{
                    type: 'video',
                    url: metaData.video_url
                }]
            }
            return data;
        } else if (metaData.__typename == 'GraphImage') {
            let data = {
                username: metaData.owner.username,
                name: metaData.owner.full_name,
                likes: metaData.edge_media_preview_like.count,
                caption: metaData.edge_media_to_caption.edges[0].node.text ? metaData.edge_media_to_caption.edges[0].node.text : '-',
                media_count: 1,
                comment_count: metaData.edge_media_to_parent_comment.count,
                links: [{
                    type: 'video',
                    url: metaData.display_url
                }]
            }
            return data;
        } else if (metaData.__typename == 'GraphSideCar') {
            let link = [];
            for (let i = 0; i < metaData.edge_sidecar_to_children.edges.length; i++) {
                if (metaData.edge_sidecar_to_children.edges[i].__typename == 'GraphVideo') {
                    link.push({
                        type: 'video',
                        url: metaData.edge_sidecar_to_children.edges[i].node.display_url
                    });
                } else {
                    link.push({
                        type: 'image',
                        url: metaData.edge_sidecar_to_children.edges[i].node.video_url
                    });
                }
            }
            let data = {
                username: metaData.owner.username,
                name: metaData.owner.full_name,
                likes: metaData.edge_media_preview_like.count,
                caption: metaData.edge_media_to_caption.edges[0].node.text ? metaData.edge_media_to_caption.edges[0].node.text : '-',
                media_count: metaData.edge_sidecar_to_children.edges.length,
                comment_count: metaData.edge_media_to_parent_comment.count,
                links: link
            }
            return data;
        }
    } catch (error) {
        if (error.message.includes('404')) throw new Error('post not found');
    }
}

/**
 * fetch profile by username
 * @param {String} username 
 * @returns {JSON}
 */
async function fetchUser(username) {
    try {
        const userID = await getIdByUsername(username);
        const { data } = await IGUser.get(`/${userID}/info/`);
        return data;
    } catch (error) {
        if (error.message.includes('404')) throw new Error('username not found');
    }
}

/**
 * fetches stories metadata (THIS FUNCTION REQUIRES SESSION ID)
 * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
 * @returns
 */
async function fetchStories(username) {
    try {
        const userID = await getIdByUsername(username);
        const { data } = await IGStories.get(`/${userID}/reel_media/`);
        if (data.user.is_private) throw new Error('Private profile');
        if (data.items.length == 0) throw new Error('Stories not available');
        items = data.items;
        let storyList = new Array();
        for (let i = 0; i < items.length; i++) {
            if (items[i].media_type == 1) {
                storyList.push({
                    type: 'image',
                    mimetype: 'image/jpeg',
                    url: items[i].image_versions2.candidates[0].url,
                    taken_at: items[i].taken_at,
                    expiring_at: items[i].expiring_at,
                    id: items[i].id,
                    swipeup_link: items[i].story_cta !== undefined ? items[i].story_cta.map(x => decodeURIComponent(x.links.map(v => v.webUri))) : null
                })
            } else {
                storyList.push({
                    type: 'video',
                    mimetype: 'video/mp4',
                    url: items[i].video_versions[0].url,
                    taken_at: items[i].taken_at,
                    expiring_at: items[i].expiring_at,
                    id: items[i].id,
                    swipeup_link: items[i].story_cta !== undefined ? items[i].story_cta.map(x => decodeURIComponent(x.links.map(v => v.webUri))) : null
                })
            }
        }
        const result = {
            user: data.user,
            stories_count: data.media_count,
            data: storyList
        }
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}
/**
 * fetches metadata from hashtags in IG explore
 * @param {string} hashtags 
 * @returns 
 */
async function explore(hashtags) {
    try {
        const { data } = await IGFetch.get(`explore/tags/${hashtags}/?__a=1`);
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    setCookie,
    fetchUser,
    fetchPost,
    fetchStories,
    explore
}

