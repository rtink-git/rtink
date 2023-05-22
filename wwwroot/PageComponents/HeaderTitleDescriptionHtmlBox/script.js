export class HeaderTitleDescriptionHtmlBox {
    Name

    constructor(minifiedCode) {
        this.Name = this.constructor.name;
        let url = "/PageComponents/" + this.Name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style" + minifiedCode + ".css"); document.head.append(css);
    }

    InsertAdjacentHTML(target, position, title, description) {
        let html = "\
<div id=\"" + this.Name + "\">\
    <div>\
        <h1>\
            <span>\
            " + title + "\
            </span>\
        </h1>\
        <p>\
            " + description + "\
        </p>\
    </div>\
</div>\
"
        target.insertAdjacentHTML(position, html)
    }
}
