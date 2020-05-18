var pdf = require('html-pdf');
var qAModel = {};

qAModel.getPdfSendData = async () => {
	return new Promise(async function(resolve, reject) {
		try {
			let selectSql = `
				SELECT 
					uaq.id, uaq.question_id,
					u.email, u.username
				FROM user_asked_question uaq 
				JOIN users u ON u.id = uaq.user_id
				WHERE uaq.pdf_sent = 0 AND TIMESTAMPDIFF(MINUTE, uaq.updated_at, NOW()) >= ? 
				ORDER BY uaq.id ASC;
			`;
			let selectRes = await queryExecute(selectSql, [PDF_SEND_INACTIVE_DAY]);
			return resolve(selectRes);
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
}

qAModel.getSimilarQuestions = async (questionId) => {
	return new Promise(async function(resolve, reject) {
		try {
			if (!questionId) {
				return reject("empty questionId");
			}
			let selectSql = `
				SELECT 
					cq.id AS similar_question_id, cq.question_desc, cq.question_desc_url
				FROM catalog_question_similars cqs
				JOIN catalog_questions cq ON cq.id = cqs.similar_question_id
				WHERE cqs.question_id = ?;
			`;
			let selectRes = await queryExecute(selectSql, [questionId]);
			return resolve(selectRes);
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
}

qAModel.sendPdfToUser = async (userData, questionData) => {
	return new Promise(async function(resolve, reject) {
		try {

			if (!userData['email'] || !userData['username'] || Array.isArray(questionData) == false) {
				return reject("invalid params");
			}

			let emailContent = `
			  <div>
			  	 <h1>Hi ${userData['username']},</h>
			  	 <p> Please PFA, list of similar questions of your last request.</p>
			  </div>

			`;

			let questionStr = ``;
			questionData.forEach(function(val) {
				questionStr += `
					<tr>
						<td>${val['similar_question_id']}</td>
						<td>${val['question_desc']}</td>
						<td>${val['question_desc_url']}</td>
					</tr>
				`;
			});

			let htmlString = `
				<div>
					<table>
						<tr>
							<th>Question Id</th>
							<th>Question Desc</th>
							<th>Question Url</th>
						</tr>
						${questionStr}
					</table>
				</div>
			`;
			let fileLocation = await htmlToPdf(htmlString);
			let emailOptions = {
				from: 'test@tesla1.com',
				to: userData['email'],
				subject: 'Similar Questions',
				html: emailContent,
				attachments: [{
					filename: 'similar_questions.pdf',
					path: fileLocation,
				}]
			};
			transport.sendMail(emailOptions, function(err, info) {
				console.error(err);
			});
			return resolve("successfull");
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
}

async function htmlToPdf(html) {
	return new Promise(function(resolve, reject) {
		try {
			let options = {
				format: 'Letter',
			};
			let fileLocation = `/tmp/${new Date().valueOf()}.pdf`
			pdf.create(html, options).toFile(fileLocation, function(err, data) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				return resolve(fileLocation);
			});
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = qAModel;