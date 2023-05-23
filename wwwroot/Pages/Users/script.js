//-- Tasks
//-- 2023-04-17 Add user page as first page
//-- 2023-04-17 First row - your user page
//-- 2023-04-17 Location user icon

import { Page } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.min.js";
import { UsersHtmlBox } from '/PageComponents/UsersHtmlBox/script.min.js';

let PageModuleUse = new Page({ name: "Users", title: "Users - RT" })
await PageModuleUse.Build();
let HeaderHtmlBoxModuleUse = new HeaderHtmlBox(PageModuleUse.MinifiedCode)
let HeaderTitleDescriptionHtmlBoxModuleUse = new HeaderTitleDescriptionHtmlBox(PageModuleUse.MinifiedCode);
let SearchHeaderQHtmlBoxModuleUse = new SearchHeaderQHtmlBox(PageModuleUse.MinifiedCode);

//--------------------

if (PageModuleUse.Session.RoleId > 0) {
    if (PageModuleUse.Session.RoleId == 2)
        HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/add.png", "href": "/user/add", "alt": "add" });
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/location.png", "href": "/locations", "id": "LocationBM", "alt": "location" });
}
HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/search.png", "href": "", "id": "SearchBM" });
HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/" });

HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", "USERS", "watch & choose")
SearchHeaderQHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementById("HeaderTitleDescriptionHtmlBox"), "afterend", "")

let usersHtmlBox = new UsersHtmlBox(document.getElementById("SearchHeaderQHtmlBox"), "afterend", PageModuleUse)
await usersHtmlBox.AppendList() 
if (PageModuleUse.Session.RoleId > 0) {
    var userLoginJson = await ApiGetUserLogin()
    usersHtmlBox.AppendItem(userLoginJson.login, 0, "321")
}





//-- html actions

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
    document.getElementById("LocationBM").style.display = "block"
});

let prevScrollY = window.scrollY
document.addEventListener('scroll', async (event) => {
    if (window.scrollY >= prevScrollY && document.body.scrollHeight - window.scrollY < document.body.clientHeight + 100) {
        prevScrollY = window.scrollY + 200
        await usersHtmlBox.AppendList()
    }
});





//-- api actions

async function ApiGetUserLogin() {
    const response = await fetch(PageModuleUse.UrlApi + "/Base/User/Login", {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + PageModuleUse.Session.Token }
    });
    if (response.ok === true) { return await response.json(); }
    return null;
}