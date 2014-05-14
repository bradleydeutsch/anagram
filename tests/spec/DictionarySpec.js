describe('A dictionary', function () {
	var wordList = 'some\nlist\nof\nwords\nwill\nlive\nhere\nand\nincluding\nreally\nlong\nones\nlike\nexperience',
		dictionary;
	
	beforeEach(function () {
		jasmine.Ajax.install();
		
		dictionary = new game.applications.Dictionary();
		
		expect(jasmine.Ajax.requests.mostRecent().url).toBe(game.config.DICTIONARY_LOCATION);
		jasmine.Ajax.requests.mostRecent().response({
			status : 200,
			contentType : 'text/plain',
			responseText : wordList
		});
	});
	
	afterEach(function () {
		jasmine.Ajax.uninstall();
	});
	
	describe('that contains words [' + wordList + '] should', function () {
		it('be able to find the first word "some"', function () {
			expect(dictionary.containsWord('some')).toBe(true);
		});
		
		it('be able to find word "list"', function () {
			expect(dictionary.containsWord('list')).toBe(true);
		});
		
		it('be able to find the last word "experience"', function () {
			expect(dictionary.containsWord('experience')).toBe(true);
		});
		
		it('NOT be able to find word "idontexist"', function () {
			expect(dictionary.containsWord('idontexist')).toBe(false);
		});
		
		it('NOT be able to find two running words "live here"', function () {
			expect(dictionary.containsWord('live here')).toBe(false);
		});
		
		it('get a random word with a minimum of 5 characters', function () {
			jasmine.addMatchers({
				toBeGreaterThanOrEqualTo : jasmineCustomMatchers.toBeGreaterThanOrEqualTo
			});
			
			expect(dictionary.getRandomWord(5).length).toBeGreaterThanOrEqualTo(5);
		});
		
		it('return an empty string if no word with a minium of 15characters can be found', function () {
			expect(dictionary.getRandomWord(15).length).toBe(0);
		});
	});
});