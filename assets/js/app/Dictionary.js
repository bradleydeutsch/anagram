game.applications.Dictionary = game.applications.SuperApp.extend({
	initialize : function (options) {
		var _this = this;
		
		game.applications.SuperApp.prototype.initialize.apply(_this, arguments);
		
		$.ajax({
			url : game.config.DICTIONARY_LOCATION,
			cache : true,
			success : function (wordList) {
				_this.wordList = wordList;
				
				if (_this.options.callback) {
					_this.options.callback.call(window, _this);
				}
			}
		});
		
		return _this;
	},
	
	containsWord : function (word) {
		return (this.wordList.match(new RegExp('\\b' + word + '\\b', 'g'))) ? true : false;
	},
	
	getRandomWord : function (minLength) {
		var _this = this;
			wordList = _this.wordList.match(new RegExp('\\b[a-z]{' + minLength + ',50}\\b', 'g'));
		
		if (!wordList) {
			return '';
		}
		
		return wordList[Math.floor(Math.random() * wordList.length)];
	}
});