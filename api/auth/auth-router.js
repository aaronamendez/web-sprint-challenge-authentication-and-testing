const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./auth-model');

const {
	validateBody,
	userIsUnique,
	findUserByUsername,
} = require('./auth-middleware');

router.post('/register', validateBody, userIsUnique, async (req, res) => {
	const saltRounds = 5;
	const hash = bcrypt.hashSync(req.user.password, saltRounds);
	const body = {
		username: req.user.username,
		password: hash,
	};
	Users.createUser(body)
		.then((user) => {
			res.json(user);
		})
		.catch((err) => res.status(500).json(err));
});

router.post('/login', validateBody, findUserByUsername, (req, res) => {
	if (bcrypt.compareSync(req.user.password, req.dbUser.password)) {
		const payload = {
			id: req.dbUser.id,
			username: req.dbUser.username,
		};
		const token = jwt.sign(payload, 'MY SECRET', { expiresIn: '1d' });

		const obj = {
			message: `Welcome, ${req.dbUser.username}`,
			token,
		};
		res.status(200).json(obj);
	} else {
		res.json('invalid credentials');
	}
});

module.exports = router;
