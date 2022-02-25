const db = require('../../data/dbConfig');

const findUser = async (username) => {
	let result = await db('users').where('username', username);
	return result[0];
};

const findById = async (id) => {
	let [result] = await db('users').where('id', id);
	return result;
};

const createUser = async (body) => {
	let result = await db('users').insert(body);
	let user = findById(result);
	return user;
};

// const findByUsername = async (username) => {

// }

module.exports = {
	findUser,
	createUser,
};
