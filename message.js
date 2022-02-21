S.message = {
    defaultElement: '.popup.show .messages',
    show: function(element, type, msg) {
        //var types = 'error warning alert';
        if (!element) { element = S.message.defaultElement };
        el.append('<div class="message ' + (type ? type : '') + '">' + msg + `<div class="col right icon small">
            <svg viewBox="0 0 32 32"><use xlink:href="#icon-close" x="0" y="0" width="32" height="32"></use></svg>
            </div></div>`);
    },

    error: {
        generic:'An error has occurred. Please contact support.'
    }
}