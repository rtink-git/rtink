export class SearchHeaderQHtmlBox {
    _UrlContent

    Name

    constructor(minifiedCode) {
        this.Name = this.constructor.name;
        let url = "/PageComponents/" + this.Name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style" + minifiedCode + ".css"); document.head.append(css);
        this._UrlContent = url + "/content"
    }

    InsertAdjacentHTML(target, position, placeholder) {
        let html = "\
<div id=\"" + this.Name + "\">\
    <input type=\"text\" placeholder=\"" + placeholder + "\" />\
    <a>\
        <img src=\"" + this._UrlContent + "/search.png\" />\
    </a>\
</div>"
        target.insertAdjacentHTML(position, html)
    }
}