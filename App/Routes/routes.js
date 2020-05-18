var express = require('express');
var router = express.Router();
var qAController = require('./../Controller/qAController');
var userController = require('./../Controller/UserController');


router.post('/user/signup', userController.signup);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);


router.post('/qa/request', qAController.createRequest);
router.put('/qa/:question_id/videoseen', qAController.updateRequestTime);

//cron url : url hit with each 5 min
router.get('/qa/cron/send_pdf', qAController.cronSendPdf);


module.exports = router;