const fs = require('fs');
const DIR = 'src/config/Cookies.json';


class CookieHandler {
    /**
     * 
     * @returns session id
     */
    get() {
        const data = fs.existsSync(DIR) ? fs.readFileSync(DIR, 'utf-8') : '';
        return data;
    }
    /**
     * save session id to local dir
     * @param {String} session_id 
     * @returns 
     */
    save(session_id) {
        if (!fs.existsSync(DIR)) {
            fs.writeFileSync(DIR, JSON.stringify(session_id));
            return true;
        } else {
            throw new Error('Cookie has been saved before, use update() to update with new cookie');
        }
    }

    /**
     * update with new cookie if last cookie got error, e.g account locked mybe
     * @param {String} session_id 
     * @returns 
     */
    update(session_id) {
        if (fs.existsSync(DIR)) {
            fs.writeFileSync(DIR, JSON.stringify(session_id));
            return true;
        } else {
            throw new Error('Cookie hasn\'t been saved before, save cookie first using save()');
        }
    }

    /**
     * to check if cookies.json stored in local dir
     * @returns {boolean} true if file has stored in local dir
     */
    check() {
        if (fs.existsSync(DIR)) {
            return false;
        } else {
            return true;
        }
    }
}


module.exports = CookieHandler;