/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Rabu, 8 Desember 2021
 */

import axios, { AxiosError } from 'axios';
import { getPostType, shortcodeFormatter } from './utils/index';
import { IGUser, IGStories, IGHighlight, IGFetchiPhone, IGFetchAndroid, IGFetchDesktop } from './helper/RequestHandler';
import { CookieHandler } from './helper/CookieHandler';
import { username, url, session_id, MimeType, ProductType, MediaType, IGPostType } from './types';
import { IGPostMetadata, links, PostGraphQL } from './types/PostMetadata';
import { IGUserMetadata, UserGraphQL } from './types/UserMetadata';
import {
	IGStoriesMetadata,
	IGStoriesMetadataUser,
	ItemStories,
	StoriesGraphQL,
} from './types/StoriesMetadata';
import { highlight_ids_query, highlight_media_query } from './helper/query';
import { HightlighGraphQL, ReelsIds } from './types/HighlightMetadata';
import { HMedia, IHighlightsMetadata, IReelsMetadata, ReelsMediaData } from './types/HighlightMediaMetadata';
import { IPostModels, IRawBody, MediaUrls } from './types/PostModels';

export * from './utils'
export * from './helper/Session';
export class igApi {
	/**
	 * Recommended to set session id for most all IG Request
	 * @param session_id session id you can get it by using getSessionId function, see README.md or example file
	 */
	constructor(public session_id: session_id = '') {
		this.session_id = session_id;
		this.setCookie(this.session_id);
	}
	private cookie = new CookieHandler(this.session_id)
	
