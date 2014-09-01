game.applications.SuperPlugin = Backbone.View.extend({
    defaults : {},

    pluginLocked : false,

    initialize : function (frm, options) {
        var _this = this;

        _this.options = options || {};

        for (attribute in _this.defaults) {
            if (!_this.options[attribute]) {
                _this.options[attribute] = _this.defaults[attribute];
            }
        }
    },

    isLocked : function (lock) {
        var _this = this,
            isLocked = this.pluginLocked;

        if (lock) {
            _this.lock();
        }

        return isLocked;
    },

    lock : function () {
        this.pluginLocked = true;
    },

    unlock : function () {
        this.pluginLocked = false;
    }
});