export class HeaderDescriptionHtmlBox {
    constructor(target, position, main, sub, location) {
        let name = "HeaderDescriptionHtmlBox"
        let url = "/PageComponents/" + name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        let mainHtml = "";
        for (var i = 0; i < main.length; i++)
            mainHtml += "\
            <div>\
                <span>" + main[i] + "</span>\
            </div>"

        if (mainHtml.length > 0)
            mainHtml = "<div>" + mainHtml + "</div>";

        let subHtml = ""
        for (var i = 0; i < sub.length; i++)
            subHtml += "\
            <div>\
                <span>" + sub[i] + "</span>\
            </div>"

        let locationHtml = ""
        if (location != null && location.length > 0)
            locationHtml = "<div><a>Russia</a></div>"

        if (subHtml.length > 0)
            subHtml = "<div>" + subHtml + "</div>";

        let html = "<div id=\"" + name + "\">" + mainHtml + subHtml + locationHtml + "</div>"
        target.insertAdjacentHTML(position, html)
    }
}