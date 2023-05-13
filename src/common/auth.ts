import {Strategy} from 'passport-local'
import User from './user.model';
import crypto from 'crypto';
import passport from 'passport';

// // serialize
passport.serializeUser((user, done) => {
	return done(null, user['_id']);
});
// Deserialize sessions
passport.deserializeUser((id, done) => {
	User.findById({
		_id: id
	}, '-salt -password', (err, user) => {
		return done(err, user);
	});
});

	/**
	 * Authenticate users
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<any>}
	 */
	export const authenticate = (email: string, password: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			User.findOne({ email: email })
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
	}
	export const passportAuthenticate = () =>{
		return new Strategy({
			usernameField: 'email',
			passwordField: 'password'
		}, (email, password, done) => {
			User.findOne({ email: email })
				.then((user) => {
					if (!user || !user.schema.methods.comparePassword(password)) {
						return done(null, false, {
							message: 'Invalid username or password '// (' + (new Date()).toLocaleTimeString() + ')'
						});
					}
					return done(null, user);
				})
				.catch((err) => {
					return done(err);
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
