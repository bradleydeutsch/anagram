game.collections.Leaderboard = game.collections.SuperCollection.extend({
	add : function (word) {
		var _this = this;
		
		game.collections.SuperCollection.prototype.add.apply(_this, arguments);
		
		if (_this.length > _this.leaderboardSize) {
			_this.pop();
		}
	},
	
	getHighScore : function () {
		return this.at(0);
	},
	
	getEntryAtPosition : function (position) {
		return this.at(position);
	}
});