var express = require('express');
var app = express();
var bodyParse = require('body-parser');

require('./App/Config/config');
require('./App/Config/connection');
require('./App/Config/constant');

var Auth = require('./App/Middleware/Auth');

var router = require('./App/Routes/routes');

app.use(bodyParse.json({
	limit: '50mb',
}));
app.use(Auth.checkAuth);
app.use('/doubtnut', router);



app.listen(8081, function() {
	console.log("connected");
});