	/**
	 * Set session id for most all IG Request
	 * @param {session_id} session_id
	 */
	public setCookie = (session_id: session_id = this.session_id) => {
		try {
			if (!this.cookie.check()) {
				this.cookie.save(session_id);
			} else {
				this.cookie.update(session_id);
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
	public getIdByUsername = async (username: username): Promise<string> => {
		try {
			const { data } = await IGFetchiPhone.get(`/${username}/?__a=1`);
			return data.graphql.user.id;
		} catch (error: any) {
			if (error.response.status == 403) {
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

	// /**
	//  * format metadata
	//  * @param {PostGraphQL} metadata
	//  * @returns
	//  */
	// private _formatSidecar = (metadata: PostGraphQL): Array<links> => {
	// 	const graphql = metadata.shortcode_media;
	// 	let links: links[] = [];
	// 	if (graphql.__typename == 'GraphSidecar') {
	// 		graphql.edge_sidecar_to_children.edges.forEach(doc => {
	// 			let obj = {} as links;
	// 			obj.type = doc.node.is_video ? 'video' : 'image';
	// 			obj.url = doc.node.is_video ? doc.node.video_url : doc.node.display_url;
	// 			obj.dimensions = doc.node.dimensions
	// 			links.push(obj);
	// 		})
	// 	} else if (graphql.__typename == 'GraphVideo') {
	// 		let obj = {} as links;
	// 		obj.type = graphql.is_video ? 'video' : 'image';
	// 		obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
	// 		obj.dimensions = graphql.dimensions
	// 		links.push(obj);
	// 	} else if (graphql.__typename == 'GraphImage') {
	// 		let obj = {} as links;
	// 		obj.type = graphql.is_video ? 'video' : 'image';
	// 		obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
	// 		obj.dimensions = graphql.dimensions
	// 		links.push(obj);
	// 	}
	// 	return links;
	// }

	// /**
	//  * fetch instagram post by url
	//  * @param {url} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
	//  * @returns {Promise<IGPostMetadata>}
	//  */
	// public fetchPost = async (url: url): Promise<IGPostMetadata> => {
	// 	try {
	// 		if (!this.cookie.check()) throw new Error('set cookie first to use this function');
	// 		const post = shortcodeFormatter(url);
	// 		const req = (await IGFetchDesktop.get(`/${post.type}/${post.shortcode}/?__a=1`))
	// 		console.log(req.data);
			
	// 		const graphql: PostGraphQL = req.data.graphql;
	// 		const metaData = graphql.shortcode_media;
		
	// 		return {
	// 			username: metaData.owner.username,
	// 			name: metaData.owner.full_name,
	// 			media_id: metaData.id,
	// 			shortcode: metaData.shortcode,
	// 			taken_at_timestamp: metaData.taken_at_timestamp,
	// 			likes: metaData.edge_media_preview_like.count,
	// 			caption: metaData.edge_media_to_caption.edges.length >= 1
	// 				? metaData.edge_media_to_caption.edges[0].node.text
	// 				: '',
	// 			media_count:
	// 				metaData.__typename == 'GraphSidecar'
	// 					? metaData.edge_sidecar_to_children.edges.length
	// 					: 1,
	// 			comment_count: metaData.edge_media_to_parent_comment.count,
	// 			links: this._formatSidecar(graphql),
	// 		};
	// 	} catch (error: any | AxiosError) {		
	// 		if (axios.isAxiosError(error)) {
	// 			if (error.response?.status == 404) {
	// 				throw new Error('Post Not Found');
	// 			} else if (error.response?.status == 403) {
	// 				throw new Error('Forbidden, try set cookie first');
	// 			} else if (error.response?.status == 401) {
	// 				throw new Error('Unauthorized, try set cookie first');
	// 			} else {
	// 				throw error.toJSON()
	// 			}
	// 		} else {
	// 			throw error;
	// 		}
	// 	}
	// }

	private _formatSidecar = (data: IRawBody): Array<MediaUrls> => {
		const gql = data.items[0]
		let urls: MediaUrls[] = []
		if (gql.product_type == ProductType.CAROUSEL) {
			gql.carousel_media.forEach((v, i, a) => {				
				urls.push({
					id: v.id,
					url: v.media_type == MediaType.IMAGE ? v.image_versions2.candidates[0].url : v.video_versions?.[0].url || '',
					type: v.media_type == MediaType.IMAGE ? 'image' : 'video',
					dimensions: {
						height: v.media_type == MediaType.IMAGE ? v.image_versions2.candidates[0].height : v.video_versions?.[0].height || 0,
						width: v.media_type == MediaType.IMAGE ? v.image_versions2.candidates[0].width : v.video_versions?.[0].width || 0
					}
				})
			})
		} else if (gql.product_type == ProductType.REEL) {
			urls.push({
				id: gql.id,
				url: gql.video_versions[0].url,
				type: 'video',
				dimensions: {
					height: gql.video_versions[0].height,
					width: gql.video_versions[0].width
				}
			})
		} else if (gql.product_type == ProductType.TV) {
			urls.push({
				id: gql.id,
				url: gql.video_versions[0].url,
				type: 'video',
				dimensions: {
					height: gql.video_versions[0].height,
					width: gql.video_versions[0].width
				}
			})
		} else if (gql.product_type == ProductType.SINGLE) {
			urls.push({
				id: gql.id,
				url: gql.media_type == MediaType.IMAGE ? gql.image_versions2.candidates[0].url : gql.video_versions?.[0].url || '',
				type: gql.media_type == MediaType.IMAGE ? 'image' : 'video',
				dimensions: {
					height: gql.media_type == MediaType.IMAGE ? gql.image_versions2.candidates[0].height : gql.video_versions?.[0].height || 0,
					width: gql.media_type == MediaType.IMAGE ? gql.image_versions2.candidates[0].width : gql.video_versions?.[0].width || 0
				}
			})
		}
		return urls
	}

	public fetchPost = async (url: url): Promise<IPostModels> => {
		if (!this.cookie.check()) throw new Error('set cookie first to use this function');
		const post = shortcodeFormatter(url);
		
		const req = (await IGFetchDesktop.get(`/${post.type}/${post.shortcode}/?__a=1`))

		const metadata: IRawBody = req.data
		const item = metadata.items[0]
		try {
			return {
				username: item.user.username,
				name: item.user.full_name,
				postType: getPostType(item.product_type),
				media_id: item.id,
				shortcode: item.code,
				taken_at_timestamp: item.taken_at,
				likes: item.like_count,
				caption: item.caption?.text || null,
				media_count: item.product_type == ProductType.CAROUSEL ? item.carousel_media_count : 1,
				comment_count: item.comment_count,
				video_duration: item?.video_duration || null,
				music: item?.clips_metadata || null,
				links: this._formatSidecar(metadata),
			}
		} catch (error: any | AxiosError) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 404) {
					throw new Error('Post Not Found');
				} else if (error.response?.status == 403) {
					throw new Error('Forbidden, try set cookie first');
				} else if (error.response?.status == 401) {
					throw new Error('Unauthorized, try set cookie first');
				} else {
					throw error.toJSON()
				}
			} else {
				throw error;
			}			
		}
	}

	/**
	 * fetch profile by username
	 * @param {String} username
	 * @returns {Promise<IGUserMetadata>}
	 */
	public fetchUser = async (username: username): Promise<IGUserMetadata> => {
		try {
			const userID = await this.getIdByUsername(username);
			const { data } = await IGUser.get(`/${userID}/info/`);
			const graphql: UserGraphQL = data;
			const isSet: boolean = typeof graphql.user.full_name !== 'undefined';
			if (!this.cookie.check()) throw new Error('set cookie first to use this function');
			if (!isSet && this.cookie.check()) throw new Error('Invalid cookie, pls update with new cookie');
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
		} catch (error: any | AxiosError) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 404) {
					throw new Error('User Not Found');
				} else if (error.response?.status == 403) {
					throw new Error('Forbidden, try set cookie first');
				} else if (error.response?.status == 401) {
					throw new Error('Unauthorized, try set cookie first');
				} else {
					throw error.toJSON()
				}
			} else {
				throw error;
			}
		}
	}

