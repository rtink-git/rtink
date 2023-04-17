export class MoreButtonHtmlBox {
    #name

    constructor(target, position) {
        this.#name = "MoreButtonHtmlBox"
        let url = "/PageComponents/" + this.#name;
        //this.#urlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);
        target.insertAdjacentHTML(position, this.#HtmlPart())
    }

    #HtmlPart() {
        let html = "\
        <div id=\"" + this.#name + "\">\
            <div>\
                <a>\
                    <img src=\"/PageComponents/ArticlesHtmlBox/content/arrow-down-black.png\" />\
                </a>\
                <a>\
                    <span>\
                        Показать больше\
                    </span>\
                </a>\
            </div>\
        </div>"

        return html;
    }
}