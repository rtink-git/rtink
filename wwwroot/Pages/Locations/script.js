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
let UserAsLocations = await ApiUserAsLocations();
UserAsLocations.forEach(e => { LocationList.push(e) })

let UserLocationLoginList = new Array();
let UserLocationLogins = await ApiUserLocationLogins()
UserLocationLogins.forEach(e => { UserLocationLoginList.push(e) })

document.getElementById("HeaderDescriptionHtmlBox").insertAdjacentHTML("afterend", LocationsCheckedHtmlPart())
document.getElementById("LocationsCheckedHtmlPart").insertAdjacentHTML("afterend", LocationsHtmlPart())




//-- html parts

function LocationsCheckedHtmlPart() {
    let html = "\
    <div id=\"LocationsCheckedHtmlPart\" class=\"LocationBox\">\
        <div>\
        </div>\
    </div>"

    return html;
}

function LocationsCheckedHtmlPartAppendItem(e)
{
    let html = "\
        <div data-login=\"" + e.login + "\">\
            <div>\
                <span>\
                " + e.login + "\
                </span>\
            </div>\
            <a class=\"_close\">\
                <img src=\"" + LocationsPageUrlContent + "/close.png\" />\
            </a>\
        </div>"

    document.querySelector("#LocationsCheckedHtmlPart > *").insertAdjacentHTML("beforeend", html)
}

UserLocationLoginList.forEach(e => {
    LocationsCheckedHtmlPartAppendItem(e)
})

function LocationsHtmlPart() {
    let html = "";

    if (LocationList.length > 0)
        html = "\
        <div id=\"LocationsHtmlPart\" class=\"LocationBox\">\
            <div>\
            </div>\
        </div>"

    return html
}

function LocationsHtmlPartAppendItem(e) {
    let html = "\
        <div data-login=\"" + e.login + "\">\
            <div>\
                <span>\
                " + e.login + "\
                </span>\
            </div>\
            <a class=\"_check\">\
                <img src=\"" + LocationsPageUrlContent + "/check.png\" />\
            </a>\
        </div>"

    document.querySelector("#LocationsHtmlPart > *").insertAdjacentHTML("beforeend", html)

    let tg = document.querySelector("#LocationsHtmlPart > * > *:last-child")

    tg.addEventListener('click', async (event) => {
        let login = event.target.closest("div").getAttribute("data-login")

        let userSubscriptionSet = await ApiUserSubscriptionSet(login)
        if (userSubscriptionSet.ok) {
            let html = "\
            <div data-login=\"" + login + "\">\
                <div>\
                    <span>\
                    " + login + "\
                    </span>\
                </div>\
                <a class=\"_close\">\
                    <img src=\"" + LocationsPageUrlContent + "/close.png\" />\
                </a>\
            </div>"

            document.querySelector("#LocationsCheckedHtmlPart > *").insertAdjacentHTML("beforeend", html)
        }
    })
}

LocationList.forEach(e => {
    LocationsHtmlPartAppendItem(e)
})

//-- html actions





//-- api actions

async function ApiUserAsLocations() {
    const response = await fetch(apiUrl + "/RtInk/UserAsLocations", {
        method: "GET"
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserSubscriptionSet(login) {
    const response = await fetch(apiUrl + "/RtInk/UserSubscriptionSet?userLogin=" + login, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserLocationLogins() {
    const response = await fetch(apiUrl + "/RtInk/UserLocationLogins", {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

//--------------------