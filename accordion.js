S.accordion = {
    load: function (options) {
        let opts = {
            container: '.accordion',
            target: '.accordion > .title',
            ontoggle: null,
            opened: false,
        };

        if (options && options.container) { opts.container = options.container; }
        if (options && options.target) { opts.target = options.target; }
        if (options && options.ontoggle) { opts.ontoggle = options.ontoggle; }
        if (options && options.opened) { opts.opened = options.opened; }

        function open(e) {
            if (typeof opts.ontoggle == 'function') {
                opts.ontoggle(e, $(e.target).hasClass('expanded'), opts);
            } else {
                S.accordion.toggle(e, opts);
            }
        }

        $(opts.target).off('click').on('click', open);

        if (opts.opened == true) {
            $(opts.target).each((i, e) => {
                open({ target: $(e)[0] });
            });
        }

    },

    toggle: function (e, options) {
        $(e.target).parents(options.container).first().toggleClass('expanded');
        $(e.target).parents(options.target).first().toggleClass('expanded');
    }
};

S.accordion.load();