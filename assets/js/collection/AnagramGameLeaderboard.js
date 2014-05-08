game.collections.AnagramGameLeaderboard = game.collections.Leaderboard.extend({
	model : game.models.Word,
	
	leaderboardSize : game.config.ANAGRAM_GAME.LEADERBOARD_SIZE,
	
	comparator : function (model) {
		return 0 - model.get('score');
	},
	
	getEntryByWord : function (string) {
		return this.findWhere({word : string});
	},
	
	getWordAtPosition : function (position) {
		var _this = this,
			word = _this.getEntryAtPosition(position);
		
		return (word) ? word.get('word') : null;
	},
	
	getScoreAtPosition : function (position) {
		var _this = this,
			word = _this.getEntryAtPosition(position);
		
		return (word) ? word.get('score') : null;
	}
});