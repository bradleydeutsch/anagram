game.models.Word = game.models.SuperModel.extend({
	defaults : function () {
		return {
			user : null,
			word : null,
			score : null
		};
	},
	
	initialize : function (options) {
		var _this = this;
		
		game.models.SuperModel.prototype.initialize.apply(_this, arguments);
		
		_this.set('score', _this.get('word').length);
		if ((game.utils.isNotEmpty(_this.get('user'))) && (!(_this.get('user') instanceof game.models.User))) {
			_this.set('user', new game.models.User(_this.get('user')));
		}
	}
});