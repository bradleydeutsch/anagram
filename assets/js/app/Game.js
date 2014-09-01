game.applications.AnagramGame = game.applications.SuperAppWithView.extend({
	elSelector: '#gameContainer',
	
	templateSelector : '#new-game-template',
	
	events : {
		'submit form#submitStringForm' : 'submitString'
	},
	
	initialize : function (options) {
		var _this = this;
		
		game.applications.SuperAppWithView.prototype.initialize.apply(_this, arguments);
		
		if (game.utils.isEmpty(_this.options.user.get('username'))) {
			throw 'Username not valid';
		}
		
		_this.socket = io.connect('http://localhost', {port : 8000, transports : ['websocket']});
		_this.collection = new game.collections.AnagramGameLeaderboard();
		
		_this.viewObject = {
			constructorString : _this.options.constructorString
		}
		
		_this.listenTo(_this.collection, 'add', _this.addOne);
		
		_this.render();
		
		_this.setSocketEventHandlers();
		_this.socket.emit('new player', {
			user : this.options.user.toJSON(),
			constructorWord : this.options.Dictionary.getRandomWord(9)
		});
	},
	
	postRender : function (evt) {
		var _this = this;

        game.applications.SuperAppWithView.prototype.postRender.apply(_this, arguments);

		_this.header = _this.$('h1');
		_this.timer = _this.$('div#timer');
		_this.listEl = _this.$('table');
		_this.players = _this.$('ul');
		_this.form = _this.$('form');
		_this.input = _this.form.find('input');
	},
	
	setSocketEventHandlers : function () {
		var _this = this;
		
		_this.socket.on('connect', _this.onSocketConnected.bind(_this));
		_this.socket.on('set player', _this.onSetPlayer.bind(_this));
		_this.socket.on('new player', _this.onNewPlayer.bind(_this));
		_this.socket.on('start game', _this.onStartGame.bind(_this));
		_this.socket.on('update time', _this.onUpdateTime.bind(_this));
		_this.socket.on('game completed', _this.onGameCompleted.bind(_this));
		_this.socket.on('new word', _this.onNewWord.bind(_this));
		_this.socket.on('reset game', _this.onResetGame.bind(_this));
	},
	
	removeSocketEventHandlers : function () {
		var _this = this,
			event;
		
		for (event in _this.socket.$events) {
			_this.socket.removeAllListeners(event);
		}
	},
	
	onSocketConnected : function () {
		console.log('Connected to socket server');
	},
	
	onSetPlayer : function (player) {
        var _this = this;

		console.log('set player: ' + JSON.stringify(player));
		
		_this.options.user = new game.models.User(player);

        game.eventHandler.publish(null, game.eventHandler.events.GAME_INITIALISED, _this);
	},
	
	onNewPlayer : function (player) {
		console.log('new player: ' +this.cid + JSON.stringify(player));

		this.players.append(_.template($('#player-template').html(), player));
	},
	
	onStartGame : function (constructorWord) {
		var _this = this;
		
		console.log('start game: ' + constructorWord);
		
		_this.buildConstructorStringObj(constructorWord);
		_this.header.text(constructorWord);
		_this.form.find('input').removeAttr('disabled');
	},
	
	onUpdateTime : function (time) {
		this.timer.text(time);
	},
	
	onGameCompleted : function () {
		var _this = this,
			winner = _this.getHighScore();
		
		console.log('game completed');
		
		_this.form.remove();
		
		if (game.utils.isNotEmpty(winner)) {
			winner = _.extend(winner.toJSON(), {
				user : winner.get('user').toJSON()
			});
		}
		
		_this.timer.html(_.template($('#game-over-template').html(), winner));
	},
	
	onNewWord : function (word) {
		console.log('new word: ' + JSON.stringify(word));
		
		this.collection.add(new game.models.Word(word));
	},
	
	onResetGame : function () {
		var _this = this;
		
		console.log('reset game');
		
		_this.header.text('...');
		_this.form.find('input').attr('disabled', 'disabled');
		_this.onUpdateTime('...');
		_this.players.empty();
		_this.collection.reset();
		_this.onNewPlayer(_this.options.user.toJSON());
	},
	
	remove : function () {
		var _this = this;
		
		_this.socket.emit('drop player');
		
		_this.removeSocketEventHandlers();
		
		game.applications.SuperAppWithView.prototype.remove.apply(_this, arguments);
	},
	
	buildConstructorStringObj : function (string) {
		var _this = this,
			constructorStringObj = {},
			nextChar, i;
		
		for (i = 0; i < string.length; i++) {
			nextChar = string.charAt(i);
			if (typeof(constructorStringObj[nextChar]) === 'undefined') {
				constructorStringObj[nextChar] = 0;
			}
			
			constructorStringObj[nextChar]++;
		}
		_this.constructorStringObj = constructorStringObj;
	},
	
	addOne : function (word) {
		this.addOneInPosition(new game.views.WordView({model : word}));
	},
	
	submitString : function (evt) {
		var _this = this,
			string = _this.input.val();
		
		evt.preventDefault();
		
		if (game.utils.isEmpty(string)) {
			throw 'Submission is not valid';
		}
		
		if (_this.isAnagram(string) && _this.isUnique(string) && _this.isWord(string)) {
			_this.addWord(string);
		}
		
		_this.input.val('');
	},
	
	isAnagram : function (string) {
		var _this =  this,
			constructorStringObj, nextChar, i;
		
		if (string.length > _this.constructorString) {
			return false;
		}
		
		constructorStringObj = _.extend({}, _this.constructorStringObj);
		
		for (i = 0; i < string.length; i++) {
			nextChar = string.charAt(i);
			if ((constructorStringObj[nextChar] === undefined) || (constructorStringObj[nextChar] === 0)) {
				return false;
			} else {
				constructorStringObj[nextChar]--;
			}
		}
		return true;
	},
	
	isWord : function (string) {
		return this.options.Dictionary.containsWord(string);
	},
	
	isUnique : function (string) {
		return !this.collection.getEntryByWord(string);
	},
	
	addWord : function (word) {
		var _this = this;
		
		_this.socket.emit('new word', (new game.models.Word({
			user : _this.options.user,
			word : word
		})).toJSON());
	},
	
	getHighScore : function () {
		return this.collection.getHighScore();
	},
	
	getWordAtPosition : function (position) {
		return this.collection.getWordAtPosition(position);
	},
	
	getScoreAtPosition : function (position) {
		return this.collection.getScoreAtPosition(position);
	}
});