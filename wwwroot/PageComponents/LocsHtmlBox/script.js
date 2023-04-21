import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';

export class LocsHtmlBox {
    #Target
    #Position
    #ApiUrl
    #AuthJWToken

    Name
    Page

    #UrlContent
    //#Take
    //#List

    constructor(target, position, apiUrl, authJWToken) {
        this.#Target = target
        this.#Position = position
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken

        this.Name = "LocsHtmlBox"
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.Page = 1;
        //this.#Take = 50;
        //this.#List = new Array();
    }

    async AppendList() {
        let list = await this.#ApiUsersAsLocations()
        if (list != null && list.length > 0)
            if (this.Page == 1)
                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())

        list.forEach(e => {
            document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e.login, e.isSubscribed))
            if (e.hasChildrens) this.#ItemHasChildrensButtonHtmlBoxAppend(e.login)
            else this.#ItemSelectLocButtonHtmlBoxAppend(e.login)
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

    #ItemHtmlBox(login, isSubscribed, parentLogin = null) { 
        let parentLoginAttr = ""
        if (parentLogin != null)
            parentLoginAttr = "data-parentLogin=\"" + parentLogin + "\"";

        let html = "\
        <li>\
            <div data-login=\"" + login + "\"  " + parentLoginAttr + " data-isSubscribed=\"" + isSubscribed + "\">\
                <a href=\"/i/-" + login + "\">\
                    <span>\
                    " + login + "\
                    </span>\
                </a>\
            </div>\
        </li>"

        return html;
    }

    #ItemHasChildrensButtonHtmlBoxAppend(login) {
        let html = "\
        <a class=\"_HasChildrensB\" data-type=\"\", data-display=\"false\" data-childrensAppended=\"false\">\
            <img src=\"" + this.#UrlContent + "/arrow-down-black.png\" />\
        </a>"


        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._HasChildrensB").addEventListener('click', async (event) => {
            let parentT = event.target.closest("._HasChildrensB");
            let dataDisplay = parentT.getAttribute("data-display")
            if (dataDisplay == "false") {
                if (parentT.getAttribute("data-childrensAppended") == "false") {
                    let list = await this.#ApiUserChildrensAsLocations(login);
                    if (list.length > 0) {
                        list.forEach(e => {
                            event.target.closest("li").insertAdjacentHTML("afterend", this.#ItemHtmlBox(e.login, e.isSubscribed, login))
                            if (e.hasChildrens) this.#ItemHasChildrensButtonHtmlBoxAppend(e.login)
                            else this.#ItemSelectLocButtonHtmlBoxAppend(e.login)

                            this.#ItemLineHtmlBoxAppend(e.login)
                        })
                    }

                    parentT.setAttribute("data-childrensAppended", true)
                    parentT.setAttribute("data-display", true)
                }
                else {
                    document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
                        e.closest("li").style.display = "block"
                    })

                    parentT.setAttribute("data-display", true)
                }

                if (parentT.closest("div").querySelector("._SelectLocB") == null) this.#ItemSelectLocButtonHtmlBoxAppend(login)
                else parentT.closest("div").querySelector("._SelectLocB").style.display = "block"

            }
            else {
                document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
                    e.closest("li").style.display = "none"
                })
                parentT.setAttribute("data-display", false)
                parentT.closest("div").querySelector("._SelectLocB").style.display = "none"
            }
        });
    }

    #ItemSelectLocButtonHtmlBoxAppend(login) {
        let html = "\
        <a class=\"_SelectLocB\">\
            <img src=\"" + this.#UrlContent + "/pin.png\" />\
        </a>"

        let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]")
        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] > *:first-child").insertAdjacentHTML('afterend', html)

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
            let isSubscribed = mT.getAttribute("data-issubscribed")
            let userSubscriptionSet = await this.#ApiUserSubscriptionSet(login)
            if (userSubscriptionSet.ok) {
                if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false) //mT.setAttribute("data-isSubscribed", false)
                else mT.setAttribute("data-issubscribed", true) //mT.setAttribute("data-isSubscribed", true)
            }
        });
    }

    #ItemLineHtmlBoxAppend(login) {
        let html = "\
        <div class=\"_LineB\">\
        </div>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)
    }


    //-- api actions

    async #ApiUsersAsLocations() {
        const response = await fetch(this.#ApiUrl + "/Base/Users/AsLocation", {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUserChildrensAsLocations(login) {
        const response = await fetch(this.#ApiUrl + "/Base/User/Childrens/AsLocation?login=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUserSubscriptionSet(login) {
        const response = await fetch(this.#ApiUrl + "/RtInk/UserSubscriptionSet?userLogin=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }
}