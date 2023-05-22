//-- Tasks
//-- 2023-04-27 RT. article item bookmarks
//-- 2023-04-27 i/-user - удаляем пользователей у article так как они одинаковые
//-- 2023-05-03 Не нравится как отображаются одиночные новости / публикации

export class ArticlesHtmlBox {
    _Target
    _Position
    _Search
    _ApiUrl
    _SessionToken

    _UrlContent
    _Take

    Page

    constructor(target, position, search, apiUrl, seessionToken, minifiedCode) {
        this._Target = target;
        this._Position = position;
        this._Search = search;
        this._ApiUrl = apiUrl;
        this._SessionToken = seessionToken;

        let url = "/PageComponents/" + this.constructor.name;
        this._UrlContent = url + "/content";
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style" + minifiedCode + ".css"); document.head.append(css);

        this._Take = 20;

        this.Page = 1;
    }

    async AppendList() {
        let list = await this._ApiAticles();
        if (this.Page == 1) {
            this._Target.insertAdjacentHTML(this._Position, this._HtmlPart());
            if (list.length == this._Take) {
                //let moreButtonHtmlBox = new MoreButtonHtmlBox(document.getElementById(this.constructor.name), "beforeend", this.MinifyExpansion);

                //document.getElementById(moreButtonHtmlBox.Name).addEventListener('click', async () => {
                //    let list = await this._ApiAticles();

                //    list.forEach(e => {
                //        document.querySelector("#" + this.constructor.name + " > ul").insertAdjacentHTML("beforeend", this.ItemHtmlBox(e));
                //        this.LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension);
                //        if (e.description.length > 0 && e.isBody) {
                //            document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
                //                this.AppendBody(e.titleHb);
                //            });
                //        }
                //    });

                //    this.Page++;
                //});
            }
        }

        if (list != null && list.length > 0)
            list.forEach(e => {
                document.querySelector("#" + this.constructor.name + " > ul").insertAdjacentHTML("beforeend", this._ItemHtmlBox(e));
                //alert("d")

                if (e.rating != 4)
                    this._LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension);
                if (e.rating == -9223372036854776000)
                    this._AppendBody(e.titleHb);
                if (e.description.length > 0 && e.isBody) {
                    document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
                        this._AppendBody(e.titleHb);
                    });
                }

            });

        this.Page++;
    }





    //-- html parts

    _HtmlPart() {
        let html = "\
        <div id=\"" + this.constructor.name + "\">\
            <ul>\
            </ul>\
        </div>";

        return html;
    }

    _ItemHtmlBox(e) {
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
        <img alt=\"" + e.title + "\" src=\"" + e.fileUrlSource + "\" />\
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
            " + this._ConvertDatetimeToShortFormat(e.dt) + "\
            </span>\
            <a href=\"/a/" + e.urlShort + "\">\
                <span>\
                    SOURCE\
                </span>\
            </a>\
        </div>\
    </article>\
</li>";

        return html;
    }





    //----------

    _ConvertDatetimeToShortFormat(datetime) {
        let s = "";

        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];


        let dt = new Date(datetime);
        let dtnow = new Date();
        dt.setHours(dt.getHours() + (-1) * dt.getTimezoneOffset() / 60);
        let mm = dt.getMinutes().toString();
        if (mm.length == 1) mm = "0" + mm;

        const dtstrbase = months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " · " + dt.getHours() + ":" + mm;
        s = dtstrbase;

        let minago = parseFloat(Date.now() - dt) / 1000 / 60;

        if (minago > 60) {
            if (new Date().getFullYear() == dt.getFullYear())
                if (dtnow.getDate() == dt.getDate()) s = dt.getHours() + ":" + mm;
                else s = months[dt.getMonth()] + " " + dt.getDate() + " · " + dt.getHours() + ":" + mm;
        }
        else s = "";

        return s;
    }

    _LoadImages(titleHb, fileUrlSource, fileId, extension) {
        let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
        let trg = tr.querySelector("img");

        let img = new Image(trg);
        img.onload = function () { trg.style.display = "flex"; }
        img.onerror = function () {
            let srcQ = "https://rt.ink/f/" + fileId + "." + extension.trim();
            trg.setAttribute("src", srcQ);
            let imgQ = new Image();
            imgQ.onload = function () { trg.style.display = "flex"; }
            imgQ.src = srcQ;
        }
        img.src = fileUrlSource;
    }

    async _AppendBody(titleHb) {
        let bodyObj = await this._ApiArticleBody(titleHb);
        if (bodyObj != null && bodyObj.body.length > 0) {
            let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
            let dsT = tr.querySelector("._Description");
            dsT.innerHTML = bodyObj.body;
            dsT.setAttribute("data-body", true);
            dsT.setAttribute("data-isDescription", true);
        }
    }

    //-- api actions

    async _ApiAticles() {
        const response = await fetch(this._ApiUrl + "/RtInk/Articles?search=" + this._Search + "&take=" + this._Take + "&page=" + this.Page, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._SessionToken }
        });
        if (response.ok == true) return await response.json();
        return null;
    }

    async _ApiArticleBody(titleHb) {
        const response = await fetch(this._ApiUrl + "/RtInk/ArticleBody?titleHb=" + titleHb.toString(), {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._SessionToken }
        });
        if (response.ok == true) return await response.json();
        return null;
    }
}


