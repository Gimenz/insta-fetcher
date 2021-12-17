/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Rabu, 8 Desember 2021
 */

import { shortcodeFormatter } from './utils';
import { IGFetch, IGUser, IGStories } from './helper/RequestHandler';
import { CookieHandler } from './helper/CookieHandler';
import { username, url, session_id } from './types';
import { IGPostMetadata, links, PostGraphQL } from './types/PostMetadata';
import { IGUserMetadata, UserGraphQL } from './types/UserMetadata';
import {
	IGStoriesMetadata,
	IGStoriesMetadataUser,
	ItemStories,
	StoriesGraphQL,
} from './types/StoriesMetadata';
const cookie = new CookieHandler();

export class igApi {
	private session_id: session_id;
	constructor(session_id: session_id = '') {
		this.session_id = session_id;
		this.setCookie(this.session_id);
	}

	/**
	 * Set session id for most all IG Request
	 * @param {session_id} session_id
	 */
	setCookie(session_id: session_id = this.session_id) {
		try {
			if (cookie.check()) {
				cookie.save(session_id);
			} else {
				cookie.update(session_id);
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	/**
	 * get user id by username
	 * @param {username} username
	 * @returns
	 */
	async getIdByUsername(username: username): Promise<Number> {
		try {
			const { data } = await IGFetch.get(`/${username}/?__a=1`);
			return data.graphql.user.id;
		} catch (error: any) {
			if (error.response.status == 404) {
				throw new Error('Post Not Found');
			} else if (error.response.status == 403) {
				throw new Error('Forbidden, try set cookie first');
			} else if (error.response.status == 401) {
				throw new Error('Unauthorized, try set cookie first');
			} else if (error.request) {
				throw new Error(error.request);
			} else {
				throw new Error(error.message);
			}
		}
	}

	/**
	 * format metadata
	 * @param {Graphql} metadata
	 * @returns
	 */
	private formatSidecar(metadata: PostGraphQL): Array<links> {
		const graphql = metadata.shortcode_media;
		let links: links[] = [];
		if (graphql.__typename == 'GraphSidecar') {
			for (let i = 0; i < graphql.edge_sidecar_to_children.edges.length; i++) {
				if (
					graphql.edge_sidecar_to_children.edges[i].__typename == 'GraphVideo'
				) {
					links.push({
						type: 'video',
						url: graphql.edge_sidecar_to_children.edges[i].node.video_url,
						dimensions:
							graphql.edge_sidecar_to_children.edges[i].node.dimensions,
					});
				} else {
					links.push({
						type: 'image',
						url: graphql.edge_sidecar_to_children.edges[i].node.display_url,
						dimensions:
							graphql.edge_sidecar_to_children.edges[i].node.dimensions,
					});
				}
			}
		} else if (graphql.__typename == 'GraphVideo') {
			links.push({
				type: 'video',
				url: graphql.video_url,
				dimensions: graphql.dimensions,
			});
		} else if (graphql.__typename == 'GraphImage') {
			links.push({
				type: 'image',
				url: graphql.display_url,
				dimensions: graphql.dimensions,
			});
		}
		return links;
	}

	/**
	 * fetch instagram post by url
	 * @param {url} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
	 * @returns {Promise<IGPostMetadata>}
	 */
	async fetchPost(url: url): Promise<IGPostMetadata> {
		try {
			const shortcode = shortcodeFormatter(url);
			const graphql: PostGraphQL = (await IGFetch.get(`/p/${shortcode}/?__a=1`))
				.data.graphql;
			const metaData = graphql.shortcode_media;
			return {
				username: metaData.owner.username,
				name: metaData.owner.full_name,
				id: metaData.id,
				shortcode: metaData.shortcode,
				taken_at_timestamp: metaData.taken_at_timestamp,
				likes: metaData.edge_media_preview_like.count,
				caption: metaData.edge_media_to_caption.edges[0].node.text
					? metaData.edge_media_to_caption.edges[0].node.text
					: '-',
				media_count:
					metaData.__typename == 'GraphSidecar'
						? metaData.edge_sidecar_to_children.edges.length
						: 1,
				comment_count: metaData.edge_media_to_parent_comment.count,
				links: this.formatSidecar(graphql),
			};
		} catch (error: any) {
			if (error.response.status == 404) {
				throw new Error('Post Not Found');
			} else if (error.response.status == 403) {
				throw new Error('Forbidden, try set cookie first');
			} else if (error.response.status == 401) {
				throw new Error('Unauthorized, try set cookie first');
			} else if (error.request) {
				throw new Error(error.request);
			} else {
				throw new Error(error.message);
			}
		}
	}

	/**
	 * fetch profile by username
	 * @param {String} username
	 * @returns {Promise<IGUserMetadata>}
	 */
	async fetchUser(username: username): Promise<IGUserMetadata> {
		try {
			const userID = await this.getIdByUsername(username);
			const { data } = await IGUser.get(`/${userID}/info/`);
			const graphql: UserGraphQL = data;
			return {
				id: graphql.user.pk,
				username: graphql.user.username,
				fullname: graphql.user.full_name,
				followers: graphql.user.follower_count,
				following: graphql.user.following_count,
				post_count: graphql.user.media_count,
				is_private: graphql.user.is_private,
				is_verified: graphql.user.is_verified,
				biography: graphql.user.biography,
				external_url: graphql.user.external_url,
				total_igtv_videos: graphql.user.total_igtv_videos,
				has_videos: graphql.user.has_videos,
				hd_profile_pic_url_info: graphql.user.hd_profile_pic_url_info,
				has_highlight_reels: graphql.user.has_highlight_reels,
				has_guides: graphql.user.has_guides,
				is_business: graphql.user.is_business,
				contact_phone_number: graphql.user.contact_phone_number,
				public_email: graphql.user.public_email,
				account_type: graphql.user.account_type,
			};
		} catch (error: any) {
			if (error.response) {
				throw new Error(error.response);
			} else if (error.request) {
				throw new Error(error.request);
			} else {
				throw new Error(error.message);
			}
		}
	}

	private parseStories(metadata: StoriesGraphQL): Array<ItemStories> {
		const items = metadata.items;
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
					original_width: items[i].original_width,
					original_height: items[i].original_height,
					has_audio:
						items[i].has_audio !== undefined ? items[i].has_audio : null,
					video_duration:
						items[i].video_duration !== undefined
							? items[i].video_duration
							: null,
					caption: items[i].caption,
				});
			} else {
				storyList.push({
					type: 'video',
					mimetype: 'video/mp4',
					url: items[i].video_versions[0].url,
					taken_at: items[i].taken_at,
					expiring_at: items[i].expiring_at,
					id: items[i].id,
					original_width: items[i].original_width,
					original_height: items[i].original_height,
					has_audio:
						items[i].has_audio !== undefined ? items[i].has_audio : false,
					video_duration:
						items[i].video_duration !== undefined
							? items[i].video_duration
							: null,
					caption: items[i].caption,
				});
			}
		}
		return storyList;
	}

	/**
	 * fetches stories metadata (THIS FUNCTION REQUIRES SESSION ID)
	 * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
	 * @returns
	 */
	async fetchStories(username: username): Promise<IGStoriesMetadata> {
		try {
			const userID = await this.getIdByUsername(username);
			const { data } = await IGStories.get(`/${userID}/reel_media/`);
			const graphql: StoriesGraphQL = data;
			const isFollowing: boolean =
				typeof graphql.user.friendship_status !== 'undefined';

			if (!isFollowing && graphql.user.is_private)
				throw new Error('Private profile');
			if (graphql.items.length == 0) throw new Error('Stories not available');
			return {
				username: graphql.user.username,
				stories_count: graphql.media_count,
				stories: this.parseStories(graphql),
			};
		} catch (error: any) {
			if (error.response) {
				throw new Error(error.response);
			} else if (error.request) {
				throw new Error(error.request);
			} else {
				throw new Error(error.message);
			}
		}
	}
}
