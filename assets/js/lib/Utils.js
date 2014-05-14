game.utils.privateDataStorage = (function () {
	var dataMap = [];
	
	return function (instance) {
		var dataObject,
			i;
		
		for (i = 0; i < dataMap.length; i++) {
			if (dataMap[i].instance === instance) {
				return dataMap[i].data;
			}
		}
		
		dataObject = {
			instance : instance,
			data : {}
		};
		
		dataMap.push(dataObject);
		
		return dataObject.data;
	};
})();

game.utils.isEmpty = function (val, type) {
	return (((val === null) || (typeof(val) === 'undefined') || (val.length === 0)) && ((type === undefined) || (typeof(val) === type)));
}

game.utils.isNotEmpty = function (val, type) {
	return !game.utils.isEmpty(val, type);
}
