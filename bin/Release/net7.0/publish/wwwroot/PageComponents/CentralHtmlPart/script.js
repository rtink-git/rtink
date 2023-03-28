const CentralHtmlPartName = "CentralHtmlPart"
const CentralHtmlPartUrl = "/PageComponents/" + CentralHtmlPartName;

let CentralHtmlPartCss = document.createElement("link"); CentralHtmlPartCss.setAttribute("rel", "stylesheet"); CentralHtmlPartCss.setAttribute("href", CentralHtmlPartUrl + "/style.css"); document.head.append(CentralHtmlPartCss);

window.CentralHtmlPart = class CentralHtmlPart {
    id
    constructor(target, position, imgUrlBorder, imgUrlMain, textMain, urlMain, textSub, urlSub) {
        this.id = CentralHtmlPartName + "-" + Math.floor(Math.random() * 1000000);

        if (urlMain == null || urlMain == undefined || urlMain.length == 0)
            urlMain = document.URL

        let opacity = 1;
        let height = 34;
        let margin = 33
        if (imgUrlBorder == "0") {
            opacity = 0;
            height = 80;
            margin = 10;
        }

        if (imgUrlBorder == null || imgUrlBorder.length == 0 || imgUrlBorder == "0")
            imgUrlBorder = CentralHtmlPartUrl + "/content/loading.gif"
        if (imgUrlMain == null || imgUrlMain.length == 0)
            imgUrlMain = CentralHtmlPartUrl + "/content/404.png" 

        let psub = ""
        if (textSub != null && textSub.length > 0) {
            let asub = "";
            if (urlSub != null && urlSub.length > 0)
                asub = "<a href=\"" + urlSub + "\">" + textSub + "</a>"
            else
                asub = textSub
            psub = "<p class=\"_psub\">" + asub + "</p>"
        }
        let pmain = ""
        if (textMain != null && textMain.length > 0)
            pmain = "<p>" + textMain + "</p>"
        let html = "\
            <div id=\"" + this.id + "\" class=\"" + CentralHtmlPartName + "\">\
                <img src=\"" + imgUrlBorder + "\" style=\"opacity:" + opacity + "\" />\
                <a href=\""+ urlMain + "\"><img src=\"" + imgUrlMain + "\" style=\"height:" + height + "px;width:" + height + "px;margin:" + margin + "px\" /></a>" + pmain + psub + "\
            </div>";

        target.insertAdjacentHTML(position, html)





        //-- script

        let h = 0;
        let tgg = document.getElementById(this.id).previousElementSibling
        if (tgg == null) {
            tgg = document.getElementById(this.id).parentElement
            h = tgg.clientHeight
        }
        else {
            h = document.documentElement.clientHeight - tgg.getBoundingClientRect().bottom
        }

        document.getElementsByClassName(CentralHtmlPartName)[0].style.marginTop = ((h - document.getElementById(this.id).offsetHeight) / 2) + "px";
    }
}