(function (eventHandler) {
    var subscribers = {},
        ROOT = 'root';

    eventHandler.events = {
        GAME_INITIALISED : 'GameInitialised'
    };

    eventHandler.subscribe = function (el, events, fns, context) {
        var el = el || ROOT,
            events = (game.utils.typeCompare(events, game.utils.types.ARRAY)) ? events : [events],
            fns = (game.utils.typeCompare(fns, game.utils.types.ARRAY)) ? fns: [fns],
            context = context || this,
            event, uniqueFn, i, j, k;

        for (i = 0; i < events.length; i++) {
            event = events[i];

            if (!subscribers.hasOwnProperty(el)) {
                subscribers[el] = {};
            }
            if (!subscribers.hasOwnProperty(event)) {
                subscribers[el][event] = [];
            }
            for (j = 0; j < fns.length; j++) {
                uniqueFn = true;

                for (k = 0; k < subscribers[el][event].length; k++) {
                    if (subscribers[el][event][k].fn.toString() === fns[j].toString()) {
                        uniqueFn = false;
                    }
                }
                if (uniqueFn) {
                    subscribers[el][event].push({
                        fn : fns[j],
                        context : context
                    });
                }
            }
        }
    };

    eventHandler.unsubscribe = function (el, events) {
        var el = el || ROOT,
            events = (game.utils.typeCompare(events, game.utils.types.ARRAY)) ? events : [events],
            event, i;

        for (i = 0; i < events.length; i++) {
            event = events[i];

            if ((subscribers.hasOwnProperty(el)) && (subscribers[el].hasOwnProperty(event))) {
                delete subscribers[el][event];
            }
        }
    };

    eventHandler.publish = function (el, events, data) {
        var el = el || ROOT,
            events = (game.utils.typeCompare(events, game.utils.types.ARRAY)) ? events : [events],
            event, fns, i, j;

        for (i = 0; i < events.length; i++) {
            event = events[i];

            if ((subscribers.hasOwnProperty(el)) && (subscribers[el].hasOwnProperty(event))) {
                fns = subscribers[el][events];

                for (j = 0; j < fns.length; j++) {
                    fns[j].fn.call(fns[j].context, event, data);
                }
            }
        }
    };

    eventHandler.getSubscribers = function () {
        return subscribers;
    };
}(game.eventHandler));