game.models.SuperModel = Backbone.Model.extend({
	defaults : {},
	
	initialize : function (options) {
		var _this = this,
			attribute;

		_this.options = options || {};
		
		for (attribute in _this.defaults) {
			if (!_this.get(attribute)) {
				_this.set({attribute : _this.defaults[attribute]}, {silent : true});
			}
		}
	}
});