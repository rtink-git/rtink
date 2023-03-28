export class HeaderUnderHtmlBox {
    constructor(target, position, title) {
        let name = "HeaderUnderHtmlBox"
        let url = "/PageComponents/" + name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        let html = "\
            <div id=\"HeaderUnderHtmlBox\">\
                <p>" + title + "</p>\
            </div>"
        target.insertAdjacentHTML(position, html)
    }
}