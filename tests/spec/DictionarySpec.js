describe('Dictionary', function() {
	var wordList = 'some\nlist\nof\nwords\nwill\nlive\nhere\nand\nincluding\nreally\nlong\nones\nlike\nexperience',
		dictionary;
	
	beforeEach(function() {
		dictionary = new game.applications.Dictionary();
		dictionary.wordList = wordList;
	});
	
	describe('that contains words [' + wordList + '] should', function() {
		it('be able to find the first word "some"', function() {
			expect(dictionary.containsWord('some')).toBe(true);
		});
		
		it('be able to find word "list"', function() {
			expect(dictionary.containsWord('list')).toBe(true);
		});
		
		it('be able to find the last word "experience"', function() {
			expect(dictionary.containsWord('experience')).toBe(true);
		});
		
		it('NOT be able to find word "idontexist"', function() {
			expect(dictionary.containsWord('idontexist')).toBe(false);
		});
		
		it('NOT be able to find two running words "live here"', function() {
			expect(dictionary.containsWord('live here')).toBe(false);
		});
	});
});