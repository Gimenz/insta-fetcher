import { Readable } from 'stream';
import { formattedShortcode, IGPostType, postType, ProductType } from '../types/index';
import bigInt from 'big-integer';

// https://stackoverflow.com/questions/16758316/where-do-i-find-the-instagram-media-id-of-a-image
// https://gist.github.com/sclark39/9daf13eea9c0b381667b61e3d2e7bc11
const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = lower.toUpperCase();
const numbers = '0123456789'
const ig_alphabet = upper + lower + numbers + '-_'
const bigint_alphabet = numbers + lower

/**
 * convert instagram shortcode into media_id
 * @param shortcode 
 * @returns 
 */
export const shortcodeToMediaID = (shortcode: string) => {
    const o = shortcode.replace(/\S/g, m => {
        var c = ig_alphabet.indexOf(m)
        var b = bigint_alphabet.charAt(c)
        return (b != "") ? b : `<${c}>`
    })
    return bigInt(o, 64).toString(10)
}

export const shortcodeFromMediaID = (media_id: string) => {
    var o = bigInt(media_id).toString(64)
    return o.replace(/<(\d+)>|(\w)/g, (m, m1, m2) => {
        return ig_alphabet.charAt((m1)
            ? parseInt(m1)
            : bigint_alphabet.indexOf(m2))
    });
}

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
        url: 'https://www.instagram.com/' + re[1] + '/' + re[2],
        media_id: shortcodeToMediaID(re[2])
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