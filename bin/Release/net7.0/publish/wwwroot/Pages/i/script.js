/*-- Notes --*/

/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

import { ApiUrl, PageHeadsBuild, Session } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from "/PageComponents/HeaderHtmlBox/script.min.js";
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { ArticlesHtmlBox } from "/PageComponents/ArticlesHtmlBox/script.min.js";

let searchHeaderQHtmlBox = new SearchHeaderQHtmlBox();

//-- PageHeadsBuild - start

PageHeadsBuild("News aggregator - RT", "RT - точка сбора самых интересных и актуальных новостей российских онлайн-медиа. \"Картина дня\" формируется автоматически на базе популярности материалов.")

//-- css set

const iPageName = "i";  const iPageUrl = "/Pages/" + iPageName; const iPageUrlContent = iPageUrl + "/content";
let iPageCss = document.createElement("link"); iPageCss.setAttribute("rel", "stylesheet"); iPageCss.setAttribute("href", iPageUrl + "/style.min.css"); document.head.append(iPageCss);

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

let headerHtmlBox = new HeaderHtmlBox()

let HeaderTitle = "RT";
let headerDescriptionName = ""
let placeholder = ""
let subscribType = 0;

if (typeApiPageI == 0) {
    headerDescriptionName = "NEWS";
    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM", "alt": "search" })
    if (Session.RoleId == 0) {
        headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/location.png", "href": "/locations", "id": "LocationBM", "alt": "location" });
        //localStorage.setItem("SessionRefrshRequired", "true")
        //headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/login.png", "href": ApiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + Session.Token + "&RedirectUrl=" + document.URL });
    }
    else headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/category.png", "href": "/users", "alt": "signin" });
}
else if (typeApiPageI == 1) {
    HeaderTitle = ""

    if (Session.RoleId > 0) {
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

            headerHtmlBox.PushMenuRow({ "icon": subscribUrl, "href": "", "id": "SubsribB" });
        }
        else {
            headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/add.png", "href": "" });
            headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/settings.png", "href": "" });
        }
    }

    if (search.split('-').length > 2) {
        let searchSplit = search.split('-')
        for (var i = 2; i < searchSplit.length; i++)
            placeholder += searchSplit[i] + ' '
        placeholder = placeholder.trim().toUpperCase();
    }

    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    let href = "/"
    if (Session.RoleId > 0) href = "/users"
    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/undo.png", "href": href });
}
else if (typeApiPageI == 2) {
    headerDescriptionName = "ARTICLE";

    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/bookmark.png", "id": "BookmarkB" });
    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
}
else if (typeApiPageI == 3) {
    headerDescriptionName = "SEARCH";
    placeholder = search.toUpperCase().replaceAll('-', ' ');

    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    headerHtmlBox.PushMenuRow({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
} 

//--------------------

headerHtmlBox.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", HeaderTitle)

let idxy = "HeaderDescriptionHtmlBox"
if (headerDescriptionName.length > 0)
    new HeaderDescriptionHtmlBox().InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", headerDescriptionName)
else idxy = "HeaderHtmlBox"
searchHeaderQHtmlBox.InsertAdjacentHTML(document.getElementById(idxy), "afterend", placeholder)

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


let articlesHtmlBox = new ArticlesHtmlBox(document.getElementById(idz), "afterend", search, ApiUrl, Session.Token)
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

function _SearchFind() {
    let search = document.querySelector("#" + searchHeaderQHtmlBox.Name + " input").value.toLowerCase();
    if (userLogin.length > 0)
        search = "-" + userLogin + "-" + search
    if (search.length > 0)
        window.location.href = "/i/" + search
}

document.querySelector("#" + searchHeaderQHtmlBox.Name + " > a").addEventListener('click', async () => {
    _SearchFind()
});

document.querySelector("#" + searchHeaderQHtmlBox.Name + " input").addEventListener('keypress', async (event) => {
    if (event.key == "Enter")
        _SearchFind()
});





//-- api actions

async function ApiUserBio(userLogin) {
    const response = await fetch(ApiUrl + "/Base/User/Bio?userLogin=" + userLogin, {
        method: "GET", headers: { "Accept": "application/json", "Authorization": "Bearer " + Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserSubscrib(userLogin) {
    const response = await fetch(ApiUrl + "/Base/User/Subscrib?userLogin=" + userLogin, {
        method: "POST", headers: { "Accept": "application/json", "Authorization": "Bearer " + Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkGet(urlShort) {
    const response = await fetch(ApiUrl + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "GET", headers: { "Authorization": "Bearer " + Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkPost(urlShort) {
    const response = await fetch(ApiUrl + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "POST", headers: { "Authorization": "Bearer " + Session.Token }
    });
    return response.ok
}