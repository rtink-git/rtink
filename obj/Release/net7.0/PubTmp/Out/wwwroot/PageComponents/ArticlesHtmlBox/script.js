//-- Knowledge Library
//-- JS: Private class features: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

export class ArticlesHtmlBox {
    #Target
    #Position
    page
    take
    search
    #ApiUrl
    #AuthJWToken
    #name
    #list
    #urlContent

    constructor(target, position, search, apiUrl, authJWToken) {
        this.#name = "ArticlesHtmlBox"
        let url = "/PageComponents/" + this.#name;
        this.#urlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.#Target = target
        this.#Position = position
        this.search = search;
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken
        this.page = 1;
        this.take = 20;

        this.#list = new Array();
    }

    async ListAppend() {
        let list = await this.#ApiAticles()
        list.forEach(e => { this.#list.push({ "title": e.title, "urlShort": e.urlShort, "fileId": e.fileId, "extension": e.extension, "fileUrlSource": e.fileUrlSource, "description": e.description, "dt": e.dt, "login": e.login, "isBody": e.isBody, "titleHb": e.titleHb, "fileUrlSource": e.fileUrlSource, "isBookmark": e.isBookmark, "rating": e.rating, "appended": false, "imgcheck": false, "bookmarkActionAdded": false }) });

        if (this.#list != null && this.#list.length > 0)
            if (this.page == 1)
                this.#Target.insertAdjacentHTML(this.#Position, this.#BodyHtmlBox(this.#name))

        document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("beforeend", this.#LisHtmlBox())
        await this.#LoadImages()
        await this.#ListActionSet()

        if (this.page == 1 && this.#list.length == this.take) {
            

            document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("afterend", this.#MoreButton())

            document.getElementById("MoreButton").addEventListener('click', async () => {
                let list = await this.#ApiAticles()
                list.forEach(e => { this.#list.push({ "title": e.title, "urlShort": e.urlShort, "fileId": e.fileId, "extension": e.extension, "fileUrlSource": e.fileUrlSource, "description": e.description, "dt": e.dt, "login": e.login, "isBody": e.isBody, "titleHb": e.titleHb, "fileUrlSource": e.fileUrlSource, "isBookmark": e.isBookmark, "rating": e.rating, "appended": false, "imgcheck": false, "bookmarkActionAdded": false }) });
                document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("beforeend", this.#LisHtmlBox())
                await this.#LoadImages()
                await this.#ListActionSet()

                this.page++;
            });
        }

        this.page++;
    }

    //-- Html Boxes

    #BodyHtmlBox(name) {
        let html = "\
        <div id=\"" + name + "\">\
            <ul>\
            </ul>\
        </div>"

        return html;
    }

    #LisHtmlBox() {
        let html = "";

        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let loginFlag = false;
        for (var i = 0; i < this.#list.length; i++)
            if (this.#list[0].login != this.#list[i].login)
                loginFlag = true;

        this.#list.forEach(e => {
            if (!e.appended) {
                if (e.rating == 2)
                    e.rating = 0

                let dt = new Date(e.dt);
                let dtnow = new Date()
                dt.setHours(dt.getHours() + (-1) * dt.getTimezoneOffset() / 60)
                let mm = dt.getMinutes().toString();
                if (mm.length == 1) mm = "0" + mm;

                const dtstrbase = months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " · " + dt.getHours() + ":" + mm
                let dtstr = dtstrbase

                let minago = parseFloat(Date.now() - dt) / 1000 / 60
                if (minago < 60) dtstr = parseInt(minago) + " min ago"
                else if (new Date().getFullYear() == dt.getFullYear())
                    if (dtnow.getDate() == dt.getDate()) dtstr = dt.getHours() + ":" + mm
                    else dtstr = months[dt.getMonth()] + " " + dt.getDate()

                let _dtLoginHtmlPartUp = "";
                let _dtLoginHtmlPartDown = "";
                let _dtLoginHtmlPart = this.#DtLoginHtmlPart(dtstr, e.login, loginFlag)
                if (e.rating == 2) _dtLoginHtmlPartDown = _dtLoginHtmlPart
                else _dtLoginHtmlPartUp = _dtLoginHtmlPart

                let _descriptionHtmlPart = "";
                let isDescription = false
                if (e.description != null && e.description != undefined && e.description.length > 0) {
                    _descriptionHtmlPart = e.description;
                    isDescription = true
                }

                html += "\
                <li>\
                    <article data-titleHb=\"" + e.titleHb + "\" data-tp=\"" + e.rating + "\" data-isBody=\"" + e.isBody + "\">\
                        <div>\
                            <h1>\
                                <a href=\"/i/" + e.urlShort + "-\">\
                                    " + e.title + "\
                                </a>\
                            </h1>\
                        </div>\
                        <img src=\"" + e.fileUrlSource + "\" />\
                        <div class=\"_Description\" data-isDescription=\"" + isDescription + "\">\
                        " + _descriptionHtmlPart + "\
                        </div>\
                        <div class=\"_footer\">\
                            <a href=\"/i/-" + e.login.toLowerCase() + "\">\
                                <span>\
                                " + e.login + "\
                                </span>\
                            </a>\
                            <span>\
                            " + dtstr + "\
                            </span>\
                            <a href=\"/a/" + e.urlShort + "\">\
                                <span>\
                                    SOURCE\
                                </span>\
                            </a>\
                        </div>\
                    </article>\
                </li>"


                // " + _dtLoginHtmlPartDown + "\


                        //<div id=\"_Inf\">\
                        //    " + _dtLoginHtmlPartUp + "\
                        //    <hr />\
                        //</div>\
                        //<div>\
                        //    <a class=\"BookmarkButton\" data-isBookmark=\"" + e.isBookmark + "\">\
                        //        <img />\
                        //    </a>\
                        //    <a class=\"_source\" href=\"/a/" + e.urlShort + "\">\
                        //        source\
                        //    </a>\
                        //</div>\

                e.appended = true;
            }
        });

        return html;
    }

    #CommentInputHtmlPart() {
        let name = "CommentInputHtmlPart"

        let html = "\
        <div id=\"" + name + "\">\
            <input type=\"text\" placeholder=\"Comment ...\" />\
            <a>\
                <img src=\"" + this.#urlContent + "/send.png\" />\
            </a>\
        </div>"

        return html;
    }

    #DtLoginHtmlPart(time, login, loginFlag) {
        let loginHtmlPart = ""
        if (loginFlag) {
            let lgn = login
            if (lgn.length > 4)
                lgn = lgn.substring(0, 4)
            else if (lgn.length < 4)
                for (i = 0; i < 4 - lgn.length; i++)
                    lgn += "_";

            for (var i = 0; i < lgn.length; i++)
                loginHtmlPart += "<div><span>" + lgn[i] + "</span></div>"

            loginHtmlPart = "<a href=\"/i/-" + login + "\" class=\"_login\">" + loginHtmlPart + "</a>"

            //loginHtmlPart = "<a href=\"/i/-" + login + "\">@" + login.toLowerCase() + "</a>"
        }

        let html = "\
        <div id=\"_DtLoginHtmlPart\">\
            " + loginHtmlPart + "\
            <time>\
                " + time + "\
            </time>\
        </div>";

        return html;
    }

    #MoreButton() {
        let html = "\
        <div id=\"MoreButton\">\
            <div>\
                <a>\
                    <img src=\"/PageComponents/ArticlesHtmlBox/content/arrow-down-black.png\" />\
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

    //----------

    async #ListActionSet() {
        if (this.#list.length > 0)
            if (this.#list[0].rating == -9223372036854776000) {
                let tr = document.querySelectorAll("article")[0]
                if (this.#list[0].isBody) {
                    let bodyObj = await this.#ApiArticleBody(this.#list[0].titleHb)
                    if (bodyObj != null && bodyObj.body.length > 0) {
                        let dsT = tr.querySelector("#_Description")
                        dsT.innerHTML = bodyObj.body
                        dsT.setAttribute("data-body", true);
                        dsT.setAttribute("data-isDescription", true)
                    }
                } 
            }
        

        for (var i = 0; i < this.#list.length; i++) {
            if (!this.#list[i].bookmarkActionAdded) {
                let tr = document.querySelectorAll("article")[i]
                //let trg = tr.getElementsByClassName("BookmarkButton")[0]

                let rating = this.#list[i].rating
                let isBody = this.#list[i].isBody
                let isBookmark = this.#list[i].isBookmark
                let titleHb = this.#list[i].titleHb

                //trg.addEventListener("click", async event => {
                    //if (rating == 2) {
                    //    rating = 0;
                    //    tr.setAttribute("data-tp", rating);
                    //    var q = tr.querySelector("#_DtLoginHtmlPart")
                    //    var w = "<div id=\"_DtLoginHtmlPart\">" + q.innerHTML + "</div>";
                    //    q.remove()
                    //    tr.querySelector("#_Inf").insertAdjacentHTML("afterbegin", w)
                    //}

                    //if (isBody) {
                    //    let bodyObj = await this.#ApiArticleBody(titleHb)
                    //    if (bodyObj != null && bodyObj.body.length > 0) {
                    //        let dsT = tr.querySelector("#_Description")
                    //        dsT.innerHTML = bodyObj.body
                    //        dsT.setAttribute("data-body", true);
                    //        dsT.setAttribute("data-isDescription", true)
                    //    }
                    //}              

                    //let apiArticleBookmark = await this.#ApiArticleBookmark(titleHb)
                    //if (apiArticleBookmark)
                    //    if (tr.querySelector(".BookmarkButton").getAttribute("data-isBookmark") == "false")
                    //        tr.querySelector(".BookmarkButton").setAttribute("data-isBookmark", true)
                    //    else tr.querySelector(".BookmarkButton").setAttribute("data-isBookmark", false)

                    //if (document.getElementById("CommentInputHtmlPart") == null) {
                    //    tr.insertAdjacentHTML("beforeend", this.#CommentInputHtmlPart())
                    //}
                    //else {
                    //    document.getElementById("CommentInputHtmlPart").remove()
                    //    tr.insertAdjacentHTML("beforeend", this.#CommentInputHtmlPart())
                    //}
                //})
            }
        }
    }

    async #LoadImages() {
        for (var i = 0; i < this.#list.length; i++) {
            if (this.#list[i].appended && !this.#list[i].imgcheck && this.#list[i].fileId > 0) {
                let tr = document.querySelectorAll("article")[i];
                let trg = tr.querySelector("img")
                let fileId = this.#list[i].fileId
                let extension = this.#list[i].extension.trim()

                let img = new Image(trg);
                img.onload = function () { trg.style.display = "flex" }
                img.onerror = function () {
                    let srcQ = "https://rt.ink/f/" + fileId + "." + extension
                    trg.setAttribute("src", srcQ);
                    let imgQ = new Image();
                    imgQ.onload = function () { trg.style.display = "flex" }
                    imgQ.src = srcQ
                }
                img.src = this.#list[i].fileUrlSource

                //let rating = this.#list[i].rating
                //trg.addEventListener("click", async event => {
                //    if (rating == 2) {
                //        rating = 0;
                //        tr.setAttribute("data-tp", rating);
                //        var q = tr.querySelector("#_DtLoginHtmlPart")
                //        var w = "<div id=\"_DtLoginHtmlPart\">" + q.innerHTML + "</div>";
                //        q.remove()
                //        tr.querySelector("#_Inf").insertAdjacentHTML("afterbegin", w)
                //    }
                //});

            }
        }
    }

    //-- Api

    async #ApiAticles() {
        const response = await fetch(this.#ApiUrl + "/RtInk/Articles?search=" + this.search + "&take=" + this.take + "&page=" + this.page, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiArticleBody(titleHb) {
        const response = await fetch(this.#ApiUrl + "/RtInk/ArticleBody?titleHb=" + titleHb.toString(), {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiArticleBookmark(titleHb) {
        const response = await fetch(this.#ApiUrl + "/RtInk/ArticleBookmark?titleHb=" + titleHb.toString(), {
            method: "POST",
            headers: { "Authorization": "Bearer " + this.#AuthJWToken }
        });
        return response.ok
    }
}
