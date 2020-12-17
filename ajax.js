if (!S.ajax) {
    S.ajax = {};
}

//class used to make simple web service posts to the server
S.ajax.queue = [];

S.ajax.post = function (url, data, callback, error, json, opts) {
    var options = {
        method: "POST",
        data: JSON.stringify(data),
        url: '/api/' + url,
        contentType: "text/plain; charset=utf-8",
        dataType: 'html',
        success: function (d) {
            var txt = '';
            if (typeof d.responseText != 'undefined') { txt = d.responseText; } else { txt = d; }
            S.ajax.runQueue();
            if (typeof callback == 'function') { callback(txt); }
        },
        error: function (xhr, status, err) {
            if (typeof error == 'function') { error(xhr, status, err); }
            S.ajax.runQueue();
        }
    }
    if (opts) {
        //user-specified options
        if (opts.contentType) { options.contentType = opts.contentType; }
        if (opts.method) { options.method = opts.method; }
        if (opts.url) { options.url = opts.url; }
    }
    if (json == true) { options.dataType = 'json'; }
    S.ajax.queue.push(options);
    if (S.ajax.queue.length == 1) {
        $.ajax(options);
    }
};

S.ajax.inject = function (response) {
    var elem = $(response.selector);
    if (elem.length > 0 && response.html != '') {
        switch (response.type) {
            case 0: //replace
                elem.html(response.html);
                break;
            case 1: //append
                elem.append(response.html);
                break;
            case 2: //before
                elem.before(response.html);
                break;
            case 3: //after
                elem.after(response.html);
                break;
            case 4: //prepend
                elem.prepend(response.html);
                break;
        }
    }

    //add any CSS to the page
    if (response.css && response.css != '') {
        S.util.css.add(response.cssid, response.css);
    }

    //finally, execute callback javascript
    if (response.javascript && response.javascript != '') {
        var js = new Function(response.javascript);
        js();
    }
};

S.ajax.runQueue = function () {
    S.ajax.queue.shift();
    if (S.ajax.queue.length > 0) {
        $.ajax(S.ajax.queue[0]);
    }
};