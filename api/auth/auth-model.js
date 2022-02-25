const db = require('../../data/dbConfig');

const findUser = async (username) => {
	let result = await db('users').where('username', username);
	return result;
};

module.exports = {
	findUser,
};
