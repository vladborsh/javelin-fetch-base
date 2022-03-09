const UserAgent = require('user-agents');
const { getRandomInt, getRandomBool } = require('./random-utils');

const getUserAgent = () => {
	const agent = new UserAgent();

	return {
		'User-Agent': agent.toString()
	}
}

const accept = () => {
	return {
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
	}
}

const acceptLanguage = () => {
	const options = [
		'ru-RU,ru',
		'ru,en;q=0.9,en-US;q=0.8'
	]
	return { 'Accept-Language': options[getRandomInt(options.length)] }
}

const getCacheControl = () => {
	const options = [
		'no-cache',
		'max-age=0'
	]
	return { 'Cache-Control': options[getRandomInt(options.length)] }
}

const upgradeInsecureRequest = () => {
    return {
      'Upgrade-Insecure-Requests': 1
    }
  }

const acceptEncoding = () => {
	return {
		'Accept-Encoding': 'gzip, deflate, br'
	}
}

const secHeaders = () => {
	return {
		"sec-fetch-mode": "navigate",
		"sec-fetch-site": "none",
		"sec-fetch-dest": "document",
		"sec-fetch-user": "?1",
		"sec-ch-ua-platform": "Windows",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"'
	}
}

const getAdditionalRandomHeaders = () => {
	let headers = {}
	const headerFunctions = [
		getCacheControl,
		upgradeInsecureRequest,
		acceptEncoding,
		secHeaders,
	];
	
	headerFunctions.filter(getRandomBool).forEach(func => {
		headers = { ...headers, ...func() }
	});

	return headers
}

exports.generateRequestHeaders = () => {
	const baseHeaders = {
		...getUserAgent(),
		...accept(),
		...acceptLanguage()
	}

	const randomHeaders = getAdditionalRandomHeaders()
	
	return { ...baseHeaders, ...randomHeaders }
}
