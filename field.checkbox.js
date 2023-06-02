S.field.checkbox = {
    toggle: function (e, target) {
        $(target).toggleClass('checked');
        e.stopPropagation();
    }
};