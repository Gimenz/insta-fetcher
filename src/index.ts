/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Minggu, 20 Februari 2022
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getPostType, randInt, shortcodeFormatter } from './utils/index';
import { CookieHandler } from './helper/CookieHandler';
import { username, url, session_id, ProductType, MediaType } from './types';
import { IGUserMetadata, UserGraphQL } from './types/UserMetadata';
import {
	IGStoriesMetadata,
	ItemStories,
	StoriesGraphQL,
} from './types/StoriesMetadata';
import { highlight_ids_query, highlight_media_query } from './helper/query';
import { HightlighGraphQL, ReelsIds } from './types/HighlightMetadata';
import { HMedia, IHighlightsMetadata, IReelsMetadata, ReelsMediaData } from './types/HighlightMediaMetadata';
import { IPostModels, IRawBody, MediaUrls } from './types/PostModels';
import { config } from './config';
import fs from 'fs'
import { getCsrfToken } from './helper/Session';
import { PostFeedResult } from './types/PostFeedResult';
import { PostStoryResult } from './types/PostStoryResult';
import { MediaConfigureOptions } from './types/MediaConfigureOptions';
import { GraphqlUser, UserGraphQLV2 } from './types/UserGraphQlV2';

export * from './utils'
export * as InstagramMetadata from './types'
export * from './helper/Session';
export class igApi {
	/**
	 * Recommended to set session id for most all IG Request
	 * @param session_id session id you can get it by using getSessionId function, see README.md or example file
	 * @param storeCookie
	 */
	constructor(public session_id: session_id = '', public storeCookie: boolean = true) {
		this.session_id = session_id;
		if (this.storeCookie) {
			this.setCookie(this.session_id);
		}
	}
	private cookie = new CookieHandler(this.session_id)

	private buildHeaders = (agent: string = config.android, options?: any) => {
		return {
			'user-agent': agent,
			'cookie': `sessionid=${this.storeCookie && this.cookie.get() || this.session_id};`,
			'authority': 'www.instagram.com',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://www.instagram.com',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'x-ig-app-id': 936619743392459,
            'x-ig-www-claim': 'hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf',
            'x-instagram-ajax': 1,
            'x-requested-with': 'XMLHttpRequest',
			...options
		};
	}

	/** Make request to IG API */
	private FetchIGAPI = (baseURL: string, url: string = '', agent: string = config.android, options: AxiosRequestConfig = {}) => {
		return axios({
			baseURL,
			url,
			headers: options.headers ? options.headers : this.buildHeaders(agent),
			method: options.method || 'GET',
			...options
		});
	}
	
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
			const { data } = await this.FetchIGAPI(
				config.instagram_base_url,
				`/${username}/?__a=1`, 
				config.iPhone,
			);
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
		if (!this.session_id) throw new Error('set cookie first to use this function');
		const post = shortcodeFormatter(url);
		
		//const req = (await IGFetchDesktop.get(`/${post.type}/${post.shortcode}/?__a=1`))
		const req = await this.FetchIGAPI(
			config.instagram_base_url, 
			`/${post.type}/${post.shortcode}/?__a=1`,
			config.desktop
		)

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
	 * fetch client account profile  
	 */
	 public accountInfo = async (userID: number | string = this.session_id.split('%')[0]): Promise<UserGraphQL> => {
		try {
			const { data } = await this.FetchIGAPI(
				config.instagram_user_url,
				`/${userID}/info/`
			);
			const graphql: UserGraphQL = data;
			
			if (!this.session_id) throw new Error('set cookie first to use this function');
			return graphql
		} catch (error: any | AxiosError) {
			console.log(error);
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
	 * fetch profile by username. including email, phone number 
	 * @param {String} username
	 * @returns {Promise<IGUserMetadata>}
	 */
	public fetchUser = async (username: username): Promise<IGUserMetadata> => {
		try {
			const userID = await this.getIdByUsername(username);
			// const { data } = await IGUser.get(`/${userID}/info/`);
			const { data } = await this.FetchIGAPI(
				config.instagram_user_url,
				`/${userID}/info/`
			);
			const graphql: UserGraphQL = data;
			const isSet: boolean = typeof graphql.user.full_name !== 'undefined';
			if (!this.session_id) throw new Error('set cookie first to use this function');
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

	public fetchUserV2 = async (username: username) => {
		try {
			const { data } = await this.FetchIGAPI(config.instagram_base_url, `/${username}/?__a=1`);
			const {graphql}: UserGraphQLV2 = data;
			return graphql.user as GraphqlUser;
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
	 * simple method to check is user follow me
	 * @param username 
	 * @returns true if user is follow me
	 */
	public isFollowMe = async (username: username): Promise<boolean> => {
		const user = await this.fetchUserV2(username);
		return user.follows_viewer;
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
	 * fetches stories metadata 
	 * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
	 * @returns
	 */
	public fetchStories = async(username: username): Promise<IGStoriesMetadata> => {
		try {
			if (!this.session_id) throw new Error('set cookie first to use this function');
			const userID = await this.getIdByUsername(username);
			//const { data } = await IGStories.get(`/${userID}/reel_media/`);
			const { data } = await this.FetchIGAPI(
				config.instagram_stories_url,
				`/${userID}/reel_media/`,
				config.iPhone
			);
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
			// const { data } = await IGHighlight.get('', {
			// 	params: highlight_ids_query(userID)
			// })
			const { data } = await this.FetchIGAPI(
				config.instagram_graphql,
				'',
				config.iPhone,
				{ params: highlight_ids_query(userID)}
			)
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
			// const { data } = await IGHighlight.get('', { params: highlight_media_query(ids) })
			const { data } = await this.FetchIGAPI(
				config.instagram_graphql,
				'',
				config.iPhone,
				{ params: highlight_media_query(ids) }
			)
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
			if (!this.session_id) throw new Error('set cookie first to use this function');
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

	private uploadPhoto = async(photo: string | Buffer) => {
		try {
			const uploadId = Date.now();

			const file = Buffer.isBuffer(photo)
				? photo
				: fs.existsSync(photo)
					? fs.readFileSync(photo)
					: photo;
	
			const uploadParams = {
				media_type: 1,
				upload_id: uploadId.toString(),
				upload_media_height: 1080,
				upload_media_width: 1080,
				xsharing_user_ids: JSON.stringify([]),
				image_compression: JSON.stringify({
					lib_name: 'moz',
					lib_version: '3.1.m',
					quality: '80'
				})
			}
		  
			const nameEntity = `${uploadId}_0_${randInt(1000000000, 9999999999)}`
	
			const ndas = {
				'x-entity-type': 'image/jpeg',
				offset: 0,
				'x-entity-name': nameEntity,
				'x-instagram-rupload-params': JSON.stringify(uploadParams),
				'x-entity-length': Buffer.byteLength(file),
				'Content-Length': Buffer.byteLength(file),
				'Content-Type': 'application/octet-stream',
				'x-ig-app-id': `1217981644879628`,
				'Accept-Encoding': 'gzip',
				'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
				'X-IG-Connection-Speed': `${randInt(3700, 1000)}kbps`,
				'X-IG-Bandwidth-Speed-KBPS': '-1.000',
				'X-IG-Bandwidth-TotalBytes-B': '0',
				'X-IG-Bandwidth-TotalTime-MS': '0',
			}
	
			const headersPhoto = this.buildHeaders(config.android, ndas)
	
			const result = await this.FetchIGAPI(
				`${config.instagram_base_url}`,
				`/rupload_igphoto/fb_uploader_${nameEntity}`, 
				config.android,
				{ headers: headersPhoto, data: file, method: 'POST' }
			);
			return result.data
		} catch (error) {
			throw error
		}
	}

	/**
	 * Post a photo to instagram
	 * @param photo 
	 * @param type post type
	 * @param options 
	 * @returns 
	 */
	public addPost = async(photo: string | Buffer, type: 'feed' | 'story' = 'feed', options: MediaConfigureOptions): Promise<PostFeedResult|PostStoryResult> =>{
		if (!this.session_id) throw new Error('set cookie first to use this function');
        try{
            const dateObj = new Date()
            const now = dateObj
              .toISOString()
              .replace(/T/, ' ')
              .replace(/\..+/, ' ')
            const offset = dateObj.getTimezoneOffset()
        
            const responseUpload = await this.uploadPhoto(photo);

            const payloadForm = {
                upload_id: responseUpload.upload_id,
                timezone_offset: offset,
                date_time_original: now,
                date_time_digitalized: now,
                source_type: '4',
				// edits: {
                //     crop_original_size: [1080, 1080],
                //     crop_center: [0.0, -0.0],
                //     crop_zoom: 1.0
                // },
				...options
            }

			let headers = {
				'authority': 'www.instagram.com',
				'x-ig-www-claim': 'hmac.AR2-43UfYbG2ZZLxh-BQ8N0rqGa-hESkcmxat2RqMAXejXE3',
				'x-instagram-ajax': 'adb961e446b7-hot',
				'content-type': 'application/x-www-form-urlencoded',
				'accept': '*/*',
				'user-agent': config.desktop,
				'x-requested-with': 'XMLHttpRequest',
				'x-csrftoken': await getCsrfToken(),
				'x-ig-app-id': '1217981644879628',
				'origin': 'https://www.instagram.com',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-mode': 'cors',
				'sec-fetch-dest': 'empty',
				'referer': 'https://www.instagram.com/create/details/',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
				'cookie': `sessionid=${this.storeCookie && this.cookie.get() || this.session_id};`,
            }
			//let payload = `upload_id=${responseUpload.upload_id}&caption=${caption}&usertags=&custom_accessibility_caption=&retry_timeout=`

			const result = await this.FetchIGAPI(
				`${config.instagram_base_url}`,
				`/create/${type === 'feed' ? 'configure/' : 'configure_to_story/'}`, 
				config.android,
				{ data: new URLSearchParams(Object.entries(payloadForm)).toString(), method: 'POST', headers: headers}
			);
			
            return result.data
        } catch (error: any){
            throw error
        }
    }
}