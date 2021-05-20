S.popup = {
    elem: null, options: [],

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

        var win = S.window.pos();
        let div = document.createElement('div');
        var forpopup = $('body > .for-popup');
        let popup = $(div);
        div.className = 'popup box show ' + opts.className;
        this.options.push({ elem: div, options: opts });
        forpopup.removeClass('hide').append(div);

        var view = new S.view($('#template_popup').html(), {
            title: title,
            body: html
        }, "#", "#");
        popup.html(view.render());
        this.elem = popup;

        //resize & reposition popup modal
        popup.css({ width: opts.width });
        if (opts.maxWidth != null) { popup.css({ maxWidth: opts.maxWidth }); }
        popup.addClass('pos-' + opts.position);
        if (opts.offsetHeight > 0) {
            popup.css({ Marginbottom: opts.offsetHeight });
        }
        if (opts.offsetTop.toString().indexOf('%') > 0) {
            popup.css({ top: opts.offsetTop });
        } else {
            popup.css({ top: win.scrolly + ((win.h - 300) / 3) + opts.offsetTop });
        }
        if (opts.padding > 0) {
            forpopup.css({ padding: opts.padding });
        }

        //set up events
        if (forpopup.children().length == 1) {
            $(window).on('resize', S.popup.resize);
            $(window).on('scroll', S.popup.resize);
        }
        forpopup.off('mousedown', S.popup.bg).on('mousedown', S.popup.bg);

        if (opts.close == true) {
            popup.find('.btn-close a').on('click', function () {
                S.popup.hide(popup);
            });
        } else {
            popup.find('.btn-close').hide();
        }

        S.popup.resize();
        popup.hide = () => {
            //used when temporarily hiding popup to show another popup
            popup.addClass('hide').removeClass('show');
        };
        popup.show = () => {
            //used when showing this popup after hiding another popup
            popup.removeClass('hide').addClass('show');
        };
        return popup;
    },

    hide: function (popup) {
        //remove events
        var popups = $('body > .for-popup');
        if (popup && popup.target) {
            //remove parent popup
            popup = $(popup.target).parents('.popup').first();
        } else if (popup) {
            //remove single popup
            var opts = S.popup.options;
            for (var x = 0; x < opts.length; x++) {
                if (opts[x].elem == popup[0]) {
                    S.popup.options.splice(x, 1);
                    break;
                }
            }
            //remove single popup
            popup.remove();
        } else {
            //remove all popups
            var c = popups.children();
            for (var x = 0; x < c.length; x++) {
                $(c[x]).remove();
            }
            S.popup.options = [];
        }
        if (popups.children().length == 0) {
            $('body > .for-popup').addClass('hide');
        }
        $(window).off('resize', S.popup.resize);
        $(window).off('scroll', S.popup.resize);
    },

    bg: function (e) {
        if (e.target == $('.bg.for-popup')[0]) { S.popup.hide(); }
    },

    resize: function () {
        var win = S.window.pos();
        var elems = $('body > .for-popup > div');
        for (var x = 0; x < elems.length; x++) {
            var elem = $(elems[x]);
            var pos = elem.position();
            pos.height = elem.height();
            var options = S.popup.options[x].options;
            elem.css({ maxHeight: win.h - (options.padding * 2), top: options.offsetTop.toString().indexOf('%') > 0 ? options.offsetTop : win.scrolly + ((win.h - pos.height) / 3) + options.offsetTop });
        }
        
    }
}