game.collections.SuperCollection = Backbone.Collection.extend({
	initialize : function (options) {
		var _this = this;
		
		_this.options = options || {};
	}
});