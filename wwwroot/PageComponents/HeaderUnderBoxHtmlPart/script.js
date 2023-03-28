const HeaderUnderBoxHtmlPartName = "HeaderUnderBoxHtmlPart"
const HeaderUnderBoxHtmlPartUrl = "/PageComponents/" + HeaderUnderBoxHtmlPartName;

let HeaderUnderBoxHtmlPartCss = document.createElement("link"); HeaderUnderBoxHtmlPartCss.setAttribute("rel", "stylesheet"); HeaderUnderBoxHtmlPartCss.setAttribute("href", HeaderUnderBoxHtmlPartUrl + "/style.css"); document.head.append(HeaderUnderBoxHtmlPartCss);

window.HeaderUnderBoxHtmlPart = class HeaderUnderBoxHtmlPart {
    constructor(target, position, title) {
        let html = "\
            <div id=\"HeaderUnderBoxHtmlPart\">\
                <p>" + title + "</p>\
            </div>"
        target.insertAdjacentHTML(position, html)
    }
}