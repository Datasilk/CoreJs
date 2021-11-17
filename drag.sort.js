if (!S.drag) { S.drag = {};}
S.drag.sort = {
    add: function (containers, items, callback) {
        //container = selector for container
        //items = selector for items
        const parents = $(containers)
        const elems = $(items);
        for(let x = 0; x < elems.length; x++) {
            const elem = $(elems[x]);
            elem.off('dragstart').on('dragstart', () => {
                elem.addClass('dragging');
            });
            elem.off('dragend').on('dragend', (e) => {
                elem.removeClass('dragging');
                if (callback) { callback(e); }
            });
        }
        for (var x = 0; x < parents.length; x++) {
            let parent = parents[x];
            $(parent).off('dragover').on('dragover', (e) => {
                e.preventDefault();
                const afterElement = S.drag.sort.after(elems, parent, e.clientY);
                const draggable = parents.find('.dragging')[0];
                if (!draggable) { return;}
                if (afterElement == null) {
                    parent.appendChild(draggable);
                } else {
                    const box = afterElement.getBoundingClientRect();
                    try {
                        if (box.top + (box.height / 2) > e.clientY) {
                            parent.insertBefore(draggable, afterElement);
                        } else {
                            parent.insertAfter(draggable, afterElement);
                        }
                    } catch (ex) {}
                }
            });
        }
    },
    after: function (items, parent, y) {
        const elems = items.filter((i, a) => a.className.indexOf('dragging') < 0);
        return elems.reduce((closest, child) => {
            if ($(child).parents(parent).length <= 0) { return closest; }
            if (!child) { return closest; }
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset == -Infinity || offset == Infinity) {
                offset = 0;
            }
            if (closest != null && offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
};