//204
//import { MoreButtonHtmlBox } from '/PageComponents/MoreButtonHtmlBox/script.js';

//export class ArticlesHtmlBox {
//    Target
//    Position
//    Search
//    ApiUrl
//    AuthJWToken
//    MinifyExpansion
//    Page
//    UrlContent
//    Take
//    constructor(target, position, search, apiUrl, authJWToken, MinifyExpansion) {
//        this.Target = target;
//        this.Position = position;
//        this.Search = search;
//        this.ApiUrl = apiUrl;
//        this.AuthJWToken = authJWToken;
//        this.MinifyExpansion = MinifyExpansion;

//        let url = "/PageComponents/" + this.constructor.name;
//        this.UrlContent = url + "/content";
//        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);

//        this.Page = 1;
//        this.Take = 20;
//    }

//    async AppendList() {
//        let list = await this.ApiAticles();
//        if (this.Page == 1) {
//            this.Target.insertAdjacentHTML(this.Position, this.HtmlPart());

//            if (list.length == this.Take) {
//                //let moreButtonHtmlBox = new MoreButtonHtmlBox(document.getElementById(this.constructor.name), "beforeend", this.MinifyExpansion);

//                //document.getElementById(moreButtonHtmlBox.Name).addEventListener('click', async () => {
//                //    let list = await this.ApiAticles();

//                //    list.forEach(e => {
//                //        document.querySelector("#" + this.constructor.name + " > ul").insertAdjacentHTML("beforeend", this.ItemHtmlBox(e));
//                //        this.LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension);
//                //        if (e.description.length > 0 && e.isBody) {
//                //            document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
//                //                this.AppendBody(e.titleHb);
//                //            });
//                //        }
//                //    });

//                //    this.Page++;
//                //});
//            }
//        }

//        list.forEach(e => {
//            document.querySelector("#" + this.constructor.name + " > ul").insertAdjacentHTML("beforeend", this.ItemHtmlBox(e));
//            if (e.rating != 4)
//                this.LoadImages(e.titleHb, e.fileUrlSource, e.fileId, e.extension);
//            if (e.rating == -9223372036854776000)
//                this.AppendBody(e.titleHb);
//            if (e.description.length > 0 && e.isBody) {
//                document.querySelector("article[data-titleHb=\"" + e.titleHb + "\"] ._Description").addEventListener('click', async () => {
//                    this.AppendBody(e.titleHb);
//                });
//            }
//        })

//        this.Page++;
//    }





//    //-- html parts

