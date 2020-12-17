S.field.checkbox = {
    toggle: function (event, target) {
        S(target).toggleClass('checked');
        event.cancelBubble = true;
    }
};