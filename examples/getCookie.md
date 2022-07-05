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
