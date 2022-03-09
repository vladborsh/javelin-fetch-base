exports.getProxyObj = proxy => {
	let proxyObj = {}

	const proxyAddressSplit = proxy.ip.split(':')
	const proxyIP = proxyAddressSplit[0]
	const proxyPort = parseInt(proxyAddressSplit[1])
	proxyObj.host = proxyIP
	proxyObj.port = proxyPort

	if(proxy.auth) {
		const proxyAuthSplit = proxy.auth.split(':')
		const proxyUsername = proxyAuthSplit[0]
		const proxyPassword = proxyAuthSplit[1]
		proxyObj.auth = { username: proxyUsername, password: proxyPassword }
	}

	return proxyObj;
}
