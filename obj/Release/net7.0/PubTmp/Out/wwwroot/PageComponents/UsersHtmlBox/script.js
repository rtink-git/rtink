import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';


export class UsersHtmlBox {
    #Target
    #Position
    #ApiUrl
    #AuthJWToken
    #RoleId
    #MinifyExpansion


    Name
    Page

    #UrlContent
    #Take

    constructor(target, position, apiUrl, authJWToken, roleId, MinifyExpansion) {
        this.#Target = target
        this.#Position = position
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken
        this.#RoleId = roleId
        this.#MinifyExpansion = MinifyExpansion

        this.Name = "UsersHtmlBox"
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);

        this.Page = 1;
        this.#Take = 50;
    }

    async AppendList() {
        let list = await this.#ApiGetList()
        if (list != null && list.length > 0)
            if (this.Page == 1) {
                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())

                if (list.length == this.#Take)
                    new MoreButtonHtmlBox(document.getElementById(this.Name), "beforeend")
            }

        list.forEach(e => {
            document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e.login, e.artn, e.title))
            if (this.#RoleId > 0)
                this.#SubscribButtonItemHtmlBox(e.login, e.subscribeType)
        })

        this.Page++;
    }





    //-- html parts

    #HtmlPart() {
        let html = "\
        <div id=\"" + this.Name + "\">\
            <ul>\
            </ul>\
        </div>"

        return html;
    }

    #ItemHtmlBox(login, articleN, title) {
        let href = "/i/-" + login

        let articleHB = "";
        if (articleN > 0)
            articleHB =
                "<div class=\"_ArticleN\">\
                    <span>\
                    " + articleN + "\
                    </span>\
                </div>"

        let html = "\
        <li>\
            <div data-login=\"" + login + "\">\
                <div>\
                    <a href =\"" + href + "\">\
                        <span>\
                        " + login + "\
                        </span>\
                    </a>\
                    " + articleHB + "\
                </div>\
                <div>\
                    <span>\
                    " + title + "\
                    </span>\
                </div>\
            </div>\
        </li>"

        return html;
    }

    #SubscribButtonItemHtmlBox(login, subscribeType) {
        let html = "\
        <a class=\"_SubscribB\" data-subscribeType=\"" + subscribeType + "\">\
            <img />\
        </a>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] > div:first-child > *:nth-child(1)").insertAdjacentHTML('afterend', html)

        let trg = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._SubscribB")
        trg.addEventListener('click', async (event) => {
            let usb = await this.#ApiUserSubscrib(login)
            if (usb.ok) {
                if (subscribeType == 0) {
                    subscribeType = 2
                    trg.setAttribute("data-subscribeType", subscribeType)
                }
                else if (subscribeType == 2) {
                    subscribeType = 0
                    trg.setAttribute("data-subscribeType", subscribeType)
                }
                else if (subscribeType == 3) {
                    subscribeType = 4
                    trg.setAttribute("data-subscribeType", subscribeType)
                }
                else if (subscribeType == 4) {
                    subscribeType = 3
                    trg.setAttribute("data-subscribeType", subscribeType)
                }
            }
        });
    }

    //#SigninButtonHtmlBox(login) {
    //    localStorage.setItem("SessionRefrshRequired", "true")
    //    let html = "\
    //    <a class=\"_SigninB\">\
    //        <img src=\"" + this.#UrlContent + "/login.png\"/>\
    //    </a>"

    //    document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)

    //    document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._SigninB").addEventListener('click', async (event) => {
    //        window.location.href = this.#ApiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + this.#AuthJWToken + "&RedirectUrl=" + document.URL
    //    });
    //}

    //#SettingsButtonHtmlBox(login) {
    //    let html = "\
    //    <a class=\"_SettingsB\">\
    //        <img src=\"" + this.#UrlContent + "/settings.png\"/>\
    //    </a>"

    //    document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)
    //}










    //-- api actions

    async #ApiGetList() {
        const response = await fetch(this.#ApiUrl + "/RtInk/Users?take=" + this.#Take + "&page=" + this.Page, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUserSubscrib(userLogin) {
        const response = await fetch(this.#ApiUrl + "/Base/User/Subscrib?userLogin=" + userLogin, {
            method: "POST",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }
}
