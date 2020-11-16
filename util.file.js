S.util.file = {
    size: {
        ofBytes: function (bytes, isMacOS) {
            var thresh = isMacOS !== false ? 1000 : 1024;
            if (Math.abs(bytes) < thresh) {
                return bytes + ' B';
            }
            var units = isMacOS !== false
                ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while (Math.abs(bytes) >= thresh && u < units.length - 1);
            return bytes.toFixed(1) + ' ' + units[u];
        },

        ofString: function (str, isMacOS) {
            var m = encodeURIComponent(str).match(/%[89ABab]/g);
            return S.util.file.size.ofBytes(str.length + (m ? m.length : 0), isMacOS);
        }
    }
};