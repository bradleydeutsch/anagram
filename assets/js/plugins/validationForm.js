game.plugins.Form = game.applications.SuperPlugin.extend({
    defaults : {
        addFormMessage : true,
        validationRules : []
    },

    errors : [],

    events : {
        'submit' : 'submitForm'
    },

    initialize : function (frm, options) {
        var _this = this;

        game.applications.SuperPlugin.prototype.initialize.apply(_this, arguments);

        _this.setElement(frm);

        _this.submitButton = _this.$el.find('input[type="submit"]');
    },

    lock : function () {
        var _this = this;

        game.applications.SuperPlugin.prototype.lock.apply(_this, arguments);

        _this.submitButton.data('val', _this.submitButton.val()).val('...').attr('disabled', true);
    },

    unlock : function () {
        var _this = this;

        _this.submitButton.val(_this.submitButton.data('val')).removeAttr('disabled');

        game.applications.SuperPlugin.prototype.unlock.apply(_this, arguments);
    },

    submitForm : function () {
        var _this = this;

        if (_this.isLocked(true)) {
            return;
        }

        if (game.utils.typeCompare(_this.options.beforeValidate, game.utils.types.FUNCTION)) {
            _this.options.beforeValidate.call();
        }

        _this.clearForm();

        _this.validateForm();

        _this.handleErrors();

        if (game.utils.typeCompare(_this.options.afterValidate, game.utils.types.FUNCTION)) {
            _this.options.afterValidate.call();
        }

        _this.unlock();

        return (_this.errors.length === 0);
    },

    validateForm : function () {
        var _this = this,
            rules, i, j;

        for (i = 0; i < _this.options.validationRules.length; i++) {
            rules = _this.options.validationRules[i].rule.split(' ');

            for (j = 0; j < rules.length; j++) {
                _this.rules[rules[j]].apply(_this, [_this.$el.find('[name="' + _this.options.validationRules[i].name + '"]'), _this.options.validationRules[i].error, _this.options.validationRules[i].options]);
            }
        }
    },

    clearForm : function () {
        var _this = this;

        _this.errors = [];
        _this.$el.find('.errorMessage').remove();
    },

    handleErrors : function () {
        var _this = this,
            i;

        _this.handleFormErrors();

        for (i = 0; i < _this.errors.length; i++) {
            _this.errors[i].field.after('<span class="errorMessage">' + _this.errors[i].error + '</span>');
        }
    },

    handleFormErrors : function () {
        var _this = this,
            formMessageList, i;

        if ((_this.errors.length > 0) && (_this.options.addFormMessage)) {
            _this.$el.prepend('<ul class="errorMessage"></ul>');

            formMessageList = _this.$el.find('ul.errorMessage');

            for (i = 0; i < _this.errors.length; i++) {
                formMessageList.append('<li>' + _this.errors[i].error + '</li>');
            }
        }
    },

    addError : function (field, error) {
        this.errors.push({
            field : field,
            error : error
        });
    },

    rules : {
        notEmpty : function (field, error, options) {
            if (game.utils.isEmpty(field.val())) {
                this.addError(field, error || 'Form field \'' + field.attr('name') + '\' is empty');
            }
        },
        maxLength : function (field, error, options) {
            if ((game.utils.isNotEmpty(field.val())) && (field.val().length > options.maxLength)) {
                this.addError(field, error || 'Form field \'' + field.attr('name') + '\' is longer than the allowed length of ' + options.maxLength);
            }
        }
    }
});

$.fn.validateForm = function (options) {
    var _this = this;

    _this.data('validateForm', new game.plugins.Form(_this, options));
};