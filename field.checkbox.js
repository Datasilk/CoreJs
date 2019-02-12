S.field.checkbox = {
    toggle: function (event, target) {
        $(target).toggleClass('checked');
        event.cancelBubble = true;
    }
};