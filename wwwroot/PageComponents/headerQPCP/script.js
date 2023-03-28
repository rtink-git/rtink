let headerQPCPCss = document.createElement("link");
headerQPCPCss.setAttribute("rel", "stylesheet");
headerQPCPCss.setAttribute("href", "/PageComponents/headerQPCP/style.css");
document.head.append(headerQPCPCss);

let AudiowideStylesheet = document.createElement("link");
AudiowideStylesheet.setAttribute("rel", "stylesheet");
AudiowideStylesheet.setAttribute("href", "https://fonts.googleapis.com/css2?family=Audiowide&display=swap");
document.head.append(AudiowideStylesheet);

window.headerQPCP = class headerQPCP {
    constructor(title, description, prevPageUrl, menuList) {
        this.title = title;
        this.description = description;
        this.prevPageUrl = prevPageUrl;
        this.menuList = menuList;

        this.boxId = "headerQPCP"
        //this.target = document.getElementById(this.boxId)
        this.baseUrlFirsPart = "/PageComponents/HtmlBase/content";
        this.logoUrl = "/PageComponents/headerQPCP/content/triangle.png"
        //this.logoUrl = this.baseUrlFirsPart + "/logo.png"
    }

    insertAdjacentHTML(position, target) {
        let descriptionFlag = false;
        if (this.description != null && this.description.length > 0)
            descriptionFlag = true;
        let menuHtml = "";
        if (this.menuList != null && this.menuList.length > 0) {

            menuHtml += "<ul class=\"icon-menu\">";
            for (var i = 0; i < this.menuList.length; i++) {
                let hr = "";
                let id = "";
                if (this.menuList[i].href != "")
                    hr = "href=\"" + this.menuList[i].href + "\""; //+ "\";
                if (this.menuList[i].id != null && this.menuList[i].id != "")
                    id = "id=\"" + this.menuList[i].id + "\"";

                menuHtml +=
                    "<li>\
                        <a " + hr + " " + id + ">\
                            <img src=\"" + this.menuList[i].icon + "\" />\
                        </a>\
                    </li>";
            }
            menuHtml += "</ul>"
        }

        let ppu = "";
        if (this.prevPageUrl.length > 0)
            ppu = "href=\"" + this.prevPageUrl + "\"";

        let html =
            "<header id=\"" + this.boxId + "\" data-description_flag=\"" + descriptionFlag + "\">\
                <div>\
                    <a " + ppu + ">\
                        <img src=\"" + this.logoUrl + "\" />\
                    </a>\
                    <div>\
                        <a href=\"" + document.URL + "\">" + this.title + "</a>\
                    </div>"
        html += menuHtml
        html += "</div>";
        if (descriptionFlag) {
            html +=
                "<div>\
                    <div>\
                    </div>\
                    <p>" + this.description + "</p>\
                    <div>\
                    </div>\
                </div>"
        }

        html += "</header>";
        target.insertAdjacentHTML(position, html)
    }

    target() {
        return document.getElementById(this.boxId)
    }
}