let itemsPCPCss = document.createElement("link"); itemsPCPCss.setAttribute("href", "/PageComponents/itemsPCP/style.css"); itemsPCPCss.setAttribute("rel", "stylesheet"); document.head.append(itemsPCPCss);

window.itemsPCP = class itemsPCP {
    constructor(search, page) {
        this.search = search;
        this.page = page;
    }

    async ApiGetAticles() {
        const response = await fetch("/api/GetAticles?search=" + this.search + "&page=" + this.page, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("authJWToken")
            }
        });
        if (response.ok === true)
            return await response.json();
        return null;
    }

    async ApiGetArticleSimillars() {
        const response = await fetch("/api/GetAticleSimillars", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("authJWToken")
            }
        });
        if (response.ok === true)
            return await response.json();
        return null;
    }

    async ArticlesHtmlPart(items) {
        let articleSimillars = await this.ApiGetArticleSimillars();

        let html = "";
        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let arr = [];
        for (var i = 0; i < items.length; i++) {
            let dataTp = 0;
            if (items[i].description.length == 0 && items[i].fileUrlSource.length > 0)
                dataTp = 1
            else if (items[i].description.length == 0 && items[i].fileUrlSource.length == 0)
                dataTp = 2

            arr.push({ tp:dataTp, ind:i })
        }

        // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        //arr.sort((a, b) => (a.tp > b.tp) ? 1 : ((b.tp > a.tp) ? -1 : 0))
        arr.sort((a, b) => a.tp - b.tp); // b - a for reverse sort

        let uF = false;
        for (var i = 0; i < arr.length; i++)
            if (items[arr[0].ind].login != items[arr[i].ind].login)
                uF = true;

        for (var i = 0; i < arr.length; i++) {
            let dt = new Date(items[arr[i].ind].dt);
            let dtnow = new Date()

            dt.setHours(dt.getHours() + (-1) * dt.getTimezoneOffset() / 60)
            let mm = dt.getMinutes().toString();
            if (mm.length == 1)
                mm = "0" + mm;
            
            const dtstrbase = months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " · " + dt.getHours() + ":" + mm
            let dtstr = dtstrbase

            let minago = parseFloat(Date.now() - dt) / 1000 / 60
            if (minago < 60)
                dtstr = parseInt(minago) + " min ago"
            else if (new Date().getFullYear() == dt.getFullYear())
                if (dtnow.getDate() == dt.getDate()) {
                    dtstr = dt.getHours() + ":" + mm
                }
                else
                    dtstr = months[dt.getMonth()] + " " + dt.getDate()

            let isBodyStr = "Read more"
            let isBodyHref = "";
            if (items[arr[i].ind].isBody == 0) {
                isBodyStr = ""
                isBodyHref = "href=\"/i/" + items[arr[i].ind].urlShort + "\"";
            }

            let img = ""
            if (items[i].fileUrlSource != null)
                img = "<img src=\"" + items[i].fileUrlSource + "\" />";
            else if (items[i].extension != "")
                img = "<img src=\"https://rt.ink/f/" + items[arr[i].ind].fileId + "." + items[arr[i].ind].extension + "\" />";

            let simmilarHtml = "";
            if (items[arr[i].ind].description != null && items[arr[i].ind].description.length > 0) {
                simmilarHtml =
                    "<div class=\"AticleQDescription\" data-isBody=\"" + items[arr[i].ind].isBody + "\">" + items[arr[i].ind].description + "</div>"

                let lsHtmlPart = "";
                if (articleSimillars != null)
                    for (var j = 0; j < articleSimillars.length; j++) {
                        if (articleSimillars[j].titleHb == items[arr[i].ind].titleHb)
                            lsHtmlPart += "<li><a href=\"/i/" + articleSimillars[j].urlShort + "\">" + articleSimillars[j].title + "</a></li>"
                    }

                if (lsHtmlPart.length > 0)
                    simmilarHtml += "<ul>" + lsHtmlPart + "</ul>";
            }



            let dataTp = 0;
            if (items[arr[i].ind].description.length == 0 && items[arr[i].ind].fileUrlSource.length > 0)
                dataTp = 1
            else if (items[arr[i].ind].description.length == 0 && items[arr[i].ind].fileUrlSource.length == 0)
                dataTp = 2

            let timeHtmlPart = "<time>" + dtstrbase + "</time>"
            let authorHtmlPart = ""
            if(uF)
                authorHtmlPart = "<p><a href=\"/i/-" + items[arr[i].ind].login + "\"> · @" + items[arr[i].ind].login.toLowerCase() + "</a></p>"
            
            html += "\
            <li>\
                <article data-titleHb=\"" + items[arr[i].ind].titleHb + "\" class=\"AticleQ\" data-tp=\"" + dataTp + "\">\
                    <div class=\"AticleQTxtBox\">"
            if (dataTp == 2) {
                html += timeHtmlPart
                html += authorHtmlPart
            }
            html += "<h1><a href=\"/i/" + items[arr[i].ind].urlShort + "\">" + items[arr[i].ind].title + "</a></h1>"
            if (dataTp != 2) {
                html += timeHtmlPart
                html += authorHtmlPart
            }

            let bookmarkHtmlPart = ""
            if (window.userRoleId > 0 && window.userRoleId < 255)
                bookmarkHtmlPart = "\
                <a class=\"AticleQHrBookmark\" data-selected=\"false\">\
                    <img />\
                </a>"
                        

            html += "</div>\
                <img data-fileId=\"" + items[arr[i].ind].fileId + "\" data-extension=\"" + items[arr[i].ind].extension + "\" src=\"" + items[arr[i].ind].fileUrlSource + "\" />" + simmilarHtml
            html += "<div class=\"AticleQHr\">\
                        <hr/>\
                    </div>\
                    <div class=\"AticleQHrMenu\">\
                        <a style=\"display:none\">\
                            <img src=\"/PageComponents/itemsPCP/content/menu.png\" />\
                        </a>\
                        " + bookmarkHtmlPart + "\
                        <a class=\"AticleQHrRetweet\" style=\"display:none;\">\
                            <img src=\"/PageComponents/itemsPCP/content/chat-box.png\" />\
                        </a>\
                    </div>\
                    <div class=\"AticleQBtns\">"
                html += "<a style=\"display:none;\">\
                            <img src=\"https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/640px-Flag_of_Russia.svg.png\" />\
                        </a>"
            html += "<a style=\"display:none;\">" + dtstr + "</a>";

            html += "<a style=\"display:none;\" href=\"/i/-" + items[arr[i].ind].login + "\">@" + items[arr[i].ind].login.toUpperCase() + "</a>\
                        <a style=\"display:none;\" " + isBodyHref + " data-isBody=\"" + items[arr[i].ind].isBody + "\">" + isBodyStr + "</a>\
                        <a style=\"display:none;\" class=\"AticleQCommentB\"><img src=\"/PageComponents/itemsPCP/content/message.png\" /><span>0</span></a>"
            html += "</div></article>\
            </li>"
        }
        return html;
    }

    LoadImage() {
        document.querySelectorAll(".AticleQ").forEach(item => {
            let imgT = item.querySelector("img")
            let img = new Image();
            img.id = imgT.getAttribute("data-fileId")
            img.onload = function (e) {
                document.querySelector("img[data-fileId=\"" + img.id + "\"]").style.display = "block";
            }
            img.onerror = function () {
                let target = document.querySelector("img[data-fileId=\"" + img.id + "\"]")
                let src = "https://rt.ink/f/" + img.id + "." + target.getAttribute("data-extension")
                target.setAttribute("src", src)
                let imgQ = new Image();
                imgQ.id = img.id
                imgQ.onload = function () {
                    document.querySelector("img[data-fileId=\"" + imgQ.id + "\"]").style.display = "flex"
                }
                imgQ.src = src

            }
            img.src = imgT.getAttribute("src");

            if (item.querySelector("[data-isbody]").getAttribute("data-isbody") == 1) {
                item.addEventListener("click", async event => {
                    let tg = event.target.closest("article")
                    let body = await ApiGetBody(tg.getAttribute("data-titleHb"));
                    if (body != null && body.length > 0) {
                        let tt = tg.querySelector(".AticleQDescription");
                        tt.setAttribute("data-isBody", 0)
                        tt.innerHTML = body
                    }
                })
            }
        });
    }
}