game.views.SuperView = Backbone.View.extend({
	viewObject : {},
	
	initialize : function (options) {
		var _this = this;

		_this.options = options || {};
		
		_this.template = _.template($(_this.templateSelector).html());
		
		_this.listenTo(_this, 'postRender', _this.postRender);
	},
	
	render : function () {
		var _this = this;
		
		_this.$el.html(_this.template(_this.viewObject));
		
		_this.trigger('postRender');
		
		return _this;
	},
	
	postRender : function (evt) {},
	
	remove : function () {
		this.$el.remove();
	}
});