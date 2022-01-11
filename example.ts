// an example to get session id using getSessionId function

import { getSessionId } from './src/index'

getSessionId('username', 'password').then(res => {
    console.log(res);
})