import { ApiUrl, PageHeadsBuild, Session } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';
import { LocsHtmlBox } from '/PageComponents/LocsHtmlBox/script.min.js';

let headerHtmlBox = new HeaderHtmlBox()
let headerTitleDescriptionHtmlBox = new HeaderTitleDescriptionHtmlBox();

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
headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", "LOCATIONS", "watch & choose")

let locsHtmlBox = new LocsHtmlBox(document.getElementById(headerTitleDescriptionHtmlBox.Name), "afterend", ApiUrl, Session.Token, Session.RoleId)
await locsHtmlBox.AppendList()