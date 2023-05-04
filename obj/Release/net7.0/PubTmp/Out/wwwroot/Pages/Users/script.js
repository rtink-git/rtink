//-- Tasks
//-- 2023-04-17 Add user page as first page
//-- 2023-04-17 First row - your user page
//-- 2023-04-17 Location user icon

import { isTest, MinifyExpansion, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { UsersHtmlBox } from '/PageComponents/UsersHtmlBox/script.js';

//--------------------

const UsersPageName = "Users";
const UsersPageUrl = "/Pages/" + UsersPageName;
const UsersPageUrlContent = UsersPageUrl + "/content";
let UsersPageCss = document.createElement("link"); UsersPageCss.setAttribute("rel", "stylesheet"); UsersPageCss.setAttribute("href", UsersPageUrl + "/style.css"); document.head.append(UsersPageCss);
PageHeadsBuild("Users - RT", "")

let menuList = new Array()
menuList.push({ "icon": UsersPageUrlContent + "/location.png", "href": "/locations", "id": "LocationBM" });
if (RoleId == 0) {
}
else {
    var userLoginJson = await ApiGetUserLogin()
    menuList.push({ "icon": UsersPageUrlContent + "/user.png", "href": "/i/-" + userLoginJson.login });
}
menuList.push({ "icon": UsersPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
menuList.push({ "icon": UsersPageUrlContent + "/undo.png", "href": "/" });

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT / USERS", null, menuList, isTest)
new SearchHeaderQHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "", "", "", MinifyExpansion)

let usersHtmlBox = new UsersHtmlBox(document.getElementById("SearchHeaderQHtmlBox"), "afterend", apiUrl, authJWToken, RoleId, MinifyExpansion)
await usersHtmlBox.AppendList()





//-- html actions

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
    document.getElementById("LocationBM").style.display = "block"
});

if (document.getElementById(usersHtmlBox.Name) != null) {
    document.getElementById("MoreButtonHtmlBox").addEventListener('click', async (event) => {
        await usersHtmlBox.AppendList()
    });
}

let prevScrollY = window.scrollY
document.addEventListener('scroll', async (event) => {
    if (window.scrollY >= prevScrollY && document.body.scrollHeight - window.scrollY < document.body.clientHeight + 100) {
        prevScrollY = window.scrollY + 200
        await usersHtmlBox.AppendList()
    }
});





//-- api actions

async function ApiGetUserLogin() {
    const response = await fetch(apiUrl + "/Base/User/Login", {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) { return await response.json(); }
    return null;
}