# Insta Fetcher

[![HitCount](http://hits.dwyl.com/Gimenz/insta-fetcher.svg)](http://hits.dwyl.com/Gimenz/insta-fetcher) [![GitHub license](https://img.shields.io/github/license/Gimenz/insta-fetcher)](https://github.com/Gimenz/insta-fetcher/blob/master/LICENSE) [![Npm package monthly downloads](https://badgen.net/npm/dm/insta-fetcher)](https://npmjs.com/package/insta-fetcher) ![GitHub repo size](https://img.shields.io/github/repo-size/Gimenz/insta-fetcher?style=flat)

Fetch instagram api with full details and simplified json metadata

☕ Buy Me a Coffee : [Saweria](https://saweria.co/masgimenz 'Saweria')

# Features

- [x] fetchUser

- [x] fetchPost

- [x] fetchStories

- [x] fetchHighlights


# Usage

Installation:

```

npm i insta-fetcher

```

recommended to set the session id before make call to all function

```js
let { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi('your session id');

//or use setCookie function
ig.setCookie('your session id');


// you can get sesion id by using getSessionId function, it requires username & password
(async () => {
    const session_id = await getSessionId('username', 'password');
    console.log(session_id);
})();
```

Example

```js
let { igApi } = require('insta-fetcher');
let ig = new igApi();

// Public post
ig.fetchPost('https://www.instagram.com/reel/CXhW_4sp32Z/').then((res) => {
	console.log(res);
});

// User data
ig.fetchUser('mg.creativestudio').then((res) => {
	console.log(res);
});

// Fetch stories
ig.fetchStories('adiraas.p').then((res) => {
	console.log(res);
});

// Fetch highlights
ig.fetchHighlights('adiraas.p').then((res) => {
	console.log(res);
});
```

## My Project with this Library

- https://github.com/Gimenz/nganu - simple multi-device base WhatsApp Bot 

# Contributing

All kinds of contributions are welcome - code, tests, documentation, bug reports, new features, etc...

- Send feedbacks.
- Submit bug reports.
- Write/Edit the documents.
- Fix bugs or add new features.
