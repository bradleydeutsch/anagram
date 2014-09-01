game.applications.SuperApp = Backbone.View.extend({
	initialize : function (options) {
		var _this = this;
		
		_this.options = options || {};
	}
});

game.applications.SuperAppWithView = game.applications.SuperApp.extend({
	viewObject : {},
	
	initialize : function (options) {
		var _this = this;
		
		game.applications.SuperApp.prototype.initialize.apply(_this, arguments);
		
		_this.setElement($(_this.elSelector));
		
		_this.template = _.template($(_this.templateSelector).html());
		
		_this.listenTo(_this, 'postRender', _this.postRender);
	},
	
	render : function () {
		var _this = this;
		
		_this.$el.html(_this.template(_this.viewObject));
		
		_this.trigger('postRender');
		
		return _this;
	},
	
	postRender : function (evt) {
        game.utils.bindPlugins();
    },
	
	addOneInPosition : function (view) {
		var _this = this,
			index = _this.collection.indexOf(view.model),
			renderedView = $(view.render().el);
		
		if (index === 0) {
			renderedView.prependTo(_this.listEl);
		} else {
			_this.listEl.find(view.tagName).eq(index - 1).after(renderedView);
		}
	}
});