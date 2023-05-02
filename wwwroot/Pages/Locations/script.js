import { isTest, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.js';
//import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.js";
import { LocsHtmlBox } from '/PageComponents/LocsHtmlBox/script.js';





const LocationsPageName = "Locations";
const LocationsPageUrl = "/Pages/" + LocationsPageName;
const LocationsPageUrlContent = LocationsPageUrl + "/content";
let LocationsPageCss = document.createElement("link"); LocationsPageCss.setAttribute("rel", "stylesheet"); LocationsPageCss.setAttribute("href", LocationsPageUrl + "/style.css"); document.head.append(LocationsPageCss);
PageHeadsBuild("Locations - RT", "")

let menuList = new Array()
//menuList.push({ "icon": LocationsPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
let href = "/users"
if (RoleId == 0)
    href = "/"
menuList.push({ "icon": LocationsPageUrlContent + "/undo.png", "href": href });

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT", null, menuList, isTest)
new HeaderDescriptionHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "LOCATIONS", "")

//new SearchHeaderQHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "", "", "")

let locsHtmlBox = new LocsHtmlBox(document.getElementById("HeaderDescriptionHtmlBox"), "afterend", apiUrl, authJWToken, RoleId)
await locsHtmlBox.AppendBaseList()




//-- html actions

//document.getElementById("SearchBM").addEventListener('click', async (event) => {
//    document.getElementById("SearchBM").style.display = "none";
//    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
//});