//    HtmlPart() {
//        let html = "\
//        <div id=\"" + this.constructor.name + "\">\
//            <ul>\
//            </ul>\
//        </div>";

//        return html;
//    }

//    ItemHtmlBox(e) {
//        let html = "\
//        <li>\
//            <article data-titleHb=\"" + e.titleHb + "\" data-tp=\"" + e.rating + "\" data-isBody=\"" + e.isBody + "\">\
//                <div>\
//                    <h1>\
//                        <a href=\"/i/" + e.urlShort + "-\">\
//                        " + e.title + "\
//                        </a>\
//                    </h1>\
//                </div>\
//                <img alt=\"" + e.title + "\" src=\"" + e.fileUrlSource + "\" />\
//                <div class=\"_Description\">\
//                " + e.description + "\
//                </div>\
//                <div class=\"_footer\">\
//                    <a href=\"/i/-" + e.login.toLowerCase() + "\">\
//                        <span>\
//                        " + e.login + "\
//                        </span>\
//                    </a>\
//                    <span>\
//                    " + this.ConvertDatetimeToShortFormat(e.dt) + "\
//                    </span>\
//                    <a href=\"/a/" + e.urlShort + "\">\
//                        <span>\
//                            SOURCE\
//                        </span>\
//                    </a>\
//                </div>\
//            </article>\
//        </li>";

//        return html;
//    }

//    ConvertDatetimeToShortFormat(datetime) {
//        let s = "";

//        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];


//        let dt = new Date(datetime);
//        let dtnow = new Date();
//        dt.setHours(dt.getHours() + (-1) * dt.getTimezoneOffset() / 60);
//        let mm = dt.getMinutes().toString();
//        if (mm.length == 1) mm = "0" + mm;

//        const dtstrbase = months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " · " + dt.getHours() + ":" + mm;
//        s = dtstrbase;

//        let minago = parseFloat(Date.now() - dt) / 1000 / 60;

//        if (minago > 60) {
//            if (new Date().getFullYear() == dt.getFullYear())
//                if (dtnow.getDate() == dt.getDate()) s = dt.getHours() + ":" + mm;
//                else s = months[dt.getMonth()] + " " + dt.getDate() + " · " + dt.getHours() + ":" + mm;
//        }
//        else s = "";

//        return s;
//    } 





//    //-- actions

//    LoadImages(titleHb, fileUrlSource, fileId, extension) {
//        let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
//        let trg = tr.querySelector("img");

//        let img = new Image(trg);
//        img.onload = function () { trg.style.display = "flex"; }
//        img.onerror = function () {
//            let srcQ = "https://rt.ink/f/" + fileId + "." + extension.trim();
//            trg.setAttribute("src", srcQ);
//            let imgQ = new Image();
//            imgQ.onload = function () { trg.style.display = "flex"; }
//            imgQ.src = srcQ;
//        }
//        img.src = fileUrlSource;
//    }

//    async AppendBody(titleHb) {
//        let bodyObj = await this.ApiArticleBody(titleHb);
//        if (bodyObj != null && bodyObj.body.length > 0) {
//            let tr = document.querySelector("article[data-titleHb=\"" + titleHb + "\"]");
//            let dsT = tr.querySelector("._Description");
//            dsT.innerHTML = bodyObj.body;
//            dsT.setAttribute("data-body", true);
//            dsT.setAttribute("data-isDescription", true);
//        }  
//    }





//    //-- api actions

//    async ApiAticles() {
//        const response = await fetch(this.ApiUrl + "/RtInk/Articles?search=" + this.Search + "&take=" + this.Take + "&page=" + this.Page, {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.AuthJWToken }
//        });
//        if (response.ok == true) return await response.json();
//        return null;
//    }

//    async ApiArticleBody(titleHb) {
//        const response = await fetch(this.ApiUrl + "/RtInk/ArticleBody?titleHb=" + titleHb.toString(), {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.AuthJWToken }
//        });
//        if (response.ok == true) return await response.json();
//        return null;
//    }
//}