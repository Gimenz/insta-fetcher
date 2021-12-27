# Insta Fetcher

[![HitCount](http://hits.dwyl.com/Gimenz/insta-fetcher.svg)](http://hits.dwyl.com/Gimenz/insta-fetcher) [![GitHub license](https://img.shields.io/github/license/Gimenz/insta-fetcher)](https://github.com/Gimenz/insta-fetcher/blob/master/LICENSE) [![Npm package monthly downloads](https://badgen.net/npm/dm/insta-fetcher)](https://npmjs.com/package/insta-fetcher) ![GitHub repo size](https://img.shields.io/github/repo-size/Gimenz/insta-fetcher?style=flat)

Fetch instagram metadata with full details and simplified json metadata

☕ Buy Me a Coffee : [Saweria](https://saweria.co/masgimenz 'Saweria')

# Features

- [x] fetchUser

- [x] fetchPost

- [x] fetchStories

- [ ] explore

- [x] fetchHighlights

- [ ] fetchTV

- [ ] fetchReels

# Usage

Installation:

```

npm i insta-fetcher

```

recommended to set the session id before make call to all function

```js
const { igApi } = require('insta-fetcher');
const ig = new igApi('your session id');

//or use setCookie function
ig.setCookie('your session id');
```

Example

```js
const { igApi } = require('insta-fetcher');
const ig = new igApi();

// Public post

ig.fetchPost('https://www.instagram.com/p/CMBZUsMALA_/').then((res) => {
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
```

# Contributing

All kinds of contributions are welcome - code, tests, documentation, bug reports, new features, etc...

- Send feedbacks.

- Submit bug reports.

- Write/Edit the documents.

- Fix bugs or add new features.
