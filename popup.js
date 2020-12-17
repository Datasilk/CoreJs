S.popup = {
    elem: null, options: null,

    show: function (title, html, options) {
        if (options == null) { options = {}; }
        var opts = {
            width: options.width != null ? options.width : 300,
            maxWidth: options.maxWidth != null ? options.maxWidth : null,
            padding: options.padding != null ? options.padding : 0,
            offsetHeight: options.offsetHeight != null ? options.offsetHeight : 0,
            offsetTop: options.offsetTop != null ? options.offsetTop : 0,
            position: options.position != null ? options.position : 'center',
            close: options.close != null ? options.close : true,
            className: options.className != null ? options.className : ''
        };
        this.options = opts;

        var win = S.window.pos();
        var div = document.createElement('div');
        var forpopup = S('body > .for-popup');
        var popup = S(div);
        div.className = 'popup box ' + opts.className;

        popup.css({ width: opts.width });
        if (opts.maxWidth != null) { popup.css({ maxWidth: opts.maxWidth }); }
        popup.addClass(opts.position);
        if (opts.offsetHeight > 0) {
            popup.css({ Marginbottom: opts.offsetHeight });
        }
        if (opts.offsetTop.toString().indexOf('%') > 0) {
            popup.css({ top: opts.offsetTop });
        } else if (Number(opts.offsetTop) == opts.offsetTop) {
            if (opts.offsetTop > 0) {
                popup.css({ top: win.scrolly + ((win.h - 300) / 3) + opts.offsetTop });
            }
        }
        if (opts.padding > 0) {
            forpopup.css({ padding: opts.padding });
        }

        var view = new S.view(S('#template_popup').html(), {
            title: title,
            body: html
        }, "#", "#");
        popup.html(view.render());
        this.elem = popup;

        S('body > .for-popup .popup').remove();
        forpopup.removeClass('hide').append(div);

        //set up events
        S(window).on('resize', S.popup.resize);
        S(window).on('scroll', S.popup.resize);

        if (opts.close == true) {
            S('.popup .btn-close a').on('click', function () {
                S.popup.hide();
            });
        }

        S.popup.resize();
    },

    hide: function () {
        //remove events
        S('body > .for-popup').addClass('hide');
        S(window).off('resize', S.popup.resize);
        S(window).off('scroll', S.popup.resize);
    },

    bg: function (e) {
        if (e.target == S('.bg.for-popup')[0]) { S.popup.hide(); }
    },

    resize: function () {
        var win = S.window.pos();
        var pos = S.popup.elem.position();
        pos.height = S.popup.elem.height();
        S.popup.elem.css({ maxHeight: win.height - (S.popup.options.padding * 2), top: S.popup.options.offsetTop.toString().indexOf('%') > 0 ? S.popup.options.offsetTop : win.scrolly + ((win.h - pos.height) / 3) + S.popup.options.offsetTop });
    }
}