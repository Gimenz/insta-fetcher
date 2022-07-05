// an example to get cookie using getCookie function

import { getCookie, igApi, isIgPostUrl, shortcodeFormatter } from '../src'
const ig = new igApi('your Cookie');

// you can easily get ig cookie. from anywhere, termux, terminal or etc
getCookie('username', 'password').then(res => {
    console.log(res)
});

//some examples of most uses funtion

(async () => {

    // fetch a Post
    const post = await ig.fetchPost('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(post);

    // fetch user posts, with pagination support
    const userPosts = await ig.fetchUserPostsV2('ketoprak_jowo');
    console.log(userPosts);

    // use end_cursor to get nextPage posts, end_cursor you can get it by fetch user posts first, if has_next_page value is true
    const userPostsNextPage = await ig.fetchUserPostsV2('ketoprak_jowo', userPosts.page_info.end_cursor);
    console.log(userPostsNextPage);

    // fetch Stories
    const stories = await ig.fetchStories('novia.mawa');
    console.log(stories);

    // fetch highlights
    const highlight = await ig.fetchHighlights('novia.mawa');
    console.log(highlight);

    // fetch user info
    const user = await ig.fetchUser('novia.mawa');
    console.log(user);

    // also you can use fetchUserV2 version, basically this is same as /?__a=1
    const userV2 = await ig.fetchUserV2('novia.mawa');
    console.log(userV2);

    // ig url can be extracted , you can use shortcodeFormatter
    const formatted = shortcodeFormatter('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(formatted);

    // or if you want to check wether the ig post is valid url?
    const check = isIgPostUrl('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(check);
})();
