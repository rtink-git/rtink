const UsersUrl = "/Pages/Users";

let UsersCss = document.createElement("link"); UsersCss.setAttribute("rel", "stylesheet"); UsersCss.setAttribute("href", UsersUrl + "/style.css"); document.head.append(UsersCss);

window.onload = async function () {
    await window.RefreshJSTokenAsync();

    let urlComeBack = "/"

    let urlSplit = document.URL.split('/')
    if (urlSplit.length > 4 && urlSplit[4] != null && urlSplit[4].length > 0) {
        let searchSplit = urlSplit[4].split('-')

        //----------

        let loginFromUrl = searchSplit[0];
        // 0 - user search page
        // 1 - user followings page
        // 2 - user followers page
        let typeFromUrlSub = 0;
        let menuList = []
        let itemsFromApi = []

        //----------

        if (searchSplit.length > 1)
            if (searchSplit[1].toLowerCase() == "followings")
                typeFromUrlSub = 1
            else if (searchSplit[1].toLowerCase() == "followers")
                typeFromUrlSub = 2

        if (typeFromUrlSub == 0) {
            menuList.push({ "icon": UsersUrl + "/content/search.png", "href": "", "id": "SearchB" });
            new window.HeaderBox(document.getElementsByTagName("body")[0], "afterbegin", "USERS", "", "/i/-" + loginFromUrl, menuList)
        }
        else if (typeFromUrlSub == 1) {
            menuList.push({ "icon": UsersUrl + "/content/users.png", "href": "/users" });
            menuList.push({ "icon": UsersUrl + "/content/search.png", "href": "", "id": "SearchB" });
            new window.HeaderBox(document.getElementsByTagName("body")[0], "afterbegin", "USERS", " ", "/i/-" + loginFromUrl, menuList)
            new window.HeaderUnderBoxHtmlPart(document.getElementById("HeaderBox"), "afterend", "@" + loginFromUrl.toUpperCase() + " - FOLLOWINGS")
        }
        else if (typeFromUrlSub == 2) {
            menuList.push({ "icon": UsersUrl + "/content/users.png", "href": "/users" });
            menuList.push({ "icon": UsersUrl + "/content/search.png", "href": "", "id": "SearchB" });
            new window.HeaderBox(document.getElementsByTagName("body")[0], "afterbegin", "USERS", " ", "/i/-" + loginFromUrl, menuList)
            new window.HeaderUnderBoxHtmlPart(document.getElementById("HeaderBox"), "afterend", "@" + loginFromUrl.toUpperCase() + " - FOLLOWERS")
        }

        var apiUsersResponse = await ApiUsers(urlSplit[4])
        if (apiUsersResponse.ok == true) {
            let list = await apiUsersResponse.json()

            if (list != null) {
                if (list.length > 0)
                    new UserList(document.getElementsByTagName("body")[0], "beforeend", list)
                else {
                    let nm = "USERS"
                    if (typeFromUrlSub == 1)
                        nm = "FOLLOWINGS";
                    else if (typeFromUrlSub == 2)
                        nm = "FOLLOWERS";
                    new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "", UsersUrl + "/content/0.png", nm + " IS NOT FOUND", "", "COME BACK", urlComeBack)
                }
            }
        }

        //if (itemsFromApi == null) {
        //    let trgts = document.querySelectorAll("body > *")
        //    if (trgts != null && trgts.length > 0)
        //        trgts.forEach(e => e.style.display = "none");
        //    new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "afterbegin", "", "", "ERROR 404", "", "COME BACK", urlComeBack)
        //}
        //else if (itemsFromApi.length == 0) {
        //    new UserList(document.getElementsByTagName("body")[0], "beforeend")
        //    //let nm = "USERS"
        //    //if (typeFromUrlSub == 1)
        //    //    nm = "FOLLOWINGS";
        //    //else if (typeFromUrlSub == 2)
        //    //    nm = "FOLLOWERS";
        //    //new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "", UsersUrl + "/content/0.png", nm + " IS NOT FOUND", "", "COME BACK", urlComeBack)
        //}
        //else {

        //}
    }
    else {
        new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "afterbegin", "", "", "ERROR 404", "", "COME BACK", urlComeBack)
    }
}

class UserList {
    constructor(target, position, list) {
        let html = "";

        list.forEach(e => {
            let tp = -1;
            if (window.userRoleId > 0) {
                if (e.userIsFollowing == 0 && e.userIsFollower == 0)
                    tp = 0;
                else if (e.userIsFollowing == 1 && e.userIsFollower == 0)
                    tp = 1
                else if (e.userIsFollowing == 0 && e.userIsFollower == 1)
                    tp = 2
                else if (e.userIsFollowing == 1 && e.userIsFollower == 1)
                    tp = 3
            }

            html += "\
            <li>\
                <article>\
                    <img src=\"https://icdn.lenta.ru/images/2022/01/25/10/20220125104132769/owl_detail_240_7cd5b8f05936607e10ddb4c39ab6949a.jpg\" />\
                    <div>\
                        <a href=\"/i/-" + e.login + "\">\
                            <span>@"+ e.login +"</span>\
                            <h2>"+ e.name +"</h2>\
                            <span>"+ e.about +"</span>\
                        </a>\
                        <p>\
                            <span>123 (+ 10)</span>\
                        </p>\
                    </div>\
                    <a data-actp=\"" + tp + "\">\
                        <img />\
                    </a>\
                </article>\
            </li>"
        })

        html = "<ul id=\"UserList\">" + html + "</ul>"

        target.insertAdjacentHTML(position, html)
    }
}

//-- api

async function ApiUsers(search) {
    const response = await fetch("/api/Users?search=" + search + "&sessionId=" + localStorage.getItem("sessionId") + "&sessionToken=" + localStorage.getItem("authJWToken"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response
}