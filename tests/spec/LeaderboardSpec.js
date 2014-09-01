describe('A leaderboard', function () {
	var leaderboard, user, word_1, word_2, word_3;
	
	beforeEach(function () {		
		leaderboard = new game.collections.AnagramGameLeaderboard();
		user = new game.models.User('username');
		word_1 = new game.models.Word({
			user : user,
			word : 'someword1'
		});
		word_2 = new game.models.Word({
			user : user,
			word : 'anotherquietlongword2'
		});
		word_3 = new game.models.Word({
			user : user,
			word : 'yetanotherword3'
		});
		
		expect(leaderboard.length).toBe(0);
		leaderboard.add(word_1);
		leaderboard.add(word_2);
		leaderboard.add(word_3);
	});
	
	it('can have records added to it', function () {
		expect(leaderboard.length).toBe(3);
	});
	
	it('can get the highest scoring record', function () {
		expect(leaderboard.getHighScore()).toEqual(word_2);
	});
	
	it('can get a record at a specific position', function () {
		expect(leaderboard.getEntryAtPosition(0)).toEqual(word_2);
		expect(leaderboard.getEntryAtPosition(1)).toEqual(word_3);
		expect(leaderboard.getEntryAtPosition(2)).toEqual(word_1);
	});
	
	it('can get a record by word', function () {
		expect(leaderboard.getEntryByWord(word_1.get('word'))).toEqual(word_1);
		expect(leaderboard.getEntryByWord(word_2.get('word'))).toEqual(word_2);
		expect(leaderboard.getEntryByWord(word_3.get('word'))).toEqual(word_3);
	});
	
	it('can get a word at a given position', function () {
		expect(leaderboard.getWordAtPosition(0)).toEqual(word_2.get('word'));
		expect(leaderboard.getWordAtPosition(1)).toEqual(word_3.get('word'));
		expect(leaderboard.getWordAtPosition(2)).toEqual(word_1.get('word'));
	});
	
	it('can get a word at a given position', function () {
		expect(leaderboard.getScoreAtPosition(0)).toEqual(word_2.get('score'));
		expect(leaderboard.getScoreAtPosition(1)).toEqual(word_3.get('score'));
		expect(leaderboard.getScoreAtPosition(2)).toEqual(word_1.get('score'));
	});
	
	describe('which is full', function () {
		beforeEach(function () {
			var i;
			
			leaderboard = new game.collections.AnagramGameLeaderboard();
			
			for (i = 0; i < leaderboard.leaderboardSize; i++) {
				leaderboard.add(new game.models.Word({
					user : user,
					word : 'word' + i
				}));
			}
			expect(leaderboard.length).toBe(leaderboard.leaderboardSize);
		});
		
		it('will only add a record if the score beats an existing record score', function () {
			var weakWord = 'i';
			
			leaderboard.add(new game.models.Word({
				user : user,
				word : weakWord
			}));
			
			expect(leaderboard.length).toBe(leaderboard.leaderboardSize);
			expect(leaderboard.getEntryByWord(weakWord)).toBe(undefined);
		});
		
		it('will add a record and push out another if its score is better than one already in the collection', function () {
			var strongWord = 'iamamegastrongfantasticword',
				word = new game.models.Word({
					user : user,
					word : strongWord
				}),
				weakestWord = leaderboard.getEntryAtPosition(leaderboard.leaderboardSize - 1);
			
			leaderboard.add(word);
			
			expect(leaderboard.length).toBe(leaderboard.leaderboardSize);
			expect(leaderboard.getEntryByWord(strongWord)).toBe(word);
			expect(leaderboard.getEntryByWord(weakestWord.get('word'))).toBe(undefined);
		});
	});
});