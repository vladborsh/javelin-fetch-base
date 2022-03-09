const { Javelin } = require('./src/javelin');

const javelin = new Javelin(
	process.env.WORKERS, 
	process.env.SITES,
	process.env.PROXIES,
);

javelin.listen(
	'attack', 
	data => console.log('attack:', data.log)
);

javelin.listen(
	'error', 
	data => console.log('error:', data.log)
);

try {
	javelin.start();
} catch(e) {
	console.debug(e);
	process.exit(1)
}
