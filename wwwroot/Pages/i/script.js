/*-- Notes --*/

/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

import { Page } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from "/PageComponents/HeaderHtmlBox/script.min.js";
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.min.js';
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { ArticlesHtmlBox } from "/PageComponents/ArticlesHtmlBox/script.min.js";

let PageModuleUse = new Page({ name: "i", title: "News aggregator - RT", description: "RT - точка сбора самых интересных и актуальных новостей российских онлайн-медиа. \"Картина дня\" формируется автоматически на базе популярности материалов." })
await PageModuleUse.Build();

let HeaderHtmlBoxModuleUse = new HeaderHtmlBox(PageModuleUse.MinifiedCode)
let HeaderTitleDescriptionHtmlBoxModuleUse = new HeaderTitleDescriptionHtmlBox(PageModuleUse.MinifiedCode);
let SearchHeaderQHtmlBoxModuleUse = new SearchHeaderQHtmlBox(PageModuleUse.MinifiedCode);

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

let HeaderTitle = "RT";
let headerDescriptionName = ""
let placeholder = ""
let subscribType = 0;
let userTitle = "";
let userDescription = "";

if (typeApiPageI == 0) {
    headerDescriptionName = "NEWS";
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/search.png", "href": "", "id": "SearchBM", "alt": "search" })

    if (PageModuleUse.Session.RoleId == 0) {
        HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/location.png", "href": "/locations", "id": "LocationBM", "alt": "location" });
        localStorage.setItem("SessionRefrshRequired", "true")
        HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/login.png", "href": PageModuleUse.UrlApi + "/Base/Authorization/Signin/Google?SessionToken=" + PageModuleUse.Session.Token + "&RedirectUrl=" + document.URL });
    }
    else HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/category.png", "href": "/users", "alt": "signin" });
}
else if (typeApiPageI == 1) {
    HeaderTitle = ""
    let userBio = await ApiUserBio(userLogin)
    subscribType = userBio.sbt
    userTitle = userBio.title;
    userDescription = userBio.description;

    if (PageModuleUse.Session.RoleId > 0) {
        if (subscribType != 1) {
            let subscribUrl = PageModuleUse.UrlContent + "/doubleCheckBlackBlack.png"
            if (subscribType == 2)
                subscribUrl = PageModuleUse.UrlContent + "/doubleCheckBlackRed.png"
            else if (subscribType == 3)
                subscribUrl = PageModuleUse.UrlContent + "/doubleCheckRedBlack.png"
            else if (subscribType == 4)
                subscribUrl = PageModuleUse.UrlContent + "/doubleCheckRedRed.png"

            HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": subscribUrl, "href": "", "id": "SubsribB" });
        }
        else {
            HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/add.png", "href": "" });
            HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/settings.png", "href": "" });
        }
    }

    if (search.split('-').length > 2) {
        let searchSplit = search.split('-')
        for (var i = 2; i < searchSplit.length; i++)
            placeholder += searchSplit[i] + ' '
        placeholder = placeholder.trim().toUpperCase();
    }

    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/search.png", "href": "", "id": "SearchBM" });
    let href = "/"
    if (PageModuleUse.Session.RoleId > 0) href = "/users"
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": href });
}
else if (typeApiPageI == 2) {
    HeaderHtmlBoxModuleUse = "ARTICLE";

    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/bookmark.png", "id": "BookmarkB" });
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/" });
}
else if (typeApiPageI == 3) {
    headerDescriptionName = "SEARCH";
    placeholder = search.toUpperCase().replaceAll('-', ' ');

    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/search.png", "href": "", "id": "SearchBM" });
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/" });
} 

//--------------------

HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", HeaderTitle)

let idxy = "HeaderDescriptionHtmlBox"
if (headerDescriptionName.length > 0)
    new HeaderDescriptionHtmlBox(PageModuleUse.MinifiedCode).InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", headerDescriptionName)
else idxy = "HeaderHtmlBox"
SearchHeaderQHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementById(idxy), "afterend", placeholder)

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
        document.getElementById("BookmarkB").querySelector("img").setAttribute("src", PageModuleUse.UrlContent + "/bookmarkSelected.png")
    else
        document.getElementById("BookmarkB").querySelector("img").setAttribute("src", PageModuleUse.UrlContent + "/bookmark.png")
}
else if (typeApiPageI == 3) {
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block"
    document.getElementById("SearchBM").style.display = "none";
}

//--------------------

let prevBoxName = "SearchHeaderQHtmlBox"
if (userLogin.length > 0) {
    if (userTitle == "")
        userTitle = userLogin.toUpperCase()
    if (userDescription == "")
        userDescription = "User and his articles."

    if (PageModuleUse.Session.RoleId == 2)
        userDescription += " <a href=\"/user/edit/" + userLogin + "\">Edit profile</a>"


    HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementById("SearchHeaderQHtmlBox"), "afterend", userTitle.toUpperCase(), userDescription)
    prevBoxName = HeaderTitleDescriptionHtmlBoxModuleUse.Name
}

//--------------------

let articlesHtmlBox = new ArticlesHtmlBox(document.getElementById(prevBoxName), "afterend", search, PageModuleUse)
await articlesHtmlBox.AppendList()





//-- html actions

if (document.getElementById("BookmarkB") != null)
    document.getElementById("BookmarkB").addEventListener('click', async (event) => {
        let apiArticleBookmarkJson = await ApiArticleBookmarkPost(search.substring(0, search.length - 1))
        if (apiArticleBookmarkJson)
            if (document.getElementById("BookmarkB").querySelector("img").getAttribute("src") == PageModuleUse.UrlContent + "/bookmark.png")
                document.getElementById("BookmarkB").querySelector("img").setAttribute("src", PageModuleUse.UrlContent + "/bookmarkSelected.png")
            else
                document.getElementById("BookmarkB").querySelector("img").setAttribute("src", PageModuleUse.UrlContent + "/bookmark.png")
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
    const response = await fetch(PageModuleUse.UrlApi + "/RtInk/User?userLogin=" + userLogin, {
        method: "GET", headers: { "Accept": "application/json", "Authorization": "Bearer " + PageModuleUse.Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserSubscrib(userLogin) {
    const response = await fetch(PageModuleUse.UrlApi + "/Base/User/Subscrib?userLogin=" + userLogin, {
        method: "POST", headers: { "Accept": "application/json", "Authorization": "Bearer " + PageModuleUse.Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkGet(urlShort) {
    const response = await fetch(PageModuleUse.UrlApi + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "GET", headers: { "Authorization": "Bearer " + PageModuleUse.Session.Token }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiArticleBookmarkPost(urlShort) {
    const response = await fetch(PageModuleUse.UrlApi + "/RtInk/ArticleBookmark?urlShort=" + urlShort, {
        method: "POST", headers: { "Authorization": "Bearer " + PageModuleUse.Session.Token }
    });
    return response.ok
}