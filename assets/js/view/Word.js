game.views.WordView = game.views.SuperView.extend({
	tagName : 'tr',
	
	templateSelector : '#score-template',
	
	initialize : function (options) {
		var _this = this;
		
		game.views.SuperView.prototype.initialize.apply(_this, arguments);
		
		_this.viewObject = _.extend({}, _this.model.toJSON(), {
			user : _this.model.get('user').toJSON()
		});
		
		_this.listenTo(_this.model, 'change', _this.render);
		_this.listenTo(_this.model, 'remove', _this.remove);
		_this.listenTo(_this.model.collection, 'reset', _this.remove);
	}
});