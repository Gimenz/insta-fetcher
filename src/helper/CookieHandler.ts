import * as fs from 'fs';
import * as path from 'path';
import { IgCookie } from '../types';

let DIR: string = path.join(__dirname, '../config/Cookies.txt');

export class CookieHandler {
	IgCookie: IgCookie
	constructor(IgCookie: string = '') {
		this.IgCookie = IgCookie;
	}

	/**
	 * save session id to local directory
	 * @param IgCookie session id
	 * @returns
	 */
	public save = (IgCookie: string = this.IgCookie): void => {
		if (!fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, IgCookie, 'utf-8');
		} else {
			this.update(IgCookie)
		}
	}

	/**
	 * update with new cookie if last cookie got error, e.g account locked mybe
	 * @param {String} IgCookie
	 * @returns
	 */
	public update = (IgCookie: string = this.IgCookie): void => {
		if (fs.existsSync(DIR)) {
			fs.writeFileSync(DIR, IgCookie, 'utf-8');
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
			? fs.readFileSync(DIR, 'utf-8').toString() || this.IgCookie
			: this.IgCookie;
		return data;
	}
}
