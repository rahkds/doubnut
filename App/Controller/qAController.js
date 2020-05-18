var qAController = {};

var responseHelper = require('./../Helpers/ResponseHelper');
var qAModel = require('./../Model/qAModel');


// fuction to create question request
// if user has pending request, first it will serve(send user to pdf)
qAController.createRequest = async (req, res) => {
	try {
		let body = req.body;
		if (!body.question_id) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validQSql = `SELECT id FROM catalog_questions WHERE id = ?;`;
		let validQRes = await queryExecute(validQSql, [body.question_id]);
		if (validQRes.length == 0) {
			return responseHelper.sendErrResponse(req, res, ["invalid question_id"]);
		}



		let pendingRequestSql = `
			SELECT 
				uaq.id, uaq.question_id,
				u.email, u.username
			FROM user_asked_question uaq 
			JOIN users u ON u.id = uaq.user_id
			WHERE uaq.pdf_sent = 0 AND uaq.question_id <> ? AND uaq.user_id = ?; 
		`;
		let pendingRequestRes = await queryExecute(pendingRequestSql, [body.question_id, req.user['id']]);

		// sent pdf to previous pending request for same user
		if (pendingRequestRes.length) {
			let val = pendingRequestRes[0];
			let questionData = await qAModel.getSimilarQuestions(val['question_id']);
			await qAModel.sendPdfToUser(val, questionData);
			let updateSql = `UPDATE user_asked_question SET pdf_sent = ? WHERE id = ?;`;
			await queryExecute(updateSql, [1, val['id']]);
		}



		let validateSql = `SELECT id FROM user_asked_question WHERE question_id = ? AND user_id = ?;`;
		let validateRes = await queryExecute(validateSql, [body.question_id, req.user['id']]);
		if (validateRes.length) {
			return responseHelper.sendErrResponse(req, res, ["request already generated."]);
		}
		let insertSql = `INSERT INTO user_asked_question SET question_id  = ?, user_id = ?;`;
		await queryExecute(insertSql, [body.question_id, req.user['id']]);
		let selectSql = `SELECT * FROM catalog_question_answers WHERE question_id = ? ORDER BY 1 DESC LIMIT 5`;
		let selectRes = await queryExecute(selectSql, [body.question_id]);
		return responseHelper.sendSucessResponse(req, res, ["successfull"], selectRes);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}

}


// fuction to send pdf to all pending request users who has gone far 5 min
qAController.cronSendPdf = async (req, res) => {
	try {
		if (req.headers['api_key'] != CRON_API_KEY) {
			return responseHelper.sendErrResponse(req, res, ["invalid api key"]);
		}
		let sendPdfData = await qAModel.getPdfSendData();
		sendPdfData.forEach(async function(val) {
			let questionData = await qAModel.getSimilarQuestions(val['question_id']);
			qAModel.sendPdfToUser(val, questionData).then(() => {
				let updateSql = `UPDATE user_asked_question SET pdf_sent = ? WHERE id = ?;`;
				queryExecute(updateSql, [1, val['id']]);
			}).catch((error) => {
				console.error(error);
			});
		});
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}


// function to when user see the video , update time for same question request.
qAController.updateRequestTime = async (req, res) => {
	try {
		if (!req.params.question_id) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let updateSql = `UPDATE user_asked_question SET updated_at = NOW() WHERE id = ?;`
		await queryExecute(updateSql, [req.params.question_id])
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}



module.exports = qAController;