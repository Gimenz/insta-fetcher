const ig = require('./');

// ig.fetchPost('https://www.instagram.com/p/CXOZbFrPfO-/?utm_source=ig_web_copy_link').then(res => {
//   console.log(res);
// })

// recommended to set cookie first for call most all instagram endpoint
//setCookie("45383374294%3AXmvVAsMceyYZ2S7%3A16")

ig.fetchUser('adiraas.p').then(res => {
  console.log(res);
})

// ig.explore('natgeo').then(res => {
//   console.log(res);
// })