const { igApi } = require('./dist');
const ig = new igApi('763572655%gustikulo%3A13');
ig.fetchUser('gimenz.id').then((res) => console.log(res));

// ig.fetchPost('https://www.instagram.com/tv/B3OFKpkg4wH/')
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((e) => console.log(e));

// ig.fetchStories('adiraas.p')
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((e) => console.log(e));
