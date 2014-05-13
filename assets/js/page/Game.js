game.pages.AnagramGamePage = game.pages.SuperPage.extend({
	elSelector : '#anagramGameContainer',
	
	templateSelector : '#game-template',
	
	events : {
		'submit form#createNewGameForm' : 'startNewGame'
	},
	
	postRender : function (evt) {
		this.username = this.$('input#username');
	},
	
	startNewGame : function (evt) {
		var _this = this;
		
		evt.preventDefault();
		
		if (_this.GameApp) {
			_this.GameApp.remove();
			delete _this.GameApp;
		}
		
		_this.$el.append('<div id="gameContainer"></div>');
		_this.GameApp = new game.applications.AnagramGame({
			Dictionary : _this.options.Dictionary,
			user : new game.models.User({username : _this.username.val()})
		});
	},
	
	getGame : function () {
		return this.GameApp;
	}
});