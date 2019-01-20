S.scrollbar = {
    config: { skip: 15 },
    selected: { scrollable: null, height: null, itemsH: null, scrolling:false },

    add: function (container, options) {
        //options = {
        //  footer (int || function): space between bottom of container & window edge
        //}
        //add custom scrollbar to container
        let c = $(container);
        c.addClass('scrollable');

        if (c.find('.scroller').length == 0) {
            //generate scrollbar
            c.prepend('<div class="scroller"><div class="scrollbar"></div></div>');
        }

        //add events
        var opts = options != null ? options : {};
        $(window).on('resize', (e) => S.scrollbar.resize(c, opts));
        c.find('.scrollbar').on('mousedown', (e) => S.scrollbar.start(e, opts));
        c.find('.scroller').on('mousedown', (e) => S.scrollbar.bar(e, opts));
        c.on('wheel', (e) => S.scrollbar.wheel(e, opts));

        //resize each container
        for (let x = 0; x < c.length; x++) {
            S.scrollbar.resize($(c[x]), opts);
            //hotfix: run resize method again since scrollbar 
            //size might change after first adjustment
            S.scrollbar.resize($(c[x]), opts);
        }
    },

    target: function (e) {
        let targets = $(e).parents('.scrollable');
        if (targets.length > 0) {
            return targets[0];
        }
    },

    get: function (target, options) {
        const win = S.window.pos();
        const container = $(target);
        const scrollbar = container.find('.scrollbar');
        const movable = container.find('.movable');
        const scroller = container.find('.scroller');
        const pos = container[0].getBoundingClientRect();
        let foot = 0;

        if (options.footer != null) {
            if (typeof options.footer == 'function') {
                foot = options.footer(container);
            } else {
                foot = options.footer;
            }
        }
        const height = win.h - pos.top - foot;
        
        //show/hide list scrollbar
        let h = movable.height();

        S.scrollbar.selected = {
            scrollbar: scrollbar,
            height: height,
            foot: foot,
            barHeight: ((height - 7) / h) * height,
            container: container,
            movable: movable,
            contentH: h,
            offsetY: scroller.offset().top,
            barY: scrollbar.offset().top
        };
    },

    start: function (e, options) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();

        //get target container
        let target = S.scrollbar.target(e.target);

        //update class for container
        const container = $(target);
        container.addClass('scrolling');

        //update selected properties
        S.scrollbar.get(target, options);
        S.scrollbar.selected.cursorY = e.clientY;
        S.scrollbar.selected.currentY = e.clientY;
        S.scrollbar.selected.scrolling = true;

        //bind events
        $('body').on('mousemove', S.scrollbar.moving);
        $('body').on('mouseup', S.scrollbar.stop);

        //animate scrollbar
        S.scrollbar.animate.call(S.scrollbar);
    },

    moving: function (e) {
        //called when user moves mouse
        S.scrollbar.selected.currentY = e.clientY;
    },

    animate: function () {
        //steady animation of scrolling movement
        const scroll = S.scrollbar.selected;
        const curr = scroll.currentY - scroll.cursorY - (scroll.offsetY - scroll.barY);
        let perc = (100 / (scroll.height - scroll.barHeight)) * curr;
        S.scrollbar.to(perc);
        requestAnimationFrame(() => {
            if (S.scrollbar.selected.scrolling == true) {
                S.scrollbar.animate.call(S.scrollbar);
            }
        });
    },

    stop: function () {
        S.scrollbar.selected.scrolling = false;
        $('body').off('mousemove', S.scrollbar.moving);
        $('body').off('mouseup', S.scrollbar.stop);
        S.scrollbar.selected.container.removeClass('scrolling');
    },

    to: function (percent) {
        const scroll = S.scrollbar.selected;
        let perc = S.math.clamp(percent, 0, 100);
        scroll.scrollbar.css({ top: ((scroll.height - 7 - scroll.barHeight) / 100) * perc });
        scroll.movable.css({ top: -1 * (((scroll.contentH - scroll.height) / 100) * perc) });
    },

    move: function (px) {
        const scroll = S.scrollbar.selected;
        const movable = scroll.movable;
        let pos = movable.position();
        let perc = (100 / (scroll.contentH - scroll.height - 7)) * (-pos.top + px);
        S.scrollbar.to(perc);
    },

    bar: function (e, options) {
        if ($(e.target).hasClass('scrollbar')) { return false;}
        S.scrollbar.get(S.scrollbar.target(e.target), options);
        const scroll = S.scrollbar.selected;
        const scrollbar = scroll.scrollbar;
        const pos = scrollbar.offset();
        const y = e.clientY;
        if (y < pos.top) {
            //above scrollbar
            S.scrollbar.move(-S.scrollbar.config.skip * 8);
        } else {
            //below scrollbar
            S.scrollbar.move(S.scrollbar.config.skip * 8);
        }
    },

    wheel: function (e, options) {
        let delta = 0;
        if (!e) e = window.event;
        // normalize delta
        if (e.wheelDelta) {
            // IE and Opera
            delta = e.wheelDelta / 60;
        } else if (e.detail) {
            // W3C
            delta = -e.detail / 2;
        }
        S.scrollbar.get(S.scrollbar.target(e.target), options);
        S.scrollbar.move(-delta * S.scrollbar.config.skip);
    },

    resize: function (container, options) {
        //resize list height
        const win = S.window.pos();
        let foot = 0;
        if (options.footer != null) {
            if (typeof options.footer == 'function') {
                foot = options.footer(container);
            } else {
                foot = options.footer;
            }
        }

        const scrollbars = container.find('.scrollbar');
        for (let x = 0; x < scrollbars.length; x++) {
            const box = $(S.scrollbar.target(scrollbars[x]));
            const movable = box.find('.movable');
            const pos = box[0].getBoundingClientRect();
            const height = win.h - pos.top - foot;
            let h = movable.height();

            if (h > height) {
                //show scrollbar
                box.addClass('scroll');
                //update scrollbar height
                
                box.find('.scroller').css({ height: height - 7 });
                box.find('.scrollbar').css({ height: ((height - 7) / h) * height });
            } else {
                //hide scrollbar
                if (box.hasClass('scroll')) {
                    box.removeClass('scroll');
                }
            }
        };
    }
};