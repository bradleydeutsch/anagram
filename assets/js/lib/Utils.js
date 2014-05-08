game.utils.isEmpty = function (val, type) {
	return (((val === null) || (typeof(val) === 'undefined') || (val.length === 0)) && ((type === undefined) || (typeof(val) === type)));
}

game.utils.isNotEmpty = function (val, type) {
	return !game.utils.isEmpty(val, type);
}
