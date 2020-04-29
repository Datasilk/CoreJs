/*
example: var view = new S.view('<div>{{hello}}</div>', {hello:'world'});
         view.render();
*/
S.viewTags = { startChar: '{{', endChar: '}}' }; //overridable property

S.view = function (html, vars, tagStartChar, tagEndChar) {
    //tagStartChar & tagEndChar is optional, defines the symbols (#)
    //to use when searching for view variable placeholders
    this.html = html;
    this.vars = vars;
    if (tagStartChar) {
        this.tagStartChar = tagStartChar;
    } else { this.tagStartChar = S.viewTags.startChar; }
    if (tagEndChar) {
        this.tagEndChar = tagEndChar;
    } else { this.tagEndChar = S.viewTags.endChar; }
}

S.view.prototype.render = function () {
    var a = 0, b = 0, c = 0, d = 0;
    var tagslen = this.tagStartChar.length + this.tagEndChar.length;
    var endlen = this.tagEndChar.length;
    var htm = this.html;
    var ischanged = true;
    for (var key in this.vars) {
        ischanged = true;
        while (ischanged) {
            ischanged = false;
            //check for view closing first
            a = htm.indexOf(this.tagStartChar + '/' + key + this.tagEndChar);
            if (a >= 0) {
                //found a group of html to show or hide based on view element boolean value
                b = a + tagslen + key.length + 1;
                c = htm.indexOf(this.tagStartChar + key);
                d = htm.indexOf(this.tagEndChar, c + 1);
                if (c >= 0 && d > c) {
                    if (this.vars[key] === false) {
                        //hide group of html
                        htm = htm.substr(0, c) + htm.substr(b);
                        ischanged = true;
                    } else if (this.vars[key] === true) {
                        //show group of html
                        htm = htm.substr(0, c) + htm.substr(d + endlen, a - (d + endlen)) + htm.substr(b);
                        ischanged = true;
                    }
                    continue;
                }
            }
            //check for view element to replace with a value
            if (ischanged == false) {
                if (htm.indexOf(this.tagStartChar + key + this.tagEndChar) >= 0) {
                    htm = htm.replace(this.tagStartChar + key + this.tagEndChar, this.vars[key]);
                    ischanged = true;
                }
            }
        }
    }
    return htm;
}