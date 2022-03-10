const { Javelin } = require('./src/javelin');
const colors = require('colors');
const {getTime} = require('./src/time-utils');

const javelin = new Javelin(
	process.env.WORKERS, 
	process.env.SITES,
	process.env.PROXIES,
);

javelin.listen(
	'attack', 
	data => console.log(getTime(), colors.green('attack:'), colors.green(data.log))
);

javelin.listen(
	'error', 
	data => console.log(getTime(), 'error:', data.log)
);

try {
	javelin.start();
} catch(e) {
	console.debug(e);
	process.exit(1)
}
