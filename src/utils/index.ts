import { formattedShortcode } from '../types';

/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns {formattedShortcode}
 */
export const shortcodeFormatter = (url: string): formattedShortcode => {
    const re = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/, 'g').exec(url) || '';
    return {
        type: re[1],
        shortcode: re[2]
    }
};

/**
 * is Instagram Url?
 * @param url instagram post url
 * @returns 
 */
export const isIgPostUrl = (url: string): boolean => {
    return new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/, 'g').test(url);
}