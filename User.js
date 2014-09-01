module.exports = function (models) {
	models.User = function (startClient, startId, startUsername) {
		var client = startClient,
			id = startId,
			username = startUsername;
		
		var getClient = function () {
			return client;
		};
		
		var getId = function () {
			return id;
		};
		
		var getUsername = function () {
			return username;
		};
		
		var setClient = function (newClient) {
			client = newClient;
		};
		
		var setId = function (startId) {
			id = newId;
		};
		
		var setUsername = function (newUsername) {
			username = newUsername;
		};
		
		var wrap = function () {
			return {
				id : id,
				username : username
			};
		};
		
		return {
			getClient : getClient,
			getId : getId,
			getUsername : getUsername,
			setClient : setClient,
			setId : setId,
			setUsername : setUsername,
			wrap : wrap
		};
	};
};