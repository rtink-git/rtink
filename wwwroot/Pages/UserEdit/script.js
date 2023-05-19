import { ApiUrl, PageHeadsBuild, Session } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from "/PageComponents/HeaderHtmlBox/script.min.js";
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.js';

const UserEditPageName = "UserEdit"; const UserEditPageUrl = "/Pages/" + UserEditPageName; const UserEditUrlContent = UserEditPageUrl + "/content";
let UserEditPageCss = document.createElement("link"); UserEditPageCss.setAttribute("rel", "stylesheet"); UserEditPageCss.setAttribute("href", UserEditPageUrl + "/style.css"); document.head.append(UserEditPageCss);

let headerHtmlBox = new HeaderHtmlBox()
let headerTitleDescriptionHtmlBox = new HeaderTitleDescriptionHtmlBox();

PageHeadsBuild("User Edit - RT", "")

let userLogin = ""
let urlSrplit = document.URL.split('/')
if (urlSrplit.length > 5) {
    userLogin = decodeURIComponent(urlSrplit[5]);
    //userLogin = userLogin.substring(1, userLogin.length)
}

try {
    if (Session.RoleId > 0) {
        if (userLogin.length > 0) {
            let userBio = await ApiUserBio(userLogin)
            if (userBio.sbt != -1) {
                if (userBio.sbt == 1 || Session.RoleId == 2) {
                    headerHtmlBox.PushMenuRow({ "icon": UserEditUrlContent + "/undo.png", "href": "/i/-" + userLogin });
                    headerHtmlBox.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")


                    let html = "\
<div id=\"UserEditHtmlBox\">\
    <div>\
        <h1>\
            User profile\
        </h1>\
        <div>\
            <input name=\"login\" type=\"text\" placeholder=\"Login\" value=\"" + userLogin + "\" />\
            <p>\
            </p>\
            <input name=\"title\" type=\"text\" placeholder=\"Title\" value=\"" + userBio.title + "\" />\
            <p>\
            </p>\
            <input name=\"description\" type=\"text\" placeholder=\"Description\" value=\"" + userBio.description + "\" />\
            <p>\
            </p>\
            <a id=\"UserEditHtmlBoxSubmit\">\
                UPDATE\
            </a>\
        </div>\
    </div>\
</div>"

                    document.getElementById("HeaderHtmlBox").insertAdjacentHTML("beforeend", html);
                    document.getElementById("UserEditHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("UserEditHtmlBox").clientHeight - document.getElementById("HeaderHtmlBox").clientHeight - 100) / 2)
                }
                else {
                    headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.body, "beforeend", "403", "Forbidden. <a href=\"/i/-" + userLogin + "\">Back to user page.</a>")
                    document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - 100) / 2)
                }
            }
            else {
                headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.body, "beforeend", "400", "Bad Request. User is not found. <a href=\"/\">Back to home.</a>")
                document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - 100) / 2)
            }
        }
        else {
            headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.body, "beforeend", "400", "Bad Request. User is not found. <a href=\"/\">Back to home.</a>")
            document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - 100) / 2)
        }

    }
    else {
        localStorage.setItem("SessionRefrshRequired", "true")
        let signinUrl = ApiUrl + "/Base/Authorization/Signin/Google?SessionToken=" + Session.Token + "&RedirectUrl=" + document.URL
        headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.body, "beforeend", "401", "Unauthorized. <a href=\"" + signinUrl + "\">Sign in.</a>")
        document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - 100) / 2)
    }
}
catch {
    if (document.getElementById("HeaderTitleDescriptionHtmlBox") == null) {
        headerTitleDescriptionHtmlBox.InsertAdjacentHTML(document.body, "beforeend", "ERROR", "Error in code. Try again. <a href=\"/\">Back to home.</a>")
        document.getElementById("HeaderTitleDescriptionHtmlBox").style.marginTop = ((window.screen.height - document.getElementById("HeaderTitleDescriptionHtmlBox").clientHeight - 100) / 2)
    }
}





//-- actions

document.getElementById("UserEditHtmlBoxSubmit").addEventListener('click', async () => {
    let login = document.querySelector("input[name=\"login\"]").value;
    let title = document.querySelector("input[name=\"title\"]").value;
    let description = document.querySelector("input[name=\"description\"]").value;

    await ApiUserBioUpdate(userLogin, login, title, description)
});





//-- api actions

async function ApiUserBio(userLogin) {
    const response = await fetch(ApiUrl + "/RtInk/User?userLogin=" + userLogin, { method: "GET", headers: { "Accept": "application/json", "Authorization": "Bearer " + Session.Token } });
    if (response.ok === true) return await response.json();
    return null;
}

async function ApiUserBioUpdate(userLogin, loginNew, title, description) {
    const response = await fetch(ApiUrl + "/RtInk/User", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + Session.Token },
        body: JSON.stringify({ "login": userLogin, "loginNew": loginNew, "title": title, "description": description })
    });
    if (response.ok === true) {
        document.location.href = "/i/-" + loginNew

    }
    return null;
}