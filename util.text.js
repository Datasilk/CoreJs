S.util.text = {
    html: {
        decode: function (str) {
            var parser = new DOMParser;
            var dom = parser.parseFromString('<!doctype html><body>' + str, 'text/html');
            return dom.body.textContent;
        }
    }
};