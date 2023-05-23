import { Page } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from "/PageComponents/HeaderHtmlBox/script.min.js";
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';

let PageModuleUse = new Page({ name: "UserAdd", title: "User add - RT" })
await PageModuleUse.Build();
let HeaderHtmlBoxModuleUse = new HeaderHtmlBox(PageModuleUse.MinifiedCode)
let HeaderTitleDescriptionHtmlBoxModuleUse = new HeaderTitleDescriptionHtmlBox(PageModuleUse.MinifiedCode);

//--------------------

try {
    if (PageModuleUse.Session.RoleId > 0) {
        if (PageModuleUse.Session.RoleId == 2) {
            HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/users" });
            HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")

            let html = "\
<div id=\"UserAddHtmlBox\">\
    <div>\
        <h1>\
            User profile\
        </h1>\
        <div>\
            <input name=\"login\" type=\"text\" placeholder=\"Login\" required />\
            <p>\
            </p>\
            <input name=\"title\" type=\"text\" placeholder=\"Title\" required />\
            <p>\
            </p>\
            <input name=\"description\" type=\"text\" placeholder=\"Description\" required />\
            <p>\
            </p>\
            <input name=\"url\" type=\"url\" placeholder=\"Url\" required />\
            <p>\
            </p>\
            <select name=\"parseType\">\
	            <option value=\"1\">RSS</option>\
	            <option value=\"2\">ATOM</option>\
            </select>\
            <a id=\"UserAddHtmlBoxSubmit\">\
                ADD\
            </a>\
        </div>\
    </div>\
</div>"

            document.getElementById("HeaderHtmlBox").insertAdjacentHTML("beforeend", html);
            document.getElementById("UserAddHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("UserAddHtmlBox").clientHeight - document.getElementById("HeaderHtmlBox").clientHeight - 100) / 2)

        }
        else {
            HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/users" });
            HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
            HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.body, "beforeend", "403", "Forbidden. The page is available only to the administrator.")
            document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - document.getElementById("HeaderHtmlBox").clientHeight - 100) / 2)
        }
    }
    else {
        localStorage.setItem("SessionRefrshRequired", "true")
        let signinUrl = PageModuleUse.UrlApi + "/Base/Authorization/Signin/Google?SessionToken=" + PageModuleUse.Session.Token + "&RedirectUrl=" + document.URL
        HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/login.png", "href": signinUrl });
        HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
        HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.body, "beforeend", "401", "Unauthorized.")
        document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - document.getElementById("HeaderHtmlBox").clientHeight - 100) / 2)
    }
}
catch {
    HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": "/users" });
    HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
    HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.body, "beforeend", "ERROR", "Error in code. Try again.")
    document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - document.getElementById("HeaderHtmlBox").clientHeight - 100) / 2)
}





//-- actions

document.getElementById("UserAddHtmlBoxSubmit").addEventListener('click', async () => {
    let login = document.querySelector("input[name=\"login\"]").value;
    let title = document.querySelector("input[name=\"title\"]").value;
    let description = document.querySelector("input[name=\"description\"]").value;
    let url = document.querySelector("input[name=\"url\"]").value;
    let parseType = document.querySelector("select[name=\"parseType\"]").value;

    if (login.length > 0 && title.length > 0 && description.length > 0 && url.length > 0) {
        await ApiUserAdd(login, title, description, url, parseType)
    }
});





//-- api actions

async function ApiUserAdd(login, title, description, url, parseType) {
    const response = await fetch(PageModuleUse.UrlApi + "/RtInk/User", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + PageModuleUse.Session.Token },
        body: JSON.stringify({ "login": login, "title": title, "description": description, "url": url, "parseType": parseType })
    });
    if (response.ok === true) {
        document.location.href = "/i/-" + login
    }
}