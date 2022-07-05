### An example to get cookie

_this just example to get ig cookie_

- create new javascript file
- copy this code
- just change with your ig login credentials

```js
const { getCookie } = require("insta-fetcher");

(async () => {
  try {
    const cookie = await getCookie("your ig username", "your ig password");
    console.log(cookie);
  } catch (error) {
    console.log(error);
  }
})();
```

and then run node filename.js

new method is needed full of ig cookie, you must copy all string of the result. for more example, you can check at example.ts

### With Browser 

if you can't understand with the getCookie() method, you can get cookie manually by using browser.

just log in to instagram.com, open Dev Tools and go to the Network tab, and find at Request Header that the word match with cookie, just copy all.

For mobile, you can try Kiwi Browser, it like as Desktop Browser that have Dev Tools

Thanks. 
