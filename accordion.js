﻿S.accordion = {
    load: function (options) {
        opts = {
            container: '.accordion',
            target: '.accordion > .title',
            ontoggle: null
        };

        if (options && options.container) { opts.container == options.container; }
        if (options && options.target) { opts.target == options.target; }
        if (options && options.ontoggle) { opts.ontoggle == options.ontoggle; }
        S('.accordion > .title').off('click').on('click', (e) => {
            S.accordion.toggle(e);
            if (typeof ontoggle == 'function') { ontoggle(e, S(e.target).hasClass('expanded')); }
        });
    },

    toggle: function (e) {
        S(e.target).parents('.accordion').first().toggleClass('expanded');
    }
};

S.accordion.load();