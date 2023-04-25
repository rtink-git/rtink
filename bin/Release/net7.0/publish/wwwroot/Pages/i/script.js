﻿/*-- Notes --*/

/*-- Knowledge Library --*/
/*-- Модули js: https://learn.javascript.ru/modules-intro --*/

/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

import { isTest, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.js";
import { ArticlesHtmlBox } from '/PageComponents/ArticlesHtmlBox/script.js';

//--------------------

const iPageName = "i";  const iPageUrl = "/Pages/" + iPageName; const iPageUrlContent = iPageUrl + "/content";
let iPageCss = document.createElement("link"); iPageCss.setAttribute("rel", "stylesheet"); iPageCss.setAttribute("href", iPageUrl + "/style.css"); document.head.append(iPageCss);
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


let subscribType = 0;
let menuList = new Array()

if (typeApiPageI == 0) {
    //menuList.push({ "icon": iPageUrlContent + "/location.png", "href": "/locations" });
    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    //if (RoleId == 0)
    //    menuList.push({ "icon": iPageUrlContent + "/location.png", "href": "/locations" });
    //else
    menuList.push({ "icon": iPageUrlContent + "/category.png", "href": "/users" });

    //if (RoleId == 0) menuList.push({ "icon": iPageUrlContent + "/login.png", "href": "", "id": "SigninB" });
}
else if (typeApiPageI == 1) {
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
    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    let href = "/users"
    if (RoleId == 0)
        href = "/"
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": href });
}
else if (typeApiPageI == 2) {
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
}
else if (typeApiPageI == 3) {
    menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
    menuList.push({ "icon": iPageUrlContent + "/undo.png", "href": "/" });
} 

if (typeApiPageI == 1) {

}

//--------------------

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT", null, menuList, isTest)

//if (typeApiPageI == 0 && RoleId == 0) {
//    document.getElementById("SigninB").addEventListener('click', async () => {
//        window.location.href = apiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + authJWToken + "&RedirectUrl=" + document.URL //https://localhost:7199/
//    });
//}

let placeholder = ""
//let afterend = "HeaderHtmlBox"
let headerDescriptionName = ""
let headerDescriptionNameSub = ""

if (typeApiPageI == 0) {
    headerDescriptionName = "NEWS";
}
else if (typeApiPageI == 1) {
    if (search.split('-').length > 2) {
        let searchSplit = search.split('-')
        for (var i = 2; i < searchSplit.length; i++)
            placeholder += searchSplit[i] + ' '
        placeholder = placeholder.trim().toUpperCase();
        //placeholder = //search.toUpperCase().replace('-', '@').replace('-', ':  ').replaceAll('-', ' ')
    }
    //else placeholder = search.toUpperCase().replace('-', '@') //+ ": ИЛОН МАСК"
    let userName = search.split('-')[1].toUpperCase()
    headerDescriptionName = userName.substring(0, 4);
    headerDescriptionNameSub = userName.substring(4, userName.length)
}
else if (typeApiPageI == 2) {
    headerDescriptionName = "ARTICLE";
}
else if (typeApiPageI == 3) {
    placeholder = search.toUpperCase().replaceAll('-', ' ');
    headerDescriptionName = "SEARCH";
}

new HeaderDescriptionHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", headerDescriptionName, headerDescriptionNameSub, "Moscow")
new SearchHeaderQHtmlBox(document.getElementById("HeaderDescriptionHtmlBox"), "afterend", placeholder, "", userLogin)

if (typeApiPageI == 1) {
    if (search.split('-').length > 2) {
        document.getElementById("SearchHeaderQHtmlBox").style.display = "block"
        document.getElementById("SearchBM").style.display = "none";
    }
}
else if (typeApiPageI == 3) {
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block"
    document.getElementById("SearchBM").style.display = "none";
}

let articlesHtmlBox = new ArticlesHtmlBox(document.getElementById("SearchHeaderQHtmlBox"), "afterend", search, apiUrl, authJWToken)

////document.getElementById(centralInfHtmlBox.id).remove()

await articlesHtmlBox.ListAppend()





//-- html actions

let prevScrollY = window.scrollY
document.addEventListener('scroll', async (event) => {
    if (window.scrollY >= prevScrollY && document.body.scrollHeight - window.scrollY < document.body.clientHeight + 100) {
        prevScrollY = window.scrollY + 200
        await articlesHtmlBox.ListAppend()
    }
});

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
});

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

//async function ApiPageI(search) {
//    const response = await fetch(apiUrl + "/RtInk/Page/I?search=" + search, {
//        method: "GET",
//        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
//    });
//    if (response.ok === true) return await response.json();
//    return null;
//}

async function ApiUserBio(userLogin) {
    const response = await fetch(apiUrl + "/Base/User/Bio?userLogin=" + userLogin, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserSubscrib(userLogin) {
    const response = await fetch(apiUrl + "/Base/User/Subscrib?userLogin=" + userLogin, {
        method: "POST",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

//--------------------