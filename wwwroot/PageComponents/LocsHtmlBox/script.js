import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';

export class LocsHtmlBox {
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

        this.Name = "LocsHtmlBox"
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.Page = 1;
        this.#Take = 50;
        this.#List = new Array();
    }


    async AppendList() {
        let list = await this.#ApiUsersAsLocations()

        list.forEach(e => { this.#List.push({ "login": e.login, "hasChildrens": e.hasChildrens, "isSubscribed": e.isSubscribed, "appended": false, "hasChildrensAction": false }); });

        if (this.#List != null && this.#List.length > 0)
            if (this.Page == 1) {
                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())
                if (this.#List.length == this.#Take) {
                    new MoreButtonHtmlBox(document.getElementById(this.Name), "beforeend")
                }
            }

        this.#LisHtmlBox()
        await this.#ListActionSet()


        this.Page++;
    }

    //-- item actions set

    async #ListActionSet() {
        for (var i = 0; i < this.#List.length; i++) {
            if (!this.#List[i].append && this.#List[i].hasChildrens && !this.#List[i].hasChildrensAction) {
                if (document.getElementsByClassName("_MoreB")[i] != null)
                    document.getElementsByClassName("_MoreB")[i].addEventListener('click', async (event) => {
                       let t = event.target.closest("div");
                        let login = t.getAttribute("data-login")

                        let list = await this.#ApiUserChildrensAsLocations(login)
                        if (list.length > 0) {
                            list.forEach(e => { this.#List.push({ "login": e.login, "hasChildrens": e.hasChildrens, "isSubscribed": e.isSubscribed, "appended": false, "hasChildrensAction": false }); });
                            this.#LisChildrensHtmlBox(login)
                        }

                    });
                this.#List[i].hasChildrensAction = true
            }
            this.#List[i].appended = true;

        }
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
                let htmlB = ""
                if (e.hasChildrens)
                    htmlB = 
                    "<a class=\"_MoreB\" data-type=\"\">\
                        <img src=\"" + this.#UrlContent + "/arrow-down-black.png\" />\
                    </a>"
                else
                    htmlB = 
                    "<a class=\"_ImgB\" data-type=\"\">\
                        <img src=\"" + this.#UrlContent + "/pin.png\" />\
                    </a>"

                let html = "\
                <div data-login=\"" + e.login + "\">\
                    <a href=\"/i/-" + e.login + "\">\
                        <span>\
                        " + e.login + "\
                        </span>\
                    </a>\
                    " + htmlB + "\
                </div>"

                document.querySelector("#" + this.Name + " > *:first-child").insertAdjacentHTML("beforeend", html)
            }
        });
    }

    #LisChildrensHtmlBox(login) {
        this.#List.forEach(e => {
            if (!e.appended) {
                let htmlB = ""
                if (e.hasChildrens)
                    htmlB =
                        "<a class=\"_MoreB\" data-type=\"\">\
                        <img src=\"" + this.#UrlContent + "/arrow-down-black.png\" />\
                    </a>"
                else
                    htmlB =
                        "<a class=\"_ImgB\" data-type=\"\">\
                        <img src=\"" + this.#UrlContent + "/pin.png\" />\
                    </a>"

                let html = "\
                <div data-login=\"" + e.login + "\">\
                    <a href=\"/i/-" + e.login + "\">\
                        <span>\
                        " + e.login + "\
                        </span>\
                    </a>\
                    " + htmlB + "\
                </div>"


                document.querySelector("#" + this.Name + " > *:first-child > div[data-login=" + login + "]").insertAdjacentHTML("afterend", html)
            }
        });
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
}