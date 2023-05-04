export class MoreButtonHtmlBox {
    Name

    constructor(target, position, MinifyExpansion) {
        this.Name = "MoreButtonHtmlBox"
        let url = "/PageComponents/" + this.Name;
        //this.#urlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);
        target.insertAdjacentHTML(position, this.#HtmlPart())
    }

    #HtmlPart() {
        let html = "\
        <div id=\"" + this.Name + "\">\
            <div>\
                <a>\
                    <img alt=\"more\" src=\"/PageComponents/ArticlesHtmlBox/content/arrow-down-black.png\" />\
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