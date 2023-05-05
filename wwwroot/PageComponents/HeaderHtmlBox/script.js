export class HeaderHtmlBox {
    _MenuList

    constructor() {
        let url = "/PageComponents/" + this.constructor.name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);
        let AudiowideStylesheet = document.createElement("link"); AudiowideStylesheet.setAttribute("rel", "stylesheet"); AudiowideStylesheet.setAttribute("href", "https://fonts.googleapis.com/css2?family=Audiowide&display=swap"); document.head.append(AudiowideStylesheet);
        this._MenuList = new Array()
    }

    PushMenuRow(e) {
        //-- example: headerHtmlBox.PushMenuRow({ "icon": this.url + "/content/test/category.png", "href": "/", "id": "_CategoryId" });
        this._MenuList.push(e)
    }

    InsertAdjacentHTML(target, position, title) {
        target.insertAdjacentHTML(position, this._HtmlPart(title))
    }

    _HtmlPart(title) {
        let html =
            "<header id=\"" + this.constructor.name + "\">\
                <a>\
                " + title + "\
                </a>\
                " + this._MenuHtmlPartBuild() + "\
            </header>";

        return html;
    }

    _MenuHtmlPartBuild() {
        let html = "";

        if (this._MenuList.length > 0) {
            html = "<ul>";

            this._MenuList.forEach(e => {
                let idAttr = "";
                if (e.id != undefined && e.id != null && e.id.length > 0)
                    idAttr = "id=\"" + e.id + "\""

                let altAttr = ""
                if (e.alt != undefined && e.alt != null && e.alt.length > 0)
                    altAttr = "alt=\"" + e.alt + "\""


                let hrefAttr = "";
                if (e.href != undefined && e.href != null && e.href.length > 0)
                    hrefAttr = "href=\"" + e.href + "\""

                html +=
                    "<li " + idAttr + ">\
                        <a " + hrefAttr + ">\
                            <img " + altAttr + " src=\"" + e.icon + "\">\
                        </a>\
                    </li>"
            })

            html += "</ul>";
        }

        return html;
    }
}