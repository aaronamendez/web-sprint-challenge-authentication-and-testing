const Users = require('./auth-model');

async function validateBody(req, res, next) {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json('username and password required');
	} else {
		req.user = req.body;
		next();
	}
}

async function userIsUnique(req, res, next) {
	Users.findUser(req.user.username)
		.then((user) => {
			if (user.length > 0) {
				res.status(400).json('username taken');
			} else {
				next();
			}
		})
		.catch((err) => {
			res.json(err);
		});
}

async function findUserByUsername(req, res, next) {
	Users.findUser(req.user.username).then((user) => {
		if (user) {
			// Continue ...
			req.dbUser = user;
			next();
		} else {
			// Needs to be invalid credentials.
			res.status(400).json('invalid credentials');
		}
	});
}

module.exports = {
	validateBody,
	userIsUnique,
	findUserByUsername,
};
