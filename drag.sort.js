if (!S.drag) { S.drag = {};}
S.drag.sort = {
    add: function (containers, items, callback) {
        //container = selector for container
        //items = selector for items
        const parents = $(containers)
        const elems = $(items);
        for(let x = 0; x < elems.length; x++) {
            const elem = $(elems[x]);
            elem.on('dragstart', () => {
                elem.addClass('dragging');
            });
            elem.on('dragend', () => {
                elem.removeClass('dragging');
                if (callback) { callback(); }
            });
        }
        for (var x = 0; x < parents.length; x++) {
            let parent = parents[x];
            $(parent).on('dragover', (e) => {
                e.preventDefault();
                const afterElement = S.drag.sort.after(elems, e.clientY);
                const draggable = parents.find('.dragging')[0];
                if (afterElement == null) {
                    parent.appendChild(draggable);
                } else {
                    parent.insertBefore(draggable, afterElement);
                }
            });
        }
    },
    after: function(items, y) {
        const elems = items.filter((i, a) => a.className.indexOf('dragging') < 0);
        return elems.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (closest != null && offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
};