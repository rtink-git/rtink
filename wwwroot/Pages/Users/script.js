//-- Tasks
//-- 2023-04-17 Add user page as first page
//-- 2023-04-17 First row - your user page
//-- 2023-04-17 Location user icon

import { IsDebug, ApiUrl, MinifiedCode, PageHeadsBuild, Session } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { UsersHtmlBox } from '/PageComponents/UsersHtmlBox/script.min.js';

let headerHtmlBox = new HeaderHtmlBox(MinifiedCode)
let searchHeaderQHtmlBox = new SearchHeaderQHtmlBox(MinifiedCode);
let headerTitleDescriptionHtmlBox = new HeaderTitleDescriptionHtmlBox(MinifiedCode);

//--------------------

const UsersPageName = "Users"; 
const UsersPageUrl = "/Pages/" + UsersPageName;
const UsersPageUrlContent = UsersPageUrl + "/content";
let UsersPageCss = document.createElement("link"); UsersPageCss.setAttribute("rel", "stylesheet"); UsersPageCss.setAttribute("href", UsersPageUrl + "/style.css"); document.head.append(UsersPageCss);

PageHeadsBuild("Users - RT", "")


//let userLogin = "";
if (Session.RoleId > 0) {
    if (Session.RoleId == 2)
        headerHtmlBox.PushMenuRow({ "icon": UsersPageUrlContent + "/add.png", "href": "/user/add", "alt": "add" });
    headerHtmlBox.PushMenuRow({ "icon": UsersPageUrlContent + "/location.png", "href": "/locations", "id": "LocationBM", "alt": "location" });
}
headerHtmlBox.PushMenuRow({ "icon": UsersPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
headerHtmlBox.PushMenuRow({ "icon": UsersPageUrlContent + "/undo.png", "href": "/" });

headerHtmlBox.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", "USERS", "watch & choose")
searchHeaderQHtmlBox.InsertAdjacentHTML(document.getElementById("HeaderTitleDescriptionHtmlBox"), "afterend", "")


let usersHtmlBox = new UsersHtmlBox(document.getElementById("SearchHeaderQHtmlBox"), "afterend", ApiUrl, Session.Token, Session.RoleId, MinifiedCode)
await usersHtmlBox.AppendList() 
if (Session.RoleId > 0) {
    var userLoginJson = await ApiGetUserLogin()
    usersHtmlBox.AppendItem(userLoginJson.login, 0, "321")
}





//-- html actions

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
    document.getElementById("LocationBM").style.display = "block"
});

//if (document.getElementById(usersHtmlBox.Name) != null)
//    document.getElementById("MoreButtonHtmlBox").addEventListener('click', async (event) => {
//        await usersHtmlBox.AppendList()
//    });

let prevScrollY = window.scrollY
document.addEventListener('scroll', async (event) => {
    if (window.scrollY >= prevScrollY && document.body.scrollHeight - window.scrollY < document.body.clientHeight + 100) {
        prevScrollY = window.scrollY + 200
        await usersHtmlBox.AppendList()
    }
});





//-- api actions

async function ApiGetUserLogin() {
    const response = await fetch(ApiUrl + "/Base/User/Login", {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + Session.Token }
    });
    if (response.ok === true) { return await response.json(); }
    return null;
}