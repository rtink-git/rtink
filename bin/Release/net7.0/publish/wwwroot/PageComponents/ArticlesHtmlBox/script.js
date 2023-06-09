﻿//-- Knowledge Library
//-- JS: Private class features: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';

export class ArticlesHtmlBox {
    #Target
    #Position
    #Search
    #ApiUrl
    #AuthJWToken

    Name
    Page

    #UrlContent
    #Take

    constructor(target, position, search, apiUrl, authJWToken) {
        this.#Target = target
        this.#Position = position
        this.#Search = search
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken

        this.Name = "ArticlesHtmlBox"
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.Page = 1;
        this.#Take = 20;
    }

    async AppendList() {
        let list = await this.#ApiAticles()
        if (this.Page == 1) {
            this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())

            if (list.length == this.#Take) {
                let moreButtonHtmlBox = new MoreButtonHtmlBox(document.getElementById(this.Name), "beforeend")

                document.getElementById(moreButtonHtmlBox.Name).addEventListener('click', async () => {
                    let list = await this.#ApiAticles()

                    list.forEach(e => {
                        document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e))
                        this.#LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension)
                        if (e.description.length > 0 && e.isBody) {
                            document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
                                this.#AppendBody(e.titleHb)
                            });
                        }
                    })

                    this.Page++
                });
            }
        }

        list.forEach(e => {
            document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e))
            if (e.rating != 4)
                this.#LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension)
            if (e.rating == -9223372036854776000)
                this.#AppendBody(e.titleHb)
            if (e.description.length > 0 && e.isBody) {
                document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
                    this.#AppendBody(e.titleHb)
                });
            }
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

    #ItemHtmlBox(e) {
        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        //let loginFlag = false;
        //for (var i = 0; i < this.#list.length; i++)
        //    if (this.#list[0].login != this.#list[i].login)
        //        loginFlag = true;

        //if (e.rating == 2)
        //    e.rating = 0

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

        //let _dtLoginHtmlPartUp = "";
        //let _dtLoginHtmlPartDown = "";
        //let _dtLoginHtmlPart = this.#DtLoginHtmlPart(dtstr, e.login, loginFlag)
        //if (e.rating == 2) _dtLoginHtmlPartDown = _dtLoginHtmlPart
        //else _dtLoginHtmlPartUp = _dtLoginHtmlPart

        //let _descriptionHtmlPart = "";
        //let isDescription = false
        //if (e.description != null && e.description != undefined && e.description.length > 0) {
        //    _descriptionHtmlPart = e.description;
        //    isDescription = true
        //}

        let html = "\
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
                <div class=\"_Description\">\
                " + e.description + "\
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


        return html;
    }





    //-- actions

    #LoadImages(titleHb, fileUrlSource, fileId, extension) {
        let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
        let trg = tr.querySelector("img")

        let img = new Image(trg);
        img.onload = function () { trg.style.display = "flex" }
        img.onerror = function () {
            let srcQ = "https://rt.ink/f/" + fileId + "." + extension.trim()
            trg.setAttribute("src", srcQ);
            let imgQ = new Image();
            imgQ.onload = function () { trg.style.display = "flex" }
            imgQ.src = srcQ
        }
        img.src = fileUrlSource
    }

    async #AppendBody(titleHb) {
        let bodyObj = await this.#ApiArticleBody(titleHb)
        if (bodyObj != null && bodyObj.body.length > 0) {
            let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
            let dsT = tr.querySelector("._Description")
            dsT.innerHTML = bodyObj.body
            dsT.setAttribute("data-body", true);
            dsT.setAttribute("data-isDescription", true)
        }  
    }





    //-- api acctions

    async #ApiAticles() {
        const response = await fetch(this.#ApiUrl + "/RtInk/Articles?search=" + this.#Search + "&take=" + this.#Take + "&page=" + this.Page, {
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
}
