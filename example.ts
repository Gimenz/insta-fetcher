// an example to get session id using getSessionId function

import { getSessionId, igApi, isIgPostUrl, shortcodeFormatter } from './src'

const ig = new igApi('yout session id');


(async () => {
    // you can easily get session id, from anywhere, termux, terminal or etc
    const session_id = getSessionId('username', 'password');
    console.log(session_id);
    
    const post = await ig.fetchPost('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(post);
    
    const stories = await ig.fetchStories('novia.mawa');
    console.log(stories);

    const highlight = await ig.fetchHighlights('novia.mawa');
    console.log(highlight);
    
    const user = await ig.fetchUser('novia.mawa');
    console.log(user);
    
    // ig url can be extracted , you can use shortcodeFormatter
    const formatted = shortcodeFormatter('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(formatted);
    
    // or if you want to check wether the ig post is valid url?
    const check = isIgPostUrl('https://www.instagram.com/p/CW0hkIOFip9/?utm_source=ig_web_copy_link');
    console.log(check);
})();
