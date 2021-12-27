const { igApi } = require('./dist');
const ig = new igApi('1983130028%3AOuil1EbgMoXVqc%3A13');
//ig.fetchUser('gimenz.id').then((res) => console.log(res));

ig.fetchPost('https://www.instagram.com/reel/CXr9Y-WB5IB/?utm_source=ig_web_copy_link')
    .then((res) => {
        console.log(res);
    })
    .catch((e) => console.log(e));

// ig.fetchStories('adiraas.p')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((e) => console.log(e));


// ig.fetchHighlights('gimenz.id').then(res => {
//     console.log(res.data[0]);
// })

