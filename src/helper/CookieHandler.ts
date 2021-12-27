import * as fs from 'fs';
import * as path from 'path';

const DIR: string = path.join(__dirname, '../config/Cookies.json');

export class CookieHandler {
	constructor(session_id: string = '') {
		session_id = session_id;
	}
	/**
	 * save session id to local directory
	 * @param session_id session id
	 * @returns
	 */
	save(session_id: string): void {
		if (!fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, JSON.stringify(session_id));
		} else {
			this.update(session_id)
		}
	}

	/**
	 * update with new cookie if last cookie got error, e.g account locked mybe
	 * @param {String} session_id
	 * @returns
	 */
	update(session_id: string): void {
		if (fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, JSON.stringify(session_id));
		} else {
			throw new Error(
				"Cookie hasn't been saved before, save cookie first using save()"
			);
		}
	}

	/**
	 * to check if cookies.json stored in local dir
	 * @returns {boolean} true if file has stored in local dir
	 */
	check(): boolean {
		return fs.existsSync(DIR);
		// if (fs.existsSync(DIR)) {
		// 	return false;
		// } else {
		// 	return true;
		// }
	}

	/**
	 * get a session id
	 * @returns session id
	 */
	get(): string {
		const data: string = fs.existsSync(DIR)
			? fs.readFileSync(DIR, 'utf-8')
			: '';
		return data;
	}
}
