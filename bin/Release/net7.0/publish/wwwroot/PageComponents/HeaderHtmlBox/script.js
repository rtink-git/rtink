export class HeaderHtmlBox {
    HeaderQBoxName
    HeaderQBoxUrl
    constructor(target, position, title, backToPreviousPage=null, menuList = null, isTest = false) {
        this.HeaderQBoxName = "HeaderHtmlBox"
        this.HeaderQBoxUrl = "/PageComponents/" + this.HeaderQBoxName;

        let HeaderQBoxCss = document.createElement("link"); HeaderQBoxCss.setAttribute("rel", "stylesheet"); HeaderQBoxCss.setAttribute("href", this.HeaderQBoxUrl + "/style.css"); document.head.append(HeaderQBoxCss);
        let AudiowideStylesheet = document.createElement("link"); AudiowideStylesheet.setAttribute("rel", "stylesheet"); AudiowideStylesheet.setAttribute("href", "https://fonts.googleapis.com/css2?family=Audiowide&display=swap"); document.head.append(AudiowideStylesheet);

        const projectLogoUrl = this.HeaderQBoxUrl + "/content/logo.png"

        let html = this.MainHtmlPart(title, projectLogoUrl,backToPreviousPage, menuList, isTest);
        target.insertAdjacentHTML(position, html)
    }

    MainHtmlPart(title, projectLogoUrl, backToPreviousPage = null, menuList = null, isTest = false) {
        if (backToPreviousPage == null)
            backToPreviousPage = document.URL
        let html =
            "<header id=\"" + this.HeaderQBoxName + "\">\
                <a href=\"" + backToPreviousPage + "\">\
                    <img src=\"" + projectLogoUrl + "\" />\
                </a>\
                <a href=\"" + backToPreviousPage + "\">\
                    " + title + "\
                </a>\
                " + this.MenuHtmlPart(menuList, isTest) + "\
            </header>";

        return html;
    }

    MenuHtmlPart(menuList, isTest) {
        let html = "";

        if (isTest == true && (menuList == null || menuList.length == 0)) {
            menuList = new Array()
            menuList.push({ "icon": this.HeaderQBoxUrl + "/content/test/category.png", "href": "/", "id": "_CategoryId" });
            menuList.push({ "icon": this.HeaderQBoxUrl + "/content/test/menu.png", "href": "", "id": "_MenuId" });
            menuList.push({ "icon": this.HeaderQBoxUrl + "/content/test/login.png", "href": "" });
        }

        if (menuList != null && menuList.length > 0) {
            html = "<ul>";

            menuList.forEach(e => {
                let idAttr = "";
                if (e.id != undefined && e.id != null && e.id.length > 0)
                    idAttr = "id=\"" + e.id + "\""

                let hrefAttr = "";
                if (e.href != undefined && e.href != null && e.href.length > 0)
                    hrefAttr = "href=\"" + e.href + "\""

                html +=
                    "<li " + idAttr + ">\
                        <a " + hrefAttr + ">\
                            <img src=\"" + e.icon + "\">\
                        </a>\
                    </li>"
            })

            html += "</ul>";
        }

        return html;
    }
}