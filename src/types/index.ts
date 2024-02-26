export * from './HighlightMediaMetadata'
export * from './HighlightMetadata'
export * from './MediaConfigureOptions'
export * from './PostFeedResult'
export * from './PostMetadata'
export * from './PostModels'
export * from './PostStoryResult'
export * from './StoriesMetadata'
export * from './UserGraphQlV2'
export * from './UserMetadata'
export * from './PaginatedPosts'
export * from './LoginData'
export * from './searchFollow'

/** instagram username */
export type username = string;
/** instagram user pk */
export type userId = string;
/** term to search for a user, it can be their name or username */
export type seachTerm = string;
/** instagram password */
export type password = string;
/** Instagram Cookie */
export type IgCookie = string;
/** instagram post url can be post, reel, tv */
export type url = string;
/** Media Type */
export enum MediaType {
	IMAGE = 1,
	VIDEO = 2,
	CAROUSEL = 8
}
export enum ProductType {
	CAROUSEL = 'carousel_container',
	REEL = 'clips',
	TV = 'igtv',
	SINGLE = 'feed'
}

export enum Typename {
	GraphImage = "GraphImage",
	GraphSidecar = "GraphSidecar",
	GraphVideo = "GraphVideo",
}

export enum IGPostType {
	'carousel_container' = 'p',
	'clips' = 'reel',
	'igtv' = 'tv',
	'feed' = 'p'
}
/** Mime Type */
export type MimeType = 'image/jpeg' | 'image/png' | 'video/mp4' | 'video/gif';
/** csrf token */
export type csrfToken = string;
/** instagram post type */
export type postType = 'p' | 'reel' | 'tv'
/** a formatted shortcode */
export interface formattedShortcode {
	type: postType | string,
	shortcode: string;
	url: string;
	media_id: number | string
}

export interface IChangedProfilePicture {
	changed_profile: boolean
	id: number,
	has_profile_pic: boolean,
	profile_pic_url: string
	profile_pic_url_hd: string
	status: string
}