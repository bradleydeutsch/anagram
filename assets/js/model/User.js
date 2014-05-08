game.models.User = game.models.SuperModel.extend({
	defaults : function () {
		return {
			id : null,
			username : null
		};
	}
});