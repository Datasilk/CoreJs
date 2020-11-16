S.upload = {
    file: function (file, url, onprogress, oncomplete, onerror) {
        const xhr = new XMLHttpRequest();
        const formdata = new FormData();

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (typeof oncomplete == 'function') {
                        oncomplete(xhr);
                    }
                } else if (xhr.status == 500) {
                    hasError();
                }
            }
        };
        xhr.onerror = function (e) {
            if(e.error != null) { hasError(e); }
        };

        function hasError() {
            if (typeof onerror == 'function') {
                onerror(xhr);
            }
        }
        xhr.upload.onprogress = onprogress;
        formdata.append('file', file);
        xhr.send(formdata);
    }
}