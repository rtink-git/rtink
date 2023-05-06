import { ApiUrl, PageHeadsBuild, Session } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { LocsHtmlBox } from '/PageComponents/LocsHtmlBox/script.min.js';

let headerHtmlBox = new HeaderHtmlBox()

const LocationsPageName = "Locations";
const LocationsPageUrl = "/Pages/" + LocationsPageName;
const LocationsPageUrlContent = LocationsPageUrl + "/content";
let LocationsPageCss = document.createElement("link"); LocationsPageCss.setAttribute("rel", "stylesheet"); LocationsPageCss.setAttribute("href", LocationsPageUrl + "/style.min.css"); document.head.append(LocationsPageCss);
PageHeadsBuild("Locations - RT", "")



let href = "/users"
if (Session.RoleId == 0)
    href = "/"
headerHtmlBox.PushMenuRow({ "icon": LocationsPageUrlContent + "/undo.png", "href": href })
headerHtmlBox.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")

let htmlQ = "\
<div id=\"H1QHtmlBox\">\
    <div>\
        <h1>\
            <span>\
                LOCATIONS\
            </span>\
        </h1>\
        <p>\
            watch & choose\
        </p>\
    </div>\
</div>\
"

document.getElementById("HeaderHtmlBox").insertAdjacentHTML("afterend", htmlQ)

let locsHtmlBox = new LocsHtmlBox(document.getElementById("H1QHtmlBox"), "afterend", ApiUrl, Session.Token, Session.RoleId)
await locsHtmlBox.AppendList()