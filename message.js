S.message = {
    show: function(element, type, msg, fadein, hideDelay, fadeout) {
        var types = 'error warning alert';
        var el = $(element);
        if (type != '' && type != null) {
            el.removeClass(types).addClass(type);
        } else {
            el.removeClass(types);
        }
        el.find('span').html(msg);
        if (fadein === true) {
            el.css({ opacity: 0, overflow:'hidden' }).show();
            var h = el.height();
            el.css({ height: 0, marginTop: 10, marginBottom: 10, paddingTop:0, paddingBottom:0 });
            el.animate({ opacity: 1, height: h, marginTop: 10, marginBottom: 10, paddingTop: 7, paddingBottom: 7 },
                { duration: 333, easing: 'easeInSine' });
        } else {
            el.css({ opacity: 1, height:'auto' }).show();
        }
        if (hideDelay != null) {
            setTimeout(function () {
                if (fadeout == true) {
                    el.animate({ opacity: 0 }, {
                        duration: 333,
                        complete: function () {
                            el.hide();
                        }
                    });
                } else { el.hide(); }
            }, hideDelay);
        }
    },

    error: {
        generic:'An error has occurred. Please contact support.'
    }
}