module.exports = function (utils) {
	utils.getFourHex = function () {
		return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
	};
	
	utils.getGUID = function () {
		return (utils.getFourHex() + utils.getFourHex() + '-' + utils.getFourHex() + '-' + utils.getFourHex() + '-' + utils.getFourHex() + '-' + utils.getFourHex() + utils.getFourHex() + utils.getFourHex());
	};
};