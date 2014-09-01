module.exports = function (models) {
	models.Word = function (startUser, startWord, startScore) {
		var user = startUser,
			word = startWord,
			score = startScore;
		
		var getUser = function () {
			return user;
		};
		
		var getWord = function () {
			return word;
		};
		
		var getScore = function () {
			return score;
		};
		
		var setUser = function (newUser) {
			return user = newUser;
		};
		
		var setWord = function (newWord) {
			return word = newWord;
		};
		
		var setScore = function (newScore) {
			return score = newScore;
		};
		
		var wrap = function () {
			return {
				user : user.wrap(),
				word : word,
				score : score
			};
		};
		
		return {
			getUser : getUser,
			getWord : getWord,
			getScore : getScore,
			setUser : setUser,
			setWord : setWord,
			setScore : setScore,
			wrap : wrap
		};
	};
};