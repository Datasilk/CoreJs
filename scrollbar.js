S.scrollbar = {
    config: { skip: 15 },
    selected: { },
    items: [],

    add: function (container, options) {
        //options = {
        //  footer (int || function): space between bottom of container & window edge,
        //  touch (bool) //allows touch scrolling
        //  touchStart: callback function(TouchEvent, options)
        //  touchEnd: callback function(TouchEvent, options)
        //  moved: callback function(options)
        //}
        //add custom scrollbar to container
        var mutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var resizeObserver = window.ResizeObserver || window.WebKitResizeObserver;
        let opts = options != null ? options : {};
        let c = $(container);
        c.addClass('scrollable');

        if (c.find('.scroller').length == 0) {
            //generate scrollbar
            c.prepend('<div class="scroller"><div class="scrollbar"></div></div>');
        }

        //add events
        c.find('.scrollbar').on('mousedown', (e) => S.scrollbar.start(e, opts));
        c.find('.scroller').on('mousedown', (e) => S.scrollbar.bar.start(e, opts));
        c.on('wheel', (e) => S.scrollbar.wheel(e, opts));

        if (opts.touch === true) {
            c.on('touchstart', (e) => S.scrollbar.touchstart(e, { ...opts, istouch: true }));
            c.on('touchmove', (e) => S.scrollbar.touchmove(e, { ...opts, istouch: true }));
            c.on('touchend', (e) => S.scrollbar.touchend(e, { ...opts, istouch: true }));
        } 

        
        for (let x = 0; x < c.length; x++) {
            let cn = $(c[x]);
            //add scrollbar to items list
            S.scrollbar.items.push({ container: $(cn), options: opts, percent: 0 });

            //resize each container
            S.scrollbar.resize($(cn), opts);

            //add event listener for DOM changes within the container
            let movable = $(cn).find('.movable');
            let callback_resize = () => S.scrollbar.resize($(cn), opts);
            let mutated = false;
            if (mutationObserver) {
                // define a new observer
                var obs = new mutationObserver(function (mutations, observer) {
                    if (mutated == true) { return;}
                    if (mutations.length == 1) {
                        if ($(mutations[0].target).parent().hasClass('scrollable')) { return; }
                    }
                    mutated = true;
                    callback_resize();
                    setTimeout(() => { mutated = false; }, 10);
                })
                // have the observer observe changes in children
                obs.observe(movable[0], { attributes: true, childList: true, subtree: true });
            }

            else if (window.addEventListener) {
                movable[0].addEventListener('DOMNodeInserted', callback_resize, false);
                movable[0].addEventListener('DOMNodeRemoved', callback_resize, false);
            }

            //add event listener for container element node resize
            if (resizeObserver) {
                var obs = new resizeObserver(function (elements) {
                    callback_resize();
                })
                // have the observer observe foo for changes in children
                obs.observe(cn[0]);
            }
        }
    },

    target: function (e) {
        var target = $(e);
        if (target.hasClass('.scrollable')) { return target; }
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
        const scroller = container.find('.scroller');
        const pos = container[0].getBoundingClientRect();
        let foot = 0;

        //get scrollbar item from cache
        let index = S.scrollbar.items.map(a => a.container).findIndex(a => a.filter((i, b) => container[0] == b).length > 0);
        let item = S.scrollbar.items[index];

        if (item.options.footer != null) {
            if (typeof item.options.footer == 'function') {
                foot = item.options.footer(container);
            } else {
                foot = item.options.footer;
            }
        } else {
            foot = win.h - pos.top - pos.height;
        }
        const height = win.h - pos.top - foot;

        //show/hide list scrollbar
        let h = movable.height();
        let barHeight = ((height - 7) / h) * height;
        return {
            scrollbar: scrollbar,
            height: height,
            foot: foot,
            barHeight: barHeight,
            container: container,
            movable: movable,
            contentH: h,
            offsetY: scroller.offset().top,
            barY: scrollbar.offset().top,
            options: item.options,
            index: index,
            diff: (1 / height) * ((height / h) * (height - 7))
        };

    },

    start: function (e, options) {
        if (!options.istouch === true) {
            e.cancelBubble = true;
            e.stopPropagation();
            e.preventDefault();
        }

        //get target container
        let target = S.scrollbar.target(e.target);

        //update class for container
        const container = $(target);
        S.scrollbar.selected.container = null;
        if (!container.hasClass('scroll')) { return;}
        container.addClass('scrolling');

        //update selected properties
        S.scrollbar.selected = S.scrollbar.get(target);
        S.scrollbar.selected.cursorY = e.clientY;
        S.scrollbar.selected.currentY = e.clientY;
        S.scrollbar.selected.scrolling = true;

        if (!options.istouch === true) {
            //bind events
            $(window).on('mousemove', S.scrollbar.moving);
            $(window).on('mouseup', S.scrollbar.stop);
        }

        //animate scrollbar
        S.scrollbar.animate.call(S.scrollbar);
    },

    touchstart: function (e, options) {
        S.scrollbar.start(e.touches[0], options);
        if (S.scrollbar.selected.container == null) { return; }
        if (typeof options.touchStart == 'function') {
            options.touchStart(e, options);
        }
    },

    touchmove: function (e, options) {
        var touch = e.touches[0];
        var sel = S.scrollbar.selected;
        S.scrollbar.selected.currentY = sel.cursorY + ((sel.cursorY - touch.clientY) * sel.diff);
    },

    touchend: function (e, options) {
        if (S.scrollbar.selected.container == null) { return;}
        S.scrollbar.selected.scrolling = false;
        S.scrollbar.selected.container.removeClass('scrolling');
        if (typeof options.touchEnd == 'function') {
            options.touchEnd(e, options);
        }
    },

    moving: function (e) {
        //called when user moves mouse
        S.scrollbar.selected.currentY = e.clientY;
    },

    animate: function () {
        //steady animation of scrolling movement
        const item = S.scrollbar.selected;
        const curr = item.currentY - item.cursorY - (item.offsetY - item.barY);
        let perc = S.math.clamp((100 / (item.height - 7 - item.barHeight)) * curr, 0, 100);
        S.scrollbar.to(item, perc);
        requestAnimationFrame(() => {
            if (S.scrollbar.selected.scrolling == true) {
                S.scrollbar.animate.call(S.scrollbar);
            }
        });
    },

    stop: function () {
        S.scrollbar.selected.scrolling = false;
        $(window).off('mousemove', S.scrollbar.moving);
        $(window).off('mouseup', S.scrollbar.stop);
        S.scrollbar.selected.container.removeClass('scrolling');
    },

    to: function (item, percent) {
        percent = parseInt(percent);
        let perc = S.math.clamp(percent, 0, 100);
        var top = -1 * Math.round((((item.contentH - item.height) / 100) * perc));
        if (top > 0) { top = 0;}
        S.scrollbar.items[item.index].percent = percent;
        item.scrollbar.css({ top: Math.round(((item.height - 7 - item.barHeight) / 100) * perc) });
        item.movable.css({ top: top });
        if (item.options.moved) { item.options.moved(item);}
    },

    move: function (px) {
        const item = S.scrollbar.selected;
        const movable = item.movable;
        let pos = movable.position();
        let perc = (100 / (item.contentH - item.height - 7)) * (-pos.top + px);
        S.scrollbar.to(item, perc);
    },

    bar: {
        timer: null,
        start: function(e, options) {
            if ($(e.target).hasClass('scrollbar')) { return false; }
            S.scrollbar.selected = S.scrollbar.get(S.scrollbar.target(e.target));
            const item = S.scrollbar.selected;
            const scrollbar = item.scrollbar;
            const pos = scrollbar.offset();
            const y = e.clientY;
            let top = false;
            if (y < pos.top) { top = true; }
            S.scrollbar.bar.move(top);

            //listen for mouse up
            $(window).on('mouseup', S.scrollbar.bar.end);

            //move bar in intervals if mouse is held down long enough
            setTimeout(() => {
                S.scrollbar.bar.timer = setInterval(() => S.scrollbar.bar.move(top), 50);
            }, 300);
        },

        move: function (top) {
            if (top === true) {
                //above scrollbar
                S.scrollbar.move(-S.scrollbar.config.skip * 8);
            } else {
                //below scrollbar
                S.scrollbar.move(S.scrollbar.config.skip * 8);
            }
        },

        end: function () {
            clearInterval(S.scrollbar.bar.timer);
            $(window).off('mouseup', S.scrollbar.bar.end);
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
        const target = S.scrollbar.target(e.target);
        if ($(target).hasClass('scroll')) {
            S.scrollbar.selected = S.scrollbar.get(target);
            S.scrollbar.move(-delta * S.scrollbar.config.skip);
        }
    },

    resize: function (container, options) {
        //resize list height
        for (let x = 0; x < container.length; x++) {
            const c = $(container[x]);
            const movable = c.find('.movable');
            let h = movable.height();
            if (h == 0) { continue; }
            const pos = c[0].getBoundingClientRect();
            const height = pos.height;
            const item = S.scrollbar.get(c, options);
            if (h > height + 1) {
                //show scrollbar
                c.addClass('scroll');
                //update scrollbar height
                c.find('.scroller').css({ height: height - 7 });
                c.find('.scrollbar').css({ height: Math.round(((height - 7) / h) * height) });
            } else {
                //hide scrollbar
                c.removeClass('scroll');
            }
            S.scrollbar.to(item, S.scrollbar.items[item.index].percent);
        };
    },

    update: function (container) {
        const c = $(container);
        let item = S.scrollbar.items.filter(a => a.container.filter((i, b) => c[0] == b).length > 0);
        if (item.length == 0) { return; }
        S.scrollbar.resize(item[0].container, item[0].options);
    }
};