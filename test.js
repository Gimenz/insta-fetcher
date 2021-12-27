const { igApi } = require('./dist');
const ig = new igApi('your session id');
//ig.fetchUser('gimenz.id').then((res) => console.log(res));

// ig.fetchPost('https://www.instagram.com/p/CX47pkjpzf_/')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((e) => console.log(e));

// ig.fetchStories('adiraas.p')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((e) => console.log(e));


ig.fetchHighlights('gimenz.id').then(res => {
    console.log(res.data[0]);
})