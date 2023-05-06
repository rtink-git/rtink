﻿export class HeaderDescriptionHtmlBox {
    constructor() {
        let url = "/PageComponents/" + this.constructor.name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);
    }

    InsertAdjacentHTML(target, position, title) {
        let html = "<div id=\"" + this.constructor.name + "\"><p>" + title + "</p></div>"
        target.insertAdjacentHTML(position, html)
    }
}