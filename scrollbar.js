S.scrollbar = {
    config: { skip: 15 },
    selected: { scrollable: null, height: null, itemsH: null },

    add: function (container) {
        //add custom scrollbar to container
        let c = $(container);
        c.addClass('scrollable');

        if (c.find('.scroller').length == 0) {
            //generate scrollbar
            c.prepend('<div class="scroller"><div class="scrollbar"></div></div>');
        }

        //add events
        $(window).on('resize', () => S.scrollbar.resize(container));
        c.find('.scrollbar').on('mousedown', S.scrollbar.start);
        c.find('.scroller').on('mousedown', S.scrollbar.bar);
        c.on('wheel', S.scrollbar.wheel);

        S.scrollbar.resize(container);
    },

    target: function (e) {
        let targets = $(e).parents('.scrollable');
        if (targets.length > 0) {
            return targets[0];
        }
    },

    get: function (target) {
        const win = S.window.pos();
        const container = $(target);
        const scrollbar = container.find('.scrollbar');
        const movable = container.find('.movable');
        const items = $('.movable > *');
        const scroller = container.find('.scroller');
        const pos = container.position();
        const height = win.h - pos.top;
        container.css({ height: height });

        //show/hide list scrollbar
        let h = 0;
        for (let x = 0; x < items.length; x++) {
            h += $(items[x]).height();
        }

        S.scrollbar.selected = {
            scrollbar: scrollbar,
            height: height,
            barHeight: ((height) / h) * height,
            container: container,
            movable: movable,
            entriesH: h,
            offsetY: scroller.offset().top,
            barY: scrollbar.offset().top
        };
    },

    start: function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();

        //get target container
        let target = S.scrollbar.target(e.target);

        //update class for container
        const container = $(target);
        container.addClass('scrolling');

        //update selected properties
        S.scrollbar.get(target);
        S.scrollbar.selected.cursorY = e.clientY;
        S.scrollbar.selected.currentY = e.clientY;

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
            S.scrollbar.animate.call(S.scrollbar);
        });
    },

    stop: function () {
        $('body').off('mousemove', S.scrollbar.moving);
        $('body').off('mouseup', S.scrollbar.stop);
        S.scrollbar.selected.container.removeClass('scrolling');
    },

    to: function (percent) {
        const scroll = S.scrollbar.selected;
        let perc = S.math.clamp(percent, 0, 100);
        scroll.scrollbar.css({ top: ((scroll.height - scroll.barHeight) / 100) * perc });
        scroll.movable.css({ top: -1 * (((scroll.entriesH - scroll.height) / 100) * perc) });
    },

    move: function (px) {
        const scroll = S.scrollbar.selected;
        const movable = scroll.movable;
        let pos = movable.position();
        let perc = (100 / (scroll.entriesH - scroll.height)) * -(pos.top + px);
        S.scrollbar.to(perc);
    },

    bar: function (e) {
        S.scrollbar.get(S.scrollbar.target(e.target));
        const scroll = S.scrollbar.selected;
        const scrollbar = scroll.scrollbar;
        const pos = scrollbar.offset();
        const y = e.clientY;
        if (y < pos.top) {
            //above scrollbar
            S.scrollbar.move(S.scrollbar.config.skip * 8);
        } else {
            //below scrollbar
            S.scrollbar.move(-S.scrollbar.config.skip * 8);
        }
    },

    wheel: function (e) {
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
        S.scrollbar.get(S.scrollbar.target(e.target));
        S.scrollbar.move(delta * S.scrollbar.config.skip);
    },

    resize: function (container) {
        //resize list height
        const win = S.window.pos();
        const pos = container.position();
        const height = win.h - pos.top;

        //show/hide list scrollbar 
        const list = container.find('.movable > *');
        let h = 0;
        for (let x = 0; x < list.length; x++) {
            h += $(list[x]).height();
        }
        if (h > win.h - pos.top) {
            //show scrollbar
            if (!container.hasClass('scroll')) {
                container.addClass('scroll');
            }
            //update scrollbar height
            container.find('.scroller').css({ height: height - 7 });
            container.find('.scrollbar').css({ height: ((height - 7) / h) * (height) });
        } else {
            //hide scrollbar
            if (container.hasClass('scroll')) {
                container.removeClass('scroll');
            }
        }
    },
};