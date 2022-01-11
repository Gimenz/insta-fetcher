import * as fs from 'fs';
import * as path from 'path';
import { session_id } from '../types';

let DIR: string = path.join(__dirname, '../config/Cookies.txt');

export class CookieHandler {
	session_id: session_id
	constructor(session_id: string = '') {
		this.session_id = session_id;
	}

	get session(): session_id {
		return this.session_id
	}
	/**
	 * save session id to local directory
	 * @param session_id session id
	 * @returns
	 */
	public save = (session_id: string = this.session_id): void =>{
		if (!fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, session_id, 'utf-8');
		} else {
			this.update(session_id)
		}
	}

	/**
	 * update with new cookie if last cookie got error, e.g account locked mybe
	 * @param {String} session_id
	 * @returns
	 */
	public update = (session_id: string = this.session_id): void => {
		if (fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, session_id, 'utf-8');
		} else {
			throw new Error(
				"Cookie hasn't been saved before, save cookie first using save()"
			);
		}
	}

	/**
	 * to check if cookies.txt stored in local dir
	 * @returns {boolean} true if file has stored in local dir
	 */
	public check = (): boolean => {
		return fs.existsSync(DIR);
	}

	/**
	 * get a session id
	 * @returns session id
	 */
	public get = (): string => {
		let data: string = this.check()
			? fs.readFileSync(DIR, 'utf-8').toString()
			: this.session_id;
		return data;
	}
}
