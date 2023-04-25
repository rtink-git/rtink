//-- Tasks
//-- 2023-04-17 Add user page as first page
//-- 2023-04-17 First row - your user page
//-- 2023-04-17 Location user icon

import { isTest, apiUrl, PageHeadsBuild, authJWToken, RoleId } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.js";
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
    localStorage.setItem("SessionRefrshRequired", "true")
    menuList.push({ "icon": UsersPageUrlContent + "/login.png", "href": apiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + authJWToken + "&RedirectUrl=" + document.URL });
}
else {
    var userLoginJson = await ApiGetUserLogin()
                    //document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(userLoginJson.login, 0, ''))
                    //this.#SettingsButtonHtmlBox(userLoginJson.login)

    menuList.push({ "icon": UsersPageUrlContent + "/user.png", "href": "/i/-" + userLoginJson.login });
}
menuList.push({ "icon": UsersPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
menuList.push({ "icon": UsersPageUrlContent + "/undo.png", "href": "/" });

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT / USERS", null, menuList, isTest)
new SearchHeaderQHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "", "", "")

let usersHtmlBox = new UsersHtmlBox(document.getElementById("SearchHeaderQHtmlBox"), "afterend", apiUrl, authJWToken, RoleId)
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