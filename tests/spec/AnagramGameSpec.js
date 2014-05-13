describe("AnagramGame", function () {
	var wordList = 'some\nlist\nof\nwords\nwill\nlive\nhere\nand\nincluding\nreally\nlong\nones\nlike\nexperience',
		constructorWord = 'cancontainlistofwords',
		randomeWord = 'somelongishrandomeword',
		dictionary,
		anagramGame;
	
	beforeEach(function () {
		loadFixtures('game-container.html', 'game-template.html', 'new-game-template.html', 'player-template.html', 'score-template.html', 'game-over-template.html');
		
		socket = {
			emit : function () {},
			on : function () {}
		};
		io = {
			connect : function () {
				return socket;
			}
		};
		
		dictionary = {
			containsWord : function () {},
			getRandomWord : function () {}
		};
		
		spyOn(io, 'connect').and.callThrough();
		spyOn(socket, 'emit');
		spyOn(socket, 'on');
		
		anagramGame = new game.pages.AnagramGamePage({
			Dictionary : dictionary
		});
		
		expect($('#gameContainer').length).toEqual(0);
	});
	
	describe('from new can', function () {
		var setFormDetails = function (username, submit) {
				anagramGame.$('input#username').val(username);
				
				if (submit) {
					anagramGame.$('form#createNewGameForm').submit();
				}
			},
			setExpectationsOfNewGame = function (username) {
				expect($('div#gameContainer h1').text()).toEqual('...');
				expect(typeof(anagramGame.getGame())).toEqual('object');
				
				expect(io.connect).toHaveBeenCalled();
				
				expect(socket.on).toHaveBeenCalledWith('connect', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('set player', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('new player', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('start game', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('update time', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('game completed', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('new word', jasmine.any(Function));
				expect(socket.on).toHaveBeenCalledWith('reset game', jasmine.any(Function));
				
				
				expect(socket.emit).toHaveBeenCalledWith('new player', jasmine.objectContaining({
					user : {
						username : username,
						id : null,
						attribute : undefined
					},
					constructorWord : randomeWord
				}));
			};
		
		it('be initialised with a valid username', function () {
			spyOn(dictionary, 'getRandomWord').and.returnValue(randomeWord);
			
			setFormDetails('username', true);
			
			setExpectationsOfNewGame('username');
		});
		
		it('be initialised with a valid username, but then removed by an invalid one', function () {
			spyOn(dictionary, 'getRandomWord').and.returnValue(randomeWord);
			
			setFormDetails('username', true);
			
			setExpectationsOfNewGame('username');
			
			setFormDetails('', false);
			expect(function () {
				anagramGame.$('form#createNewGameForm').submit();
			}).toThrow('Username not valid');
			expect($('div#gameContainer h1').length).toEqual(0);
			expect(typeof(anagramGame.getGame())).toEqual('undefined');
		});
	});
	
	describe('when initialised can', function () {
		var gameApp;
		
		beforeEach(function () {
			anagramGame.$('input#username').val('username');
			anagramGame.$('form#createNewGameForm').submit();
			gameApp = anagramGame.getGame();
		});
		
		it('set the current player', function () {
			expect(gameApp.options.user.get('id')).toBeNull();
			expect(gameApp.options.user.get('username')).toEqual('username');
			gameApp.onSetPlayer({
				id : 1,
				username : 'newname'
			});
			expect(gameApp.options.user.get('id')).toEqual(1);
			expect(gameApp.options.user.get('username')).toEqual('newname');
		});
		
		it('add a new player', function () {
			var playerList = $('div#gameContainer ul');
			
			expect(playerList.find('li').length).toEqual(0);
			gameApp.onNewPlayer({
				username : 'newplayer'
			});
			expect(playerList.find('li').length).toEqual(1);
		});
		
		it('start a new game and refresh time', function () {
			var constructorWord = 'somelongishword',
				h1 = gameApp.$('h1')
				wordInputField = gameApp.$('form#submitStringForm input'),
				timer = gameApp.$('div#timer');
			
			expect(h1.text()).toEqual('...');
			expect(wordInputField.attr('disabled')).toEqual('disabled');
			expect(timer.text()).toEqual('...');
			gameApp.onStartGame(constructorWord);
			gameApp.onUpdateTime(5);
			expect(h1.text()).toEqual(constructorWord);
			expect(wordInputField.attr('disabled')).toEqual(undefined);
			expect(timer.text()).toEqual('5');
		});
		
		describe('start a new game and', function () {
			var setFormDetails = function (word) {
					gameApp.$('form#submitStringForm input').val(word);
					gameApp.$('form#submitStringForm').submit();
				},
				leaderboardTable;
			
			beforeEach(function () {
				var user = {
					id : 1,
					username : 'newname'
				};
				
				gameApp.onSetPlayer(user);
				gameApp.onNewPlayer(user);
				gameApp.onStartGame('somelongishword');
			});
			
			it('validate a string is an anagram of another string', function () {
				var validAnagram = 'ishwodl',
					invalidAnagram_1 = 'ssss',
					invalidAnagram_2 = 'xxishwodxx';
					
				expect(gameApp.isAnagram(validAnagram)).toBe(true);
				expect(gameApp.isAnagram(invalidAnagram_1)).toBe(false);
				expect(gameApp.isAnagram(invalidAnagram_2)).toBe(false);
			});
			
			it('validate a string is a word found in the dictionary', function () {
				var validWord = 'some';
				
				spyOn(dictionary, 'containsWord').and.returnValue(true);
				
				expect(gameApp.isWord(validWord)).toBe(true);
			});
			
			it('validate a string is NOT a word found in the dictionary', function () {
				var invalidWord = 'idontexist';
				
				spyOn(dictionary, 'containsWord').and.returnValue(false);
				
				expect(gameApp.isWord(invalidWord)).toBe(false);
			});
			
			it('validate a string does not already exist in the leaderboard', function () {
				var newWord = 'some';
				
				expect(gameApp.isUnique(newWord)).toBe(true);
				gameApp.onNewWord((new game.models.Word({
					user : gameApp.options.user,
					word : newWord
				})).toJSON());
				expect(gameApp.isUnique(newWord)).toBe(false);
			});
			
			it('then submitting a valid word will add a new word', function () {
				var newWord = 'long';
				
				expect(gameApp.$('table').find('tr').length).toEqual(0);
				spyOn(dictionary, 'containsWord').and.returnValue(true);
				setFormDetails(newWord);
				
				expect(socket.emit).toHaveBeenCalledWith('new word', jasmine.any(Object));
				
				gameApp.onNewWord((new game.models.Word({
					user : gameApp.options.user,
					word : newWord
				})).toJSON());
				expect(gameApp.$('table').find('tr').length).toEqual(1);
			});
			
			it('then submitting an invalid word will NOT add a new word', function () {
				var newWord = 'idontexist';
				
				expect(gameApp.$('table').find('tr').length).toEqual(0);

				setFormDetails(newWord);
				expect(socket.emit).not.toHaveBeenCalledWith('new word', jasmine.any(Object));
				
				expect(gameApp.$('table').find('tr').length).toEqual(0);
			});
			
			it('complete a game when the time is up with NO submitted words', function () {
				gameApp.onGameCompleted();
				expect(gameApp.$('div#timer').text().trim()).toEqual('Game Over!');
			});
			
			it('complete a game when the time is up with submitted words', function () {
				var leaderboardWords = ['last', 'topwordsubmission', 'middle'];
				
				for (word in leaderboardWords) {
					gameApp.onNewWord((new game.models.Word({
						user : gameApp.options.user,
						word : leaderboardWords[word]
					})).toJSON());
				}
				
				gameApp.onGameCompleted();
				expect(gameApp.$('div#timer').text().trim()).toEqual('Game Over! newname wins with word "topwordsubmission" and a score of 17');
			});
			
			it('reset a game when a user drops out', function () {
				var constructorWord = 'somelongishword',
					h1 = gameApp.$('h1')
					wordInputField = gameApp.$('form#submitStringForm input'),
					timer = gameApp.$('div#timer'),
					players = gameApp.$('ul');
				
				gameApp.onNewPlayer({
					id : 2,
					username : 'anothername'
				});
				gameApp.onUpdateTime(5);
				gameApp.onNewWord((new game.models.Word({
					user : gameApp.options.user,
					word : 'someword'
				})).toJSON());
				
				expect(h1.text()).toEqual('somelongishword');
				expect(wordInputField.attr('disabled')).toBe(undefined);
				expect(timer.text()).toEqual('5');
				expect(players.find('li').length).toEqual(2);
				expect(gameApp.collection.length).toEqual(1);
				
				gameApp.onResetGame();
				
				expect(h1.text()).toEqual('...');
				expect(wordInputField.attr('disabled')).toEqual('disabled');
				expect(timer.text()).toEqual('...');
				expect(players.find('li').length).toEqual(1);
				expect(gameApp.collection.length).toEqual(0);
			});
			
			describe('with entries in the leaderboard', function () {
				var leaderboardWords = ['last', 'topwordsubmission', 'middle'];
				
				beforeEach(function () {
					for (word in leaderboardWords) {
						gameApp.onNewWord((new game.models.Word({
							user : gameApp.options.user,
							word : leaderboardWords[word]
						})).toJSON());
					}
				});
				
				it('get a high score', function () {
					expect(gameApp.getHighScore().get('word')).toEqual('topwordsubmission');
				});
				
				it('get a word at a given position', function () {
					expect(gameApp.getWordAtPosition(0)).toEqual('topwordsubmission');
					expect(gameApp.getWordAtPosition(1)).toEqual('middle');
					expect(gameApp.getWordAtPosition(2)).toEqual('last');
				});
				
				it('get a score at a given position', function () {
					expect(gameApp.getScoreAtPosition(0)).toEqual(17);
					expect(gameApp.getScoreAtPosition(1)).toEqual(6);
					expect(gameApp.getScoreAtPosition(2)).toEqual(4);
				});
			});
		});
	});
});