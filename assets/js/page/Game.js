game.pages.AnagramGamePage = game.pages.SuperPage.extend({
	elSelector : '#anagramGameContainer',
	
	templateSelector : '#game-template',
	
	events : {
		'submit form#createNewGameForm' : 'startNewGame'
	},
	
	postRender : function (evt) {
        game.applications.SuperAppWithView.prototype.postRender.apply(this, arguments);

        this.form = this.$('form#createNewGameForm');
		this.username = this.form.find('input#username');

        this.setupForms();
	},

    setupForms : function () {
        var _this = this;

        _this.form.validateForm({
            beforeValidate : (function (_this) {
                return function () {
                    if (_this.GameApp) {
                        _this.GameApp.remove();
                        delete _this.GameApp;
                    }
                }
            })(_this),
            validationRules : [
                {
                    name : 'username',
                    rule : 'notEmpty maxLength',
                    options : {
                        maxLength : 8
                    }
                }
            ]
        });
    },

	startNewGame : function (evt) {
		var _this = this;

		evt.preventDefault();

        _this.form.data('validateForm').lock();
        game.utils.addPageLoader();
		game.eventHandler.subscribe(null, game.eventHandler.events.GAME_INITIALISED, function (event, gameApp) {
            var _this = this;

            game.utils.removePageLoader();
            game.eventHandler.unsubscribe(null, game.eventHandler.events.GAME_INITIALISED);
            console.log(_this.form.data('validateForm'))
            _this.form.data('validateForm').unlock();
        }, _this);

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