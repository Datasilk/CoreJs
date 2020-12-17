﻿S.util = {
    js: {
        load: function (file, id, callback, error) {
            //add javascript file to DOM
            if (document.getElementById(id)) { if (callback) { callback(); } return false; }
            var body = document.body;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = file;
            script.id = id;
            script.onload = callback;
            script.onerror = error;
            body.appendChild(script);
        }
    },
    css: {
        load: function (file, id) {
            //download CSS file and load onto the page
            if (document.getElementById(id)) { return false; }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = file;
            link.id = id;
            head.appendChild(link);
        },

        add: function (id, css) {
            //add raw CSS to the page inside a style tag
            S('#' + id).remove();
            S('head').append('<style id="' + id + '" type="text/css">' + css + "</style>");
        },
    },
    str: {
        isNumeric: function (str) {
            return !isNaN(parseFloat(str)) && isFinite(str);
        },
        Capitalize: function (str) {
            var list = str.split(' ');
            for (var x = 0; x < list.length; x++) {
                list[x] = list[x].charAt(0).toUpperCase() + list[x].slice(1);
            }
            return list.join(' ');
        }
    },

    element: {
        getClassId: function (elem, prefix) {
            if (elem.length > 0) { elem = elem[0]; }
            if (elem.className.length <= 0) { return null; }
            if (prefix == null) { prefix = 'id-'; }
            var id = elem.className.split(' ').filter(function (c) { return c.indexOf(prefix) == 0; });
            if (id.length > 0) {
                return parseInt(id[0].replace(prefix, ''));
            }
            return null;
        }
    },

    location: {
        queryString: function (key, url) {
            if (!url) url = window.location.href;
            key = key.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }
};

S.math = {
    intersect: function (a, b) {
        //checks to see if rect (a) intersects with rect (b)
        if (b.left < a.right && a.left < b.right && b.top < a.bottom) {
            return a.top < b.bottom;
        } else {
            return false;
        }
    },
    clamp: function (num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
};

S.array = {
    indexOfProperty(array, propertyName, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][propertyName]) {
                if (array[i][propertyName] === value) {
                    return i;
                }
            }
        }
        return -1;
    }
};

S.iframe = function (selector) {
    var iframe = S(selector)[0];
    var doc = null;
    if (iframe.contentDocument) { doc = iframe.contentDocument; }
    else if (iframe.contentWindow) { doc = iframe.contentWindow; }
    return {
        document: doc,
        window: iframe.contentWindow
    };
};


