/**
 * format instagram long url to get shortcode
 * @param url a instagram post url like
 * @returns shortcode
 */
export const shortcodeFormatter = (url: string) => {
	const Regex = new RegExp(
		/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com.*\/p?|reel?|tv\/)([\d\w\-_]+)(?:\/)?(\?.*)?$/gi
	);
	const [, shortcode] = Regex.exec(url) || '';
	return shortcode;
};
