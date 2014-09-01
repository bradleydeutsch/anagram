(function (utils) {
    utils.types = {
        ARRAY : '[object Array]',
        FUNCTION : '[object Function]',
        OBJECT : '[object Object]',
        STRING : '[object String]'
    };

    utils.privateDataStorage = (function () {
        var dataMap = [];

        return function (instance) {
            var dataObject, i;

            for (i = 0; i < dataMap.length; i++) {
                if (dataMap[i].instance === instance) {
                    return dataMap[i].data;
                }
            }

            dataObject = {
                instance : instance,
                data : {}
            };

            dataMap.push(dataObject);

            return dataObject.data;
        };
    })();

    utils.isEmpty = function (val, type) {
        return (((val === null) || (typeof(val) === 'undefined') || (val.length === 0)) && ((type === undefined) || (typeof(val) === type)));
    };

    utils.isNotEmpty = function (val, type) {
        return !utils.isEmpty(val, type);
    };

    utils.typeCompare = function (val, type) {
        try {
            return (Object.prototype.toString.call(val) === type);
        } catch (e) {
            return false;
        }
    };

    utils.bindPlugins = function (el) {
        var el = el || $('body');

        el.find('[data-plugins]').each(function () {
            var plugins = $(this).data('plugins').split(' '),
                plugin, i;

            for (i = 0; i < plugins.length; i++) {
                plugin = plugins[i];

                if (typeof($.fn[plugin]) === 'function') {
                    $(this)[plugin]();
                }
            }
        });
    };

    utils.addPageLoader = function () {
        if ($('body').find('#pageLoader').length === 0) {
            $('body').append(_.template($('#page-loader-template').html()));
        }
    };

    utils.removePageLoader = function () {
        $('body #pageLoader').remove();
    };
}(game.utils));