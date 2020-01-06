S.accordion = {
    load: function (ontoggle) {
        $('.accordion > .title').off('click').on('click', (e) => {
            S.accordion.toggle(e);
            if (typeof ontoggle == 'function') { ontoggle(e); }
        });
    },

    toggle: function (e) {
        $(e.target).parents('.accordion').toggleClass('expanded');
    }
};

S.accordion.load();