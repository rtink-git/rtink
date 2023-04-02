/*-- Notes --*/

/*-- Knowledge Library --*/
/*-- Модули js: https://learn.javascript.ru/modules-intro --*/

/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

//, roleId, , 

import { isTest, apiUrl, PageHeadsBuild, authJWToken } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
//import { HeaderUnderQHtmlBox } from '/PageComponents/HeaderUnderQHtmlBox/script.js';
import { SearchHeaderHtmlBox } from "/PageComponents/SearchHeaderHtmlBox/script.js";
//import { CentralInfHtmlBox } from '/PageComponents/CentralInfHtmlBox/script.js';
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

if(search.length > 0)
{
    let searchSplit = search.split('-')
    if (searchSplit.length > 0)
        if (search[0] == '-') {
            typeApiPageI = 1
        }
        else if (searchSplit.length == 2 && searchSplit[1].length == 0 && search[search.length - 1] == '-')
            typeApiPageI = 2
        else {
            typeApiPageI = 3
        }
}

//--------------------

let apiPageI = await ApiPageI(search)
let roleId = apiPageI.id

    
let menuList = new Array()

if (roleId > 0)
    menuList.push({ "icon": iPageUrlContent + "/category.png", "href": "/list" })

if (typeApiPageI == 0) {
    //menuList.push({ "icon": iPageUrlContent + "/search.png", "href": "", "id": "SearchB" });
    if (roleId == 0) menuList.push({ "icon": iPageUrlContent + "/login.png", "href": "", "id": "SigninB" });
}
else if (typeApiPageI == 1) {
}
else if (typeApiPageI == 2) {
}
else if (typeApiPageI == 3) {
}

////--------------------

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT NEWS", null, menuList, isTest)

let placeholder = "NEWS AGGREGATOR"

if (typeApiPageI == 0) { }
else if (typeApiPageI == 1) {
    if (search.split('-').length > 2) placeholder = search.toUpperCase().replace('-', '@').replace('-', ':  ').replaceAll('-', ' ')
    else placeholder = search.toUpperCase().replace('-', '@') + ": ИЛОН МАСК"
}
else if (typeApiPageI == 3) placeholder = search.toUpperCase().replaceAll('-', ' ')
new SearchHeaderHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", placeholder, "НАЙДЕТСЯ ВСЁ")

////let centralInfHtmlBox = new CentralInfHtmlBox(document.getElementById("HeaderUnderHtmlBox"), "afterend", 100, null, 90, 0.3, null, 70, 0.1, "LOADING", document.URL, null, null)
let articlesHtmlBox = new ArticlesHtmlBox(document.getElementById("SearchHeaderHtmlBox"), "afterend", search, apiUrl, authJWToken, isTest)

////document.getElementById(centralInfHtmlBox.id).remove()

await articlesHtmlBox.ListAppend()

////if (articlesHtmlBox.listN == 0) {
////    new CentralInfHtmlBox(document.getElementById("HeaderUnderHtmlBox"), "afterend", 110, null, 90, 0, "/PageComponents/CentralInfHtmlBox/content/404.png", 60, 0.3, "NOTHING FOUND", document.URL, null, null)
////}
////else {

////}





//-- html actions

//if (document.getElementById("SigninB") != null)
//    document.getElementById("SigninB").addEventListener('click', async () => {
//        let roleIdStr = "roleId"
//        localStorage.setItem(roleIdStr, -1)
//        window.location.href = apiUrl + "/Authorization/Signin/Google/" + authJWToken
//    });

//-- api actions

async function ApiPageI(search) {
    const response = await fetch(apiUrl + "/RtInk/Page/I?search=" + search, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}

//--------------------