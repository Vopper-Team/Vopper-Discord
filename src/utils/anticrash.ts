process.on('unhandledRejection', (reason, p) => {
	console.log('[Sistema ANTICRASH] ',reason, p);
});
process.on('uncaughtException', (err, origin) => {
	console.log('[Sistema ANTICRASH] ', err, origin);
});