/** instagram username */
export type username = string;
/** sessionid from cookie */
export type session_id = string;
/** instagram post url can be post, reel, tv */
export type url = string;
/** Media Type */
export type MediaType = 'video' | 'image';
/** Mime Type */
export enum MimeType {
	'image/jpeg',
	'image/png',
	'video/mp4',
	'video/gif',
}
