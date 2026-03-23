# Insta Fetcher

[![HitCount](http://hits.dwyl.com/Gimenz/insta-fetcher.svg)](http://hits.dwyl.com/Gimenz/insta-fetcher) [![GitHub license](https://img.shields.io/github/license/Gimenz/insta-fetcher)](https://github.com/Gimenz/insta-fetcher/blob/master/LICENSE) [![Npm package monthly downloads](https://badgen.net/npm/dm/insta-fetcher)](https://npmjs.com/package/insta-fetcher) ![GitHub repo size](https://img.shields.io/github/repo-size/Gimenz/insta-fetcher?style=flat) [![npm version](https://badge.fury.io/js/insta-fetcher.svg)](https://badge.fury.io/js/insta-fetcher)

Simple Instagram metadata scraping library for Node.js, written in TypeScript.

📖 **[Full Documentation](https://gimenz.github.io/insta-fetcher/)**  
☕ **[Buy Me a Coffee](https://saweria.co/masgimenz)**

## Installation
 
```bash
npm install insta-fetcher
```

---
 
## Setup
 
Instagram requires a valid session cookie for most requests. Get yours with `getCookie`:
 
```typescript
import { igApi, getCookie } from 'insta-fetcher';
 
// Get session cookie (only need to do this once)
const cookie = await getCookie('your_username', 'your_password');
console.log(cookie);
 
// Initialize with cookie
const ig = new igApi(cookie);
```
 
> **Note:** Save your cookie somewhere (e.g. `.env`) so you don't need to login every time.
 
### With Proxy
 
```typescript
const ig = new igApi(cookie, {
    proxy: {
        host: 'proxy-url',
        port: 'proxy-port',
        auth: {
            username: 'proxy-user',
            password: 'proxy-password'
        }
    }
});
```
 
---

## Example
 
### Fetch Post
 
```typescript
const post = await ig.fetchPost('https://www.instagram.com/p/xxxxx/');
console.log(post);
 
/*
{
  username: 'fiiyya21',
  name: 'Fiya',
  postType: 'image',
  media_id: '2841182589568357263_3026954032',
  shortcode: 'Cdt6IP7Pd2D',
  taken_at_timestamp: 1652915380,
  likes: 3,
  caption: 'some caption here',
  media_count: 2,
  comment_count: 15,
  video_duration: null,
  music: null,
  links: [
    {
      id: '...',
      url: 'https://...',
      type: 'image',
      dimensions: { height: 720, width: 720 }
    }
  ]
}
*/
```

### Fetch User Info
 
```typescript
// Simple user info
const user = await ig.fetchUserV2('username');
console.log(user);
 
// Detailed user info (includes email, phone if public)
const userDetail = await ig.fetchUser('username');
console.log(userDetail);
 
// Get user ID from username
const userId = await ig.getIdByUsername('username');
console.log(userId);
```

### Fetch Stories
 
```typescript
const stories = await ig.fetchStories('username');
console.log(stories);
 
/*
{
  username: 'username',
  stories_count: 3,
  stories: [
    {
      type: 'image' | 'video',
      url: 'https://...',
      taken_at: 1652915380,
      expiring_at: 1652915380,
      ...
    }
  ]
}
*/
```

### Fetch Highlights
 
```typescript
const highlights = await ig.fetchHighlights('username');
console.log(highlights);
 
/*
{
  username: 'username',
  highlights_count: 5,
  data: [
    {
      title: 'Highlight Title',
      cover: 'https://...',
      media_count: 10,
      highlights_id: '...',
      highlights: [ ... ]
    }
  ]
}
*/
```

### Fetch User Posts (Paginated)
 
```typescript
// First page
const posts = await ig.fetchUserPostsV2('username');
 
// Next page using next_max_id
const nextPosts = await ig.fetchUserPostsV2('username', 'next_max_id');
```
 
### Fetch User Reels
 
```typescript
const reels = await ig.fetchUserReel('username');
 
// With pagination
const nextReels = await ig.fetchUserReel('username', 'end_cursor');
```
 
### Fetch Account Info
 
```typescript
// Fetches your own account info based on cookie
const account = await ig.accountInfo();
console.log(account);
```
 
### Search Followers / Following
 
```typescript
const userId = await ig.getIdByUsername('username');
 
const followers = await ig.searchFollower(userId, 'search_term');
const following = await ig.searchFollowing(userId, 'search_term');
```

### Post a Photo
 
```typescript
// Post to feed
await ig.addPost('./photo.jpg', 'feed', {
    caption: 'Hello from insta-fetcher!'
});
 
// Post to story
await ig.addPost('./photo.jpg', 'story', {});
```
 
### Change Profile Picture
 
```typescript
await ig.changeProfilePicture('./new_photo.jpg');
```
 
---

## Contributing
 
All contributions are welcome — code, bug reports, documentation, or new features.
 
1. Fork this repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request
 
---
 
## Related Projects
 
- [nganu](https://github.com/Gimenz/nganu) — WhatsApp Bot using this library
 
---

## References
- https://github.com/dilame/instagram-private-api
- https://github.com/ldtsystem2020/Instagram_API
- https://github.com/jlobos/instagram-web-api
 
## License
 
[MIT](./LICENSE)