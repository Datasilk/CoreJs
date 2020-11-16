S.loader = function (options) {
    var options = options ? options : {}
    var opts = {
        padding: options.padding ? options.padding : '',
        size: options.size ? options.size : ''
    };

    return '<div class="loader icon' +
        (opts.size != '' ? ' ' + opts.size : '') +
        '"' +
        (opts.padding ? ' style="padding:' + opts.padding + '"' : '') +
        '><svg viewBox="0 0 36 36">' +
        '<use xlink:href="#icon-loader" x="0" y="0" width="36" height="36"></use>' +
        '</svg></div>';
}