	/**
	 * 
	 * @param {StoriesGraphQL} metadata
	 * @returns {ItemStories[]}
	 */
	private _parseStories = (metadata: StoriesGraphQL): Array<ItemStories> => {
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
	public fetchStories = async(username: username): Promise<IGStoriesMetadata> => {
		try {
			if (!this.cookie.check()) throw new Error('set cookie first to use this function');
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
				stories: this._parseStories(graphql),
			};
		} catch (error: any | AxiosError) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 404) {
					throw new Error('Stories Not Found');
				} else if (error.response?.status == 403) {
					throw new Error('Forbidden, try set cookie first');
				} else if (error.response?.status == 401) {
					throw new Error('Unauthorized, try set cookie first');
				} else {
					throw error.toJSON()
				}
			} else {
				throw error;
			}
		}
	}

	/**
	 * Fetch all reels/highlight id
	 * @param {username} username
	 * @returns 
	 */
	private _getReelsIds = async (username: username): Promise<ReelsIds[]> => {
		try {
			const userID: string = await this.getIdByUsername(username);
			const { data } = await IGHighlight.get('', {
				params: highlight_ids_query(userID)
			})
			const graphql: HightlighGraphQL = data;
			let items = new Array();
			graphql.data.user.edge_highlight_reels.edges.map((edge) => {
				items.push({
					highlight_id: edge.node.id,
					cover: edge.node.cover_media.thumbnail_src,
					title: edge.node.title
				})
			})		
			return items;
		} catch (error: any | AxiosError) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 404) {
					throw new Error('Post Not Found');
				} else if (error.response?.status == 403) {
					throw new Error('Forbidden, try set cookie first');
				} else if (error.response?.status == 401) {
					throw new Error('Unauthorized, try set cookie first');
				} else {
					throw error.toJSON()
				}
			} else {
				throw error;
			}
		}	
	}

	/**
	 * get media urls from highlight id
	 * @param {ids} id of highlight
	 * @returns 
	 */
	private _getReels = async (ids: string): Promise<ReelsMediaData[]> => {
		try {
			const { data } = await IGHighlight.get('', { params: highlight_media_query(ids) })
			const graphql: HMedia = data;
			let result: ReelsMediaData[] = graphql.data.reels_media[0].items.map((item) => ({
				media_id: item.id,
				mimetype: item.is_video ? 'video/mp4' || 'video/gif' : 'image/jpeg',
				taken_at : item.taken_at_timestamp,
				type : item.is_video ? 'video' : 'image',
				url : item.is_video ? item.video_resources[0].src : item.display_url,
				dimensions : item.dimensions
			}))
			
			return result;
		} catch (error: any | AxiosError) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 404) {
					throw new Error('Post Not Found');
				} else if (error.response?.status == 403) {
					throw new Error('Forbidden, try set cookie first');
				} else if (error.response?.status == 401) {
					throw new Error('Unauthorized, try set cookie first');
				} else {
					throw error.toJSON()
				}
			} else {
				throw error;
			}
		}		
	}

	/**
	 * fetches highlight metadata (REQUIRES SESSION ID)
	 * @param {string} username username target to fetch the highlights, also work with private profile if you use session id \w your account that follows target account
	 * @returns
	 */
	public fetchHighlights = async(username: username): Promise<IHighlightsMetadata> => {
		try {
			if (!this.cookie.check()) throw new Error('set cookie first to use this function');
			const ids = await this._getReelsIds(username);
			const reels = await Promise.all(ids.map(x => this._getReels(x.highlight_id)))

			let data: IReelsMetadata[] = [];
			for (let i = 0; i < reels.length; i++) {
				data.push({
					title: ids[i].title,
					cover: ids[i].cover,
					media_count: reels[i].length,
					highlights_id: ids[i].highlight_id,
					highlights: reels[i]
				})
			}
			let json: IHighlightsMetadata = {
				username,
				highlights_count: ids.length,
				data: data
			}
			
			return json;
		} catch (error: any) {
			throw error
		}
	}
}