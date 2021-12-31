import { formattedShortcode } from '../types';

/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns {formattedShortcode}
 */
export const shortcodeFormatter = (url: string): formattedShortcode => {
    // const Regex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\w+)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gi);
    // console.log(Regex.exec(url));
    // const [, shortcode] = Regex.exec(url) || '';
    // return shortcode;

    const re = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\w+)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?.*?$/, 'g').exec(url) || '';
    return {
        type: re[1],
        shortcode: re[2]
    }
};