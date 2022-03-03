S.message = {
    defaultElement: '.popup.show .messages',
    show: function(element, type, msg) {
        //var types = 'error warning alert';
        if (!element) { element = S.message.defaultElement };
        $(element).append('<div class="message ' + (type ? type : '') + '"><span>' + msg + `</span><div class="col right icon msg-close small">
            <svg viewBox="0 0 32 32"><use xlink:href="#icon-close" x="0" y="0" width="32" height="32"></use></svg>
            </div></div>`);
        $(element + ' .msg-close').on('click', (e) => {
            var target = $(e.target);
            if (!target.hasClass('message')) { target = target.parents('.message').first(); }
            target.remove();
        });
    },

    error: {
        generic:'An error has occurred. Please contact support.'
    }
}