import { isTest, MinifyExpansion, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { LocsHtmlBox } from '/PageComponents/LocsHtmlBox/script.js';



const LocationsPageName = "Locations";
const LocationsPageUrl = "/Pages/" + LocationsPageName;
const LocationsPageUrlContent = LocationsPageUrl + "/content";
let LocationsPageCss = document.createElement("link"); LocationsPageCss.setAttribute("rel", "stylesheet"); LocationsPageCss.setAttribute("href", LocationsPageUrl + "/style.css"); document.head.append(LocationsPageCss);
PageHeadsBuild("Locations - RT", "")

let headerHtmlBox = new HeaderHtmlBox()


let href = "/users"
if (RoleId == 0)
    href = "/"
headerHtmlBox.PushMenuRow({ "icon": LocationsPageUrlContent + "/undo.png", "href": href });

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

let locsHtmlBox = new LocsHtmlBox(document.getElementById("H1QHtmlBox"), "afterend", apiUrl, authJWToken, RoleId, MinifyExpansion)
await locsHtmlBox.AppendBaseList()