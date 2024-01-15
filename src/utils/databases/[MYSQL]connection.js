const { QuickDB, MySQLDriver } = require('quick.db');
(async () => {
	const mysqlDriver = new MySQLDriver({
		host: process.env.HOST_DB,
		user: process.env.USER_DB,
		password: process.env.PASS_DB,
		database: process.env.NAME_DB,
	});

	await mysqlDriver.connect(); // connect to the database **this is important**

	return new QuickDB({ driver: mysqlDriver });
})();