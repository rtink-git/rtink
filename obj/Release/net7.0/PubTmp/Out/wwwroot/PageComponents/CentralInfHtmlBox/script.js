export class CentralInfHtmlBox {
    id
    constructor(target, position, boxSize, imgBorderUrl, imgBorderPercent, imgBorderOpaciy, imgCenterUrl, imgCenterPercent, imgCenterOpacity, textMain, textMainUrl, textSub, textSubUrl) {
        let name = "CentralInfHtmlBox"
        let url = "/PageComponents/" + name;
        let urlContent = "/PageComponents/" + name + "/content";
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);

        this.id = name + "-" + Math.floor(Math.random() * 1000000);

        if (boxSize == null && boxSize == undefined)
            boxSize = 200
        if (imgBorderUrl == null && imgBorderUrl == undefined)
            imgBorderUrl = urlContent + "/loading.gif"
        if (imgBorderPercent == null || imgBorderPercent == undefined)
            imgBorderPercent = 100;
        let imgBorderPercentMargin = (100 - imgBorderPercent) / 2
        if (imgBorderOpaciy == null || imgBorderOpaciy == undefined)
            imgBorderOpaciy = 1;
        if (imgCenterUrl == null || imgCenterUrl == undefined)
            imgCenterUrl = urlContent + "/loop.png";
        if (imgCenterPercent == null || imgCenterPercent == undefined)
            imgCenterPercent = 100;
        let imgCenterPercentMargin = (100 - imgCenterPercent) / 2
        if (imgCenterOpacity == null || imgCenterOpacity == undefined)
            imgCenterOpacity = 1;
        let imgCenterPercentMarginTop = (imgBorderPercent - imgCenterPercent) / 2
        let textMainDisplay = ""
        if (textMain == null && textMain == undefined)
            textMainDisplay = "display:none;"
        let textMainHref = "href=\"" + textMainUrl + "\""
        if (textMainUrl == null && textMainUrl == undefined)
            textMainHref = ""
        let textSubDisplay = ""
        if (textSub == null && textSub == undefined)
            textSubDisplay = "display:none;"
        let textSubHref = "href=\"" + textSubUrl + "\""
        if (textSubUrl == null && textSubUrl == undefined)
            textSubHref = ""

        let html = "\
        <div id=\"" + this.id + "\" class=\"" + name + "\" style=\"width:" + boxSize +"px\">\
            <a>\
                <img src=\"" + imgBorderUrl + "\" style=\"width:" + imgBorderPercent + "%;margin-left:" + imgBorderPercentMargin + "%;margin-right:" + imgBorderPercentMargin + "%;opacity:" + imgBorderOpaciy + "\">\
                <img src=\"" + imgCenterUrl + "\" style=\"width:" + imgCenterPercent + "%;margin-left:" + imgCenterPercentMargin + "%;margin-right:" + imgCenterPercentMargin + "%;opacity:" + imgCenterOpacity + ";margin-top:" + imgCenterPercentMarginTop + "%\">\
            </a>\
            <a " + textMainHref + " style=\"" + textMainDisplay + "\">\
                " + textMain + "\
            </a>\
            <a " + textSubHref + " style=\"" + textSubDisplay + "\">\
                " + textSub + "\
            </a>\
        </div>"

        target.insertAdjacentHTML(position, html)


        //-- script

        let h = 0;
        if (position != "afterend") h = document.getElementById(this.id).parentElement.clientHeight
        else h = document.documentElement.clientHeight - document.getElementById(this.id).previousElementSibling.getBoundingClientRect().bottom

        document.getElementsByClassName(name)[0].style.marginTop = ((h - document.getElementById(this.id).offsetHeight) / 2) + "px";
    }
}