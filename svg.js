S.svg = {
    load: function (url) {
        S.ajax.post('', {}, function (d) {
            S('.svgicons').append(d);
        }, null, false, { url: url, method: 'GET', contentType: 'image/svg' });
    }
};
