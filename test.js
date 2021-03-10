const ig = require('./index')

ig.fetchPost('https://www.instagram.com/p/CMBZUsMALA_/').then(res => {
 console.log(res)
})

/*ig.fetchUser('ochaameviaa').then(res => {
  console.log(res)
})*/