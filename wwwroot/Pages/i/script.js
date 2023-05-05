/*-- Notes --*/

/*-- Knowledge Library --*/
/*-- Модули js: https://learn.javascript.ru/modules-intro --*/

/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

import { isTest, MinifyExpansion, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from "/PageComponents/HeaderHtmlBox/script.js";
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { ArticlesHtmlBox } from "/PageComponents/ArticlesHtmlBox/script.js";

//-- css

const iPageName = "i";  const iPageUrl = "/Pages/" + iPageName; const iPageUrlContent = iPageUrl + "/content";
let iPageCss = document.createElement("link"); iPageCss.setAttribute("rel", "stylesheet"); iPageCss.setAttribute("href", iPageUrl + "/style.css"); document.head.append(iPageCss);

//--------------------

PageHeadsBuild("News aggregator", "RT - точка сбора самых интересных и актуальных новостей российских онлайн-медиа. \"Картина дня\" формируется автоматически на базе популярности материалов.")

//-- data from url ---

let search = ""
let urlSrplit = document.URL.split('/')
if (urlSrplit.length > 4) search = decodeURIComponent(urlSrplit[4]);

//-- data from server model -----

// 0 - empty url list
// 1 - user page
// 2 - article page
// 3 - search page

let typeApiPageI = 0
let userLogin = ""

if (search.length > 0) {
    let searchSplit = search.split('-')
    if (searchSplit.length > 0)
        if (search[0] == '-') {
            typeApiPageI = 1
            userLogin = searchSplit[1]
        }
        else if (searchSplit.length == 2 && searchSplit[1].length == 0 && search[search.length - 1] == '-')
            typeApiPageI = 2
        else typeApiPageI = 3
}

//--------------------

let HeaderTitle = "";
let headerDescriptionName = ""
let headerDescriptionNameSub = ""
let placeholder = ""
let subscribType = 0;
let menuList = new Array();

if (typeApiPageI == 0) {
    HeaderTitle = "RT"
    headerDescriptionName = "NEWS";

    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM", "alt": "search" });
    if (RoleId == 0) {
        menuList.push({ "icon": iPageUrlContent + "/location.png", "href": "/locations", "id": "LocationBM", "alt": "location" });
        localStorage.setItem("SessionRefrshRequired", "true")
        menuList.push({ "icon": iPageUrlContent + "/login.png", "href": apiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + authJWToken + "&RedirectUrl=" + document.URL });
    }
    else menuList.push({ "icon": iPageUrlContent + "/category.png", "href": "/users", "alt": "signin" });
}
else if (typeApiPageI == 1) {
    if (RoleId > 0) {
        let userBio = await ApiUserBio(userLogin)
        subscribType = userBio.sbt
        if (subscribType != 1) {
            let subscribUrl = iPageUrlContent + "/doubleCheckBlackBlack.png"
            if (subscribType == 2)
                subscribUrl = iPageUrlContent + "/doubleCheckBlackRed.png"
            else if (subscribType == 3)
                subscribUrl = iPageUrlContent + "/doubleCheckRedBlack.png"
            else if (subscribType == 4)
                subscribUrl = iPageUrlContent + "/doubleCheckRedRed.png"

            menuList.push({ "icon": subscribUrl, "href": "", "id": "SubsribB" });
        }
        else {
            menuList.push({ "icon": iPageUrlContent + "/add.png", "href": "" });
            menuList.push({ "icon": iPageUrlContent + "/settings.png", "href": "" });
        }
    }

    if (search.split('-').length > 2) {
        let searchSplit = search.split('-')
        for (var i = 2; i < searchSplit.length; i++)
            placeholder += searchSplit[i] + ' '
        placeholder = placeholder.trim().toUpperCase();
    }

    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    let href = "/"
    if (RoleId > 0) href = "/users"
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": href });
}
else if (typeApiPageI == 2) {
    menuList.push({ "icon": iPageUrlContent + "/bookmark.png", "id": "BookmarkB" });
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
}
else if (typeApiPageI == 3) {
    placeholder = search.toUpperCase().replaceAll('-', ' ');
    HeaderTitle = "RT"
    headerDescriptionName = "SEARCH";

    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
} 

//--------------------

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", HeaderTitle, null, menuList, isTest, MinifyExpansion)


let idxy = "HeaderDescriptionHtmlBox"
if (headerDescriptionName.length > 0)
    new HeaderDescriptionHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", headerDescriptionName, headerDescriptionNameSub, "Moscow", MinifyExpansion);
else 
    idxy = "HeaderHtmlBox"
new SearchHeaderQHtmlBox(document.getElementById(idxy), "afterend", placeholder, "", userLogin, MinifyExpansion)

if (typeApiPageI == 1) {
    if (search.split('-').length > 2) {
        document.getElementById("SearchHeaderQHtmlBox").style.display = "block"
        document.getElementById("SearchBM").style.display = "none";
    }
}
else if (typeApiPageI == 2)
{
    let apiArticleBookmarkJson = await ApiArticleBookmarkGet(search.substring(0, search.length - 1))
    if (apiArticleBookmarkJson.ok)
        document.getElementById("BookmarkB").querySelector("img").setAttribute("src", iPageUrlContent + "/bookmarkSelected.png")
    else
        document.getElementById("BookmarkB").querySelector("img").setAttribute("src", iPageUrlContent + "/bookmark.png")
}
else if (typeApiPageI == 3) {
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block"
    document.getElementById("SearchBM").style.display = "none";
}


let idz = "SearchHeaderQHtmlBox"
if (userLogin.length > 0) {
    let htmlUserQ = "\
    <div id=\"H1QHtmlBox\">\
        <div>\
            <h1>\
                <span>\
                " + userLogin.toUpperCase() + "\
                </span>\
            </h1>\
            <p>\
                user profile\
            </p>\
        </div>\
    </div>\
    "

    document.getElementById("SearchHeaderQHtmlBox").insertAdjacentHTML("afterend", htmlUserQ)
    idz = "H1QHtmlBox"
}


let articlesHtmlBox = new ArticlesHtmlBox(document.getElementById(idz), "afterend", search, apiUrl, authJWToken, MinifyExpansion)
await articlesHtmlBox.AppendList()





//-- html actions

if (document.getElementById("BookmarkB") != null)
    document.getElementById("BookmarkB").addEventListener('click', async (event) => {
        let apiArticleBookmarkJson = await ApiArticleBookmarkPost(search.substring(0, search.length - 1))
        if (apiArticleBookmarkJson)
            if (document.getElementById("BookmarkB").querySelector("img").getAttribute("src") == iPageUrlContent + "/bookmark.png")
                document.getElementById("BookmarkB").querySelector("img").setAttribute("src", iPageUrlContent + "/bookmarkSelected.png")
            else
                document.getElementById("BookmarkB").querySelector("img").setAttribute("src", iPageUrlContent + "/bookmark.png")
    });

let prevScrollY = window.scrollY
document.addEventListener('scroll', async (event) => {
    if (window.scrollY >= prevScrollY && document.body.scrollHeight - window.scrollY < document.body.clientHeight + 100) {
        prevScrollY = window.scrollY + 200
        await articlesHtmlBox.AppendList()
    }
});

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
});

if (document.getElementById("SubsribB") != null)
    document.getElementById("SubsribB").addEventListener('click', async (event) => {
        let userSubscrib = await ApiUserSubscrib(userLogin)

        if (userSubscrib.ok) {
            if (subscribType == 0) {
                subscribType = 2
                document.querySelector("#SubsribB img").setAttribute("src", iPageUrlContent + "/doubleCheckBlackRed.png");
            }
            else if (subscribType == 2) {
                subscribType = 0
                document.querySelector("#SubsribB img").setAttribute("src", iPageUrlContent + "/doubleCheckBlackBlack.png");
            }
            else if (subscribType == 3) {
                subscribType = 4
                document.querySelector("#SubsribB img").setAttribute("src", iPageUrlContent + "/doubleCheckRedRed.png");
            }
            else if (subscribType == 4) {
                subscribType = 3
                document.querySelector("#SubsribB img").setAttribute("src", iPageUrlContent + "/doubleCheckRedBlack.png");
            }
        }
    });





//-- api actions

async function ApiUserBio(userLogin) {
    const response = await fetch(apiUrl + "/Base/User/Bio?userLogin=" + userLogin, {
        method: "GET", headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserSubscrib(userLogin) {
    const response = await fetch(apiUrl + "/Base/User/Subscrib?userLogin=" + userLogin, {
        method: "POST", headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkGet(urlShort) {
    const response = await fetch(apiUrl + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "GET", headers: { "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkPost(urlShort) {
    const response = await fetch(apiUrl + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "POST", headers: { "Authorization": "Bearer " + authJWToken }
    });
    return response.ok
}