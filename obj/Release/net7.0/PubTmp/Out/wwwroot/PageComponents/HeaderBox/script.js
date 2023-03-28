const HeaderBoxName = "HeaderBox"
const HeaderBoxUrl = "/PageComponents/" + HeaderBoxName;

let HeaderBoxCss = document.createElement("link"); HeaderBoxCss.setAttribute("rel", "stylesheet"); HeaderBoxCss.setAttribute("href", "/PageComponents/" + HeaderBoxName + "/style.css"); document.head.append(HeaderBoxCss);
let AudiowideStylesheet = document.createElement("link"); AudiowideStylesheet.setAttribute("rel", "stylesheet"); AudiowideStylesheet.setAttribute("href", "https://fonts.googleapis.com/css2?family=Audiowide&display=swap"); document.head.append(AudiowideStylesheet);

window.HeaderBox = class HeaderBox {
    constructor(target, position, title, description, prevPageUrl, menuList) {
        //this.description = description;
        //this.prevPageUrl = prevPageUrl;
        //this.menuList = menuList;

        //this.boxId = "headerQPCP"
        //this.baseUrlFirsPart = "/PageComponents/HtmlBase/content";
        let logoUrl = HeaderBoxUrl + "/content/triangle.png"

        let descriptionFlag = false;
        if (description != null && description.length > 0)
            descriptionFlag = true;
        let menuHtml = "";
        if (menuList != null && menuList.length > 0) {

            menuHtml += "<ul class=\"icon-menu\">";
            for (var i = 0; i < menuList.length; i++) {
                let hr = "";
                let id = "";
                if (menuList[i].href != "")
                    hr = "href=\"" + menuList[i].href + "\""; //+ "\";
                if (menuList[i].id != null && menuList[i].id != "")
                    id = "id=\"" + menuList[i].id + "\"";

                menuHtml +=
                    "<li>\
                        <a " + hr + " " + id + ">\
                            <img src=\"" + menuList[i].icon + "\" />\
                        </a>\
                    </li>";
            }
            menuHtml += "</ul>"
        }

        let ppu = "";
        if (prevPageUrl.length > 0)
            ppu = "href=\"" + prevPageUrl + "\"";

        let html =
            "<header id=\"" + HeaderBoxName + "\" data-description_flag=\"" + descriptionFlag + "\">\
                <div>\
                    <a " + ppu + ">\
                        <img src=\"" + logoUrl + "\" />\
                    </a>\
                    <div>\
                        <a href=\"" + document.URL + "\">" + title + "</a>\
                    </div>"
        html += menuHtml
        html += "</div>";
        if (descriptionFlag) {
            html +=
                "<div>\
                    <div>\
                    </div>\
                    <p>" + description + "</p>\
                    <div>\
                    </div>\
                </div>"
        }

        html += "</header>";

        target.insertAdjacentHTML(position, html)
    }
}