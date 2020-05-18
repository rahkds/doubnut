global.MYSQL_CONFIG = {
	HOST: 'localhost',
	USERNAME: 'root',
	PASSWORD: 'rahul',
	DATABASE: 'doubtnut'
};

global.JWT_PRIVATE_KEY = 'KJDLK883KJLDJFKL';

global.SKIP_AUTH_URL = {
	'/doubtnut/user/login': 1,
	'/doubtnut/user/signup': 1,
	'/doubtnut/qa/cron/send_pdf': 1,
}

global.MAIL_TRAP_CONFIG = {
	HOST: 'smtp.mailtrap.io',
	PORT: 2525,
	USERNAME: '212e0e43c28c93',
	PASSWORD: '6eefa4c2c80e58',
};

global.CRON_API_KEY = '2f87e7082c6c9d6299fdafdd6fc36926';
global.PDF_SEND_INACTIVE_DAY = 5;