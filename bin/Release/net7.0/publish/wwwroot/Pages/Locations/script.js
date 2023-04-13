import { isTest, apiUrl, PageHeadsBuild, authJWToken } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.js';


const LocationsPageName = "Locations";
const LocationsPageUrl = "/Pages/" + LocationsPageName;
const LocationsPageUrlContent = LocationsPageUrl + "/content";
let LocationsPageCss = document.createElement("link"); LocationsPageCss.setAttribute("rel", "stylesheet"); LocationsPageCss.setAttribute("href", LocationsPageUrl + "/style.css"); document.head.append(LocationsPageCss);
PageHeadsBuild("Locations - RT", "")

let menuList = new Array()
menuList.push({ "icon": LocationsPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
menuList.push({ "icon": LocationsPageUrlContent + "/undo.png", "href": "/" });

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT", null, menuList, isTest)
new HeaderDescriptionHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "LOCATIONS", "", "")

//----------

let LocationList = new Array();

//if (isTest) LocationList = LocationListAsTest()
//else { }

let UserAsLocations = await ApiUserAsLocations();
UserAsLocations.forEach(e => { LocationList.push(e) })

document.getElementById("HeaderDescriptionHtmlBox").insertAdjacentHTML("afterend", LocationsHtmlPart())



function LocationsHtmlPart() {
    let listHtml = ""
    LocationList.forEach(e => {
        listHtml += "\
        <div>\
            <div>\
                <span>\
                " + e.login + "\
                </span>\
            </div>\
            <a>\
                <img src=\"" + LocationsPageUrlContent + "/check.png\" />\
            </a>\
        </div>"
    })

    let html = "\
    <div id=\"LocationsHtmlPart\">\
        <div>\
        " + listHtml + "\
        </div>\
    </div>"

    return html
}

//function LocationListAsTest() {
//    let locationList = new Array();

//    locationList.push({ "title": "Canada", "login": "canada", "parentId": "0" });
//    locationList.push({ "title": "China", "login": "china", "parentId": "0" });
//    locationList.push({ "title": "France", "login": "france", "parentId": "0" });
//    locationList.push({ "title": "Germany", "login": "germany", "parentId": "0" });
//    locationList.push({ "title": "India", "login": "india", "parentId": "0" });
//    locationList.push({ "title": "Italy", "login": "italy", "parentId": "0" });
//    locationList.push({ "title": "Japan", "login": "japan", "parentId": "0" });
//    locationList.push({ "title": "Norway", "login": "norway", "parentId": "0" });
//    locationList.push({ "title": "Russia", "login": "russia", "parentId": "0" });
//    locationList.push({ "title": "Spain", "login": "spain", "parentId": "0" });
//    locationList.push({ "title": "Turkey", "login": "turkey", "parentId": "0" });
//    locationList.push({ "title": "United Kingdom", "login": "uk", "parentId": "0" });
//    locationList.push({ "title": "United States", "login": "usa", "parentId": "0" });

//    return locationList;
//}




//-- api actions

async function ApiUserAsLocations() {
    const response = await fetch(apiUrl + "/RtInk/UserAsLocations", {
        method: "GET"
    });
    if (response.ok === true) return await response.json();
    return null;
}

//--------------------