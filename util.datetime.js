S.util.date = {
    format: function (dateobj) {
        const ops = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Intl.DateTimeFormat([], ops).format(dateobj);
    }
}