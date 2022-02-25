const router = require('express').Router();
const bcrypt = require('bcryptjs');
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
	// res.json(req.user);
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
