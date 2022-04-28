import { Readable } from 'stream';
import { formattedShortcode, IGPostType, postType, ProductType } from '../types/index';

/** Instagram post regex */
export const IGPostRegex = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gim

/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns {formattedShortcode}
 */
export const shortcodeFormatter = (url: string): formattedShortcode => {
    const re = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gim.exec(url) || '';
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
    return /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gim.test(url);
}

/**
 * get instagram post type
 * @param type product_type
 * @returns 
 */
export const getPostType = (type: string): postType => {
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

/** get random number in range */
export const randInt = (min: number, max: number, q = 0.001): number => {
    return Math.floor((Math.random() * (min - max)) / q) * q
}

// https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-node-js
export const bufferToStream = (buffer: Buffer) => {
    const readable = new Readable()
    readable._read = () => { } // _read is required but you can noop it
    readable.push(buffer)
    readable.push(null)
    return readable
}