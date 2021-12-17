import { MediaType, MimeType } from '.';

/** Instagram Simplified Stories Metadata */
export interface IGStoriesMetadata {
	/** Instagram username */
	username: string;
	/** stories count */
	stories_count: number;
	stories: ItemStories[];
}

/** an Array of simplified StoriesMetadata */
export interface ItemStories {
	type: MediaType;
	mimetpye: MimeType;
	/** Downloadable media url */
	url: string;
	/** a timestamp of posted media */
	taken_at: number;
	/** a timestamp of expire stories */
	expiring_at: number;
	/** stories media id */
	id: number;
	/** media pixels weight */
	original_width: number;
	/** media pixels height */
	original_height: number;
	/** has audio */
	has_audio: boolean;
	/** video duration */
	video_duration: number;
	/** stories caption */
	caption: string;
}

export interface StoriesGraphQL {
	id: number;
	latest_reel_media: number;
	expiring_at: number;
	seen: number;
	can_reply: boolean;
	can_gif_quick_reply: boolean;
	can_reshare: boolean;
	reel_type: string;
	ad_expiry_timestamp_in_millis: null;
	is_cta_sticker_available: null;
	user: IGStoriesMetadataUser;
	items: Item[];
	prefetch_count: number;
	has_besties_media: boolean;
	media_count: number;
	media_ids: number[];
	has_fan_club_media: boolean;
	status: string;
}

export interface Item {
	taken_at: number;
	pk: number;
	id: string;
	device_timestamp: number;
	media_type: number;
	code: string;
	client_cache_key: string;
	filter_type: number;
	is_unified_video: boolean;
	user: ItemUser;
	caption_is_edited: boolean;
	has_translation: boolean;
	like_and_view_counts_disabled: boolean;
	commerciality_status: string;
	is_paid_partnership: boolean;
	is_visual_reply_commenter_notice_enabled: boolean;
	image_versions2: ImageVersions2;
	original_width: number;
	original_height: number;
	caption_position: number;
	is_reel_media: boolean;
	photo_of_you: boolean;
	can_see_insights_as_brand: boolean;
	video_versions: VideoVersion[];
	has_audio: boolean;
	video_duration: number;
	caption: null;
	can_viewer_save: boolean;
	organic_tracking_token: string;
	expiring_at: number;
	sharing_friction_info: SharingFrictionInfo;
	comment_inform_treatment: CommentInformTreatment;
	product_type: string;
	is_in_profile_grid: boolean;
	profile_grid_control_enabled: boolean;
	deleted_reason: number;
	integrity_review_decision: string;
	music_metadata: null;
	can_reshare: boolean;
	can_reply: boolean;
	story_static_models: any[];
	supports_reel_reactions: boolean;
	can_send_custom_emojis: boolean;
	show_one_tap_fb_share_tooltip: boolean;
}

export interface CommentInformTreatment {
	should_have_inform_treatment: boolean;
	text: string;
}

export interface ImageVersions2 {
	candidates: Candidate[];
}

export interface Candidate {
	width: number;
	height: number;
	url: string;
	scans_profile: string;
	estimated_scans_sizes: number[];
}

export interface SharingFrictionInfo {
	should_have_sharing_friction: boolean;
	bloks_app_url: null;
}

export interface ItemUser {
	pk: number;
	username: string;
	full_name: string;
	is_private: boolean;
	profile_pic_url: string;
	profile_pic_id: string;
	is_verified: boolean;
	follow_friction_type: number;
	has_anonymous_profile_picture: boolean;
	is_unpublished: boolean;
	is_favorite: boolean;
	has_highlight_reels: boolean;
	account_badges: any[];
}

export interface VideoVersion {
	type: number;
	width: number;
	height: number;
	url: string;
	id: string;
}

export interface IGStoriesMetadataUser {
	pk: number;
	username: string;
	full_name: string;
	is_private: boolean;
	profile_pic_url: string;
	profile_pic_id: string;
	friendship_status?: FriendshipStatus | false;
	is_verified: boolean;
	follow_friction_type: number;
}

export interface FriendshipStatus {
	following: boolean;
	followed_by: boolean;
	blocking: boolean;
	muting: boolean;
	is_private: boolean;
	incoming_request: boolean;
	outgoing_request: boolean;
	is_bestie: boolean;
	is_restricted: boolean;
	is_feed_favorite: boolean;
}
