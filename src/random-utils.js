exports.getRandomInt = (number) => {
	return Math.floor(Math.random() * number)
}

exports.getRandomBool = () => {
	return Math.random() < 0.5
}
