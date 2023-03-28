export class HeaderUnderQHtmlBox {
    constructor(target, position, title) {
        let name = "HeaderUnderQHtmlBox"
        let url = "/PageComponents/" + name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        //--------------------

        let titleSpans = ""
        for (var i = 0; i < title.length; i++) {
            let cl = "";
            if (title[i] == ' ')
                cl = "class=\"bs\""
            titleSpans += "<span " + cl + ">" + title[i] + "</span>";
        }

        let html = "\
            <div id=\"" + name + "\">\
                <p>" + titleSpans + "</p>\
            </div>"
        target.insertAdjacentHTML(position, html)
    }
}