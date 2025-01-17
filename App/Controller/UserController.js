var userController = {};
var responseHelper = require('./../Helpers/ResponseHelper');
var jwt = require('jsonwebtoken');

userController.signup = async (req, res) => {
	try {
		if (!req.body.name || !req.body.username || !req.body.password || !req.body.email) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validateSql = `SELECT id FROM users WHERE username = ?;`;
		let validateRes = await queryExecute(validateSql, [req.body.username]);
		if (validateRes.length) {
			return responseHelper.sendErrResponse(req, res, ["user already exists."]);
		}

		let insertSql = `INSERT INTO users SET name = ?, username = ?, password = MD5(?), email = ?`;
		await queryExecute(insertSql, [req.body.name, req.body.username, req.body.password, req.body.email]);
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}


userController.login = async (req, res) => {
	try {
		if (!req.body.username || !req.body.password) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validateSql = `SELECT * FROM users WHERE username = ? AND password = MD5(?);`;
		let validateRes = await queryExecute(validateSql, [req.body.username, req.body.password]);
		if (validateRes.length == 0) {
			return responseHelper.sendErrResponse(req, res, ["invalid username/passowrd."]);
		}
		validateRes = validateRes[0];
		let token = jwt.sign({
			user: req.body.username
		}, JWT_PRIVATE_KEY);
		let updateSql = `UPDATE users SET token = ? WHERE id = ?;`
		await queryExecute(updateSql, [token, validateRes['id']])
		validateRes['token'] = token;
		redisClient.set('session.' + token, JSON.stringify(validateRes));
		redisClient.expire('session.' + token, 60 * 60);
		return responseHelper.sendSucessResponse(req, res, ["successfull"], [validateRes]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}


userController.logout = async (req, res) => {
	try {
		let updateSql = `UPDATE users SET token = NULL WHERE id = ?;`;
		await queryExecute(updateSql, [req.user['id']]);
		let token = req.headers['token'];
		redisClient.del('session.' + token);
		return responseHelper.sendSucessResponse(req, res, ["successfull"], []);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}


module.exports = userController;