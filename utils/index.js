const UrlFormatter = (url) => {
    const Regex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com.*\/p\/)([\d\w\-_]+)(?:\/)?(\?.*)?$/gi);
    const shortcode = Regex.exec(url)[1];
    return shortcode;
}

module.exports = {
    UrlFormatter
}