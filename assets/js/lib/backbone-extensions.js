Backbone.Model.prototype.toJSON = function () {
	var json = _.clone(this.attributes),
		attr;
	
	for (attr in json) {
		if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
			json[attr] = json[attr].toJSON();   
		}
	}
	return json;
};