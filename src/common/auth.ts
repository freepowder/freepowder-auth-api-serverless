import crypto from 'crypto';
import {connectToDatabase} from "../common/mongo-db";

	/**
	 * Authenticate users
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<any>}
	 */
	export const authenticate = (email: string, password: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			connectToDatabase().then(({ database } ) => {
				const collection = database.collection('users');
				collection.findOne({ email: email })
					.then((user) => {
						if (!user || !comparePassword(password, user['password'], user['salt'])) {
							return reject({
								message: 'Invalid username or password '// (' + (new Date()).toLocaleTimeString() + ')'
							});
						}
						return resolve(user);
					})
					.catch((err) => {
						return reject(err);
					});
			})
			.catch((err) => {
				return reject(err);
			});
		})
	}
	/**
	 * Hash user password
	 */
	 export const hashPassword = (password, salt) => {
		if (salt && password) {
			return crypto.pbkdf2Sync(password, salt, 10000, 64, 'SHA512').toString('base64');
		} else {
			return password;
		}
	};
	/**
	 * Check user password
	 */
	const comparePassword = (requestPassword, password, salt) => {
		return password === hashPassword(requestPassword, salt);
	};
