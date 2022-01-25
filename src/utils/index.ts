import { formattedShortcode, IGPostType, ProductType } from '../types';

/** Instagram post regex */
export const IGPostRegex = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/, 'g')
/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns {formattedShortcode}
 */
export const shortcodeFormatter = (url: string): formattedShortcode => {
    const re = IGPostRegex.exec(url) || '';
    return {
        type: re[1],
        shortcode: re[2],
        url: 'https://www.instagram.com/' + re[1] + '/' + re[2]
    }
};

/**
 * is Instagram Url?
 * @param url instagram post url
 * @returns 
 */
export const isIgPostUrl = (url: string): boolean => {
    return IGPostRegex.test(url);
}

export const getPostType = (type: string): string => {
    return type == ProductType.CAROUSEL 
        ? IGPostType.carousel_container
        : type == ProductType.REEL
        ? IGPostType.clips
        : type == ProductType.SINGLE
        ? IGPostType.feed
        : type == ProductType.TV
        ? IGPostType.igtv
        : IGPostType.feed
}