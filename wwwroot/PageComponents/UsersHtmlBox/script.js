import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';


export class UsersHtmlBox {
    #Target
    #Position
    #ApiUrl
    #AuthJWToken

    Name
    Page

    #UrlContent
    #Take
    #List

    constructor(target, position, apiUrl, authJWToken) {
        this.#Target = target
        this.#Position = position
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken

        this.Name = "UsersHtmlBox"
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.Page = 1;
        this.#Take = 50;

        this.#List = new Array();
    }

    async AppendList() {
        let list = await this.#ApiGetList()
        list.forEach(e => { this.#List.push({ "login": e.login, "articleNumber": e.artn, "subscribeType": e.subscribeType, "appended": false }); });

        if (this.#List != null && this.#List.length > 0)
            if (this.Page == 1) {
                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())
                if (this.#List.length == this.#Take) {
                    new MoreButtonHtmlBox(document.getElementById("UsersHtmlBox"), "beforeend")
                }
            }

        this.#LisHtmlBox()

        this.Page++;

    }





    //-- html parts

    #HtmlPart() {
        let html = "\
        <div id=\"" + this.Name + "\">\
            <div>\
            </div>\
        </div>"

        return html;
    }

    #LisHtmlBox() {
        this.#List.forEach(e => {
            if (!e.appended) {
                e.append = true;

                let html = "\
                <div data-login=\"" + e.login + "\">\
                    <a href=\"/i/-" + e.login + "\">\
                        <span>\
                        " + e.login + "\
                        </span>\
                    </a>\
                    <a class=\"_Subscrib\" data-type=\"" + e.subscribeType + "\">\
                        <img />\
                    </a>\
                    <div class=\"_ArticleN\">\
                        <span>\
                    " + e.articleNumber + "\
                        </span>\
                    </div>\
                </div>"

                document.querySelector("#" + this.Name + " > *:first-child").insertAdjacentHTML("beforeend", html)
            }
        });
    }




    //-- api actions

    async #ApiGetList() {
        const response = await fetch(this.#ApiUrl + "/RtInk/Users?take=" + this.#Take + "&page=" + this.Page, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }
}