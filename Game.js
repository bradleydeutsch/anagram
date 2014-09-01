var util = require('util'),
	io = require('socket.io'),
	game = require('./config').game,
	games;

require('./Utils')(game.utils);
require('./User')(game.models);
require('./Word')(game.models);

function init() {
	socket = io.listen(8000);
	
	socket.configure(function () {
		socket.set('transports', ['websocket']);
		socket.set('log level', 2);
	});
	
	games = new Games();
	
	setEventHandlers();
}

var setEventHandlers = function () {
	socket.sockets.on('connection', onSocketConnection);
};

var onSocketConnection = function (client) {
	var game;
	
	util.log('Player connected: ' + client.id);
	
	client.on('disconnect', function () {
		util.log('Player disconnected: ' + client.id);
		
		game.disconnectPlayer(this);
	});
	
	client.on('drop player', function () {
		util.log('Player dropped: ' + client.id);
		
		game.disconnectPlayer(this);
	});
	
	client.on('new player', function (data) {
		game = games.getInactive();
		
		util.log('Player added: ' + this.id);
		
		if (!game) {
			util.log('Create new game');
			
			game = games.createGame();
		}
		
		game.addPlayer(this, data);
	});
	
	client.on('new word', function (word) {
		util.log("New word : " + JSON.stringify(word));
		
		game.addWord(this, word);
	});
};

var Games = function () {
	var active, inactive, completed;
	
	var init = function () {
		active = [];
		inactive = [];
		completed = [];
	};
	
	var createGame = function () {
		var game = new Game();
		
		inactive.push(game);
		
		return game;
	};
	
	var moveGame = function (id, from, to) {
		var thisGame,
			i;
		
		for (i = 0; i < from.length; i++) {
			if (from[i].getId() === id) {
				thisGame = from.splice(i, 1)[0];
			}
		}
		if (typeof(thisGame) !== 'undefined') {
			to.push(thisGame);
		}
	};
	
	var makeActive = function (id) {
		util.log('Make active: ' + id);
		
		moveGame(id, inactive, active);
	};
	
	var makeInactive = function (id) {
		util.log('Make inactive: ' + id);
		
		moveGame(id, active, inactive);
	};
	
	var makeCompleted = function (id) {
		util.log('Make completed: ' + id);
		
		moveGame(id, active, completed);
	};
	
	var getInactive = function () {
		if (inactive.length > 0) {
			util.log('Found inactive game: ' + inactive[0].getId());
			
			return inactive[0];
		}
	};
	
	init();
	
	return {
		createGame : createGame,
		makeActive : makeActive,
		makeInactive : makeInactive,
		makeCompleted : makeCompleted,
		getInactive : getInactive
	};
};

var Game = function () {
	var id, players, gameOver, time, constructorWords, timerInterval;
	
	var init = function () {
		id = game.utils.getGUID();
		players = [];
		gameOver = false;
		resetGame();
	};
	
	var resetGame = function () {
		time = 20;
		constructorWords = [];
	};
	
	var getId = function () {
		return id;
	};
	
	var isGameOver = function () {
		return gameOver; 
	};
	
	var sendToAllPlayers = function (event, options) {
		var i;
		
		for (i = 0; i < players.length; i++) {
			players[i].getClient().emit(event, options)
		}
	};
	
	var sendToOtherPlayers = function (id, event, options) {
		var i;
		
		for (i = 0; i < players.length; i++) {
			if (players[i].getClient().id !== id) {
				players[i].getClient().emit(event, options)
			}
		}
	};
	
	var addPlayer = function (client, data) {
		var user = new game.models.User(client, client.id, data.user.username),
			wrappedUser = user.wrap(),
			i;
		
		players.push(user);
		
		client.emit('set player', wrappedUser);
		
		sendToAllPlayers('new player', wrappedUser);
		for (i = 0; i < players.length; i++) {
			if (players[i].getId() !== user.getId()) {
				client.emit('new player', players[i].wrap());
			}
		}
		
		constructorWords.push(data.constructorWord);
		
		if (players.length === 2) {
			startGame(client);
		}
	};
	
	var getPlayerById = function (id) {
		var i;
		
		for (i = 0; i < players.length; i++) {
			if (players[i].getId() === id) {
				return players[i];
			}
		}
		return null;
	};
	
	var disconnectPlayer = function (client) {
		var i;
		
		if (isGameOver()) {
			return;
		}
		
		sendToOtherPlayers(client.id, 'reset game');
		
		clearInterval(timerInterval);
		resetGame();
		
		for (i = 0; i < players.length; i++) {
			if (players[i].getId() === client.id) {
				players.splice(i, 1);
			}
		}
		
		games.makeInactive(getId());
	};
	
	var startGame = function (client) {
		var constructorWord = constructorWords[Math.floor(Math.random() * constructorWords.length)];
		
		util.log('Start Game');
		
		sendToAllPlayers('start game', constructorWord);
		games.makeActive(getId());
		
		timerInterval = setInterval(function () {
			if (time === 0) {
				gameCompleted(client);
			} else {
				time--;
				sendToAllPlayers('update time', time);
			}
		}, 1000);
	};
	
	var addWord = function (client, word) {
		var user = getPlayerById(word.user.id),
			word = new game.models.Word(user, word.word, word.score);
		
		sendToAllPlayers('new word', word.wrap());
	};
	
	var gameCompleted = function (client) {
		util.log('Game Completed');
		
		gameOver = true;
		
		clearInterval(timerInterval);
		
		sendToAllPlayers('game completed');
		
		games.makeCompleted(getId());
	};
	
	init();
	
	return {
		getId : getId,
		isGameOver : isGameOver,
		addPlayer : addPlayer,
		getPlayerById : getPlayerById,
		disconnectPlayer : disconnectPlayer,
		addWord : addWord
	};
};

init();