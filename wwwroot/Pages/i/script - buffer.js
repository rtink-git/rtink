/*-- Notes --*/


/*-- Tasks --*/
/*-- 2023-02-16 Task.Error: User edit about only latin symbols --*/
/*-- 2023-02-16 Task.Warning: Login не может быть числом --*/

const iHtmlPartName = "i"
const iHtmlPartUrl = "/Pages/" + iHtmlPartName;

let UnderHeaderCss = document.createElement("link");
UnderHeaderCss.setAttribute("rel", "stylesheet");
UnderHeaderCss.setAttribute("href", "/Pages/i/style.css");
document.head.append(UnderHeaderCss);

let ApiGetAticlesPage = 1
let ApiGetAticlesFlag = true

window.onload = async function () {
    const contentUrl = "/Pages/i/content";
    await window.RefreshJSTokenAsync();

    //-- data from url -----

    let dataSearch = ""
    let urlSrplit = document.URL.split('/')
    if (urlSrplit.length > 4)
        dataSearch = urlSrplit[4];

    //-- data from server model -----

    // 0 - empty url list
    // 1 - article page, redirect to outer source page
    // 2 - article page, has outer link
    // 3 - article page, has not outer link
    // 4 - user page - is not your profile
    // 5 - user page - your profile
    // 6 - search page

    let dataPageType = 0
    let dataLogin = ""
    let dataName = ""
    let dataAbout = ""
    let dataArticleUrlToRedirectInSource = ""
    let dataUserIsFollowType = 0
    let dataUserFollowingsNumber = 0;
    let dataUserFollowersNumber = 0;
    let dataLogoF = false;



    //-- data from server model api get -----

    var apiIPageModel = await ApiIPage(dataSearch)
    if (apiIPageModel != null) {
        dataLogin = apiIPageModel.userLogin
        dataName = apiIPageModel.userName
        dataAbout = apiIPageModel.userAbout
        dataArticleUrlToRedirectInSource = apiIPageModel.articleUrl
        dataPageType = apiIPageModel.pageType
        dataUserIsFollowType = apiIPageModel.userIsFollowType
        dataLogoF = apiIPageModel.logoF
        dataUserFollowingsNumber = apiIPageModel.userFollowingsNumber
        dataUserFollowersNumber = apiIPageModel.userFollowersNumber
    }

    //-- data page model -----

    let title_headerQPCP = "RT NEWS"
    let urlmenu_headerQPCP = "/";
    let searchPlaceholder = "";
    let searchPlaceholderFocus = "НАЙДЕТСЯ ВСЁ"
    let menuList = []
    let menuHtml = ""

    //-- data page model set -----

    if (dataPageType == 0) {
        searchPlaceholder = "НОВОСТНОЙ АГРЕГАТОР"
        menuList.push({ "icon": contentUrl + "/search.png", "href": "", "id": "SearchB" });
        if (dataLogin.length > 0) {
            menuList.push({ "icon": contentUrl + "/category.png", "href": "/list" });
            //menuList.push({ "icon": contentUrl + "/user.png", "href": "/i/-" + dataLogin });
        }
        else menuList.push({ "icon": contentUrl + "/login.png", "href": "/SigninGoogle", "id":"SigninB" });
    }
    else if (dataPageType == 1) {
        title_headerQPCP = "ARTICLE";
    }
    else if (dataPageType == 2) {
        title_headerQPCP = "ARTICLE";
    }
    else if (dataPageType == 3) {
        title_headerQPCP = "ARTICLE";
    }
    else if (dataPageType == 4) {
        title_headerQPCP = "USER"
        searchPlaceholder = "@" + dataLogin.toUpperCase()
        searchPlaceholderFocus = "@" + dataLogin.toUpperCase() + " - НАЙТИ"

        if (window.userRoleId > 0) {
            if (dataUserIsFollowType == 1)
                menuList.push({ "icon": contentUrl + "/add-friend.png", "href": "", "id": "UserIsFollow" });
            else if (dataUserIsFollowType == 2) {
                menuList.push({ "icon": contentUrl + "/delete-friend.png", "href": "", "id": "UserIsFollow" });
            }
        }
        if (window.userRoleId == 2) {
            menuList.push({ "icon": contentUrl + "/edit-text.png", "href": "/user-profile/" + dataLogin });
        }
        menuList.push({ "icon": contentUrl + "/search.png", "href": "", "id": "SearchB" });
        if (dataLogin.length > 0)
            menuList.push({ "icon": contentUrl + "/category.png", "href": "/list" });
    }
    else if (dataPageType == 5) {
        title_headerQPCP = "USER" //dataLogin.toUpperCase()
        searchPlaceholder = "@" + dataLogin.toUpperCase()
        searchPlaceholderFocus = "@" + dataLogin.toUpperCase() + " - НАЙТИ" 
        menuList.push({ "icon": contentUrl + "/plus.png", "href": "/article-add/" + dataLogin });
        //menuList.push({ "icon": contentUrl + "/bookmark.png", "href": "" });
        menuList.push({ "icon": contentUrl + "/search.png", "href": "", "id": "SearchB" });
        menuList.push({ "icon": contentUrl + "/edit-text.png", "href": "/user-profile/" + dataLogin });
        //menuList.push({ "icon": contentUrl + "/users.png", "href": "/u/" + dataLogin });
        if (dataLogin.length > 0)
            menuList.push({ "icon": contentUrl + "/category.png", "href": "/list" });
    }
    else if (dataPageType == 6) {
        title_headerQPCP = "SEARCH"
        searchPlaceholder = decodeURIComponent(dataSearch.replaceAll("-", " ")).toUpperCase();
    }

    if (menuHtml.length > 0)
        menuList.push({ "icon": contentUrl + "/menu.png", "href": "" });




    //-- html build -----

    let headerQPCP = new window.headerQPCP(title_headerQPCP, "", urlmenu_headerQPCP, menuList)
    headerQPCP.insertAdjacentHTML("afterbegin", document.body);
    if (dataPageType == 0) {
        new window.HeaderUnderBoxHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", "НОВОСТНОЙ АГРЕГАТОР")
        new SearchHeaderHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", "НАЙДЕТСЯ ВСЁ", "НАЙДЕТСЯ ВСЁ", dataPageType);
    }
    else if (dataPageType == 4) {
        let nm = ""
        try {
            let num = parseInt(dataLogin)
            if (!isNaN(num))
                nm = "@" + dataLogin.toUpperCase()
        } catch { }

        new window.HeaderUnderBoxHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", nm)
        new MainBox(document.getElementById("HeaderUnderBoxHtmlPart"), "afterend", dataPageType, dataLogoF, dataLogin, dataName, dataAbout, dataUserFollowingsNumber, dataUserFollowersNumber)
        new SearchHeaderHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", "НАЙДЕТСЯ ВСЁ", "НАЙДЕТСЯ ВСЁ", dataPageType);
    }
    else if (dataPageType == 5) {
        let nm = ""
        let num = parseInt(dataLogin)
        if (!isNaN(num)) nm = "@" + dataLogin.toUpperCase() + " - edit profile"
        else nm = ""

        nm = nm.toUpperCase();

        new window.HeaderUnderBoxHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", nm)
        new MainBox(document.getElementById("HeaderUnderBoxHtmlPart"), "afterend", dataPageType, dataLogoF, dataLogin, dataName, dataAbout, dataUserFollowingsNumber, dataUserFollowersNumber)
        new SearchHeaderHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", "НАЙДЕТСЯ ВСЁ", "НАЙДЕТСЯ ВСЁ", dataPageType);
    }
    else if (dataPageType == 6)
        new SearchHeaderHtmlPart(document.getElementById(headerQPCP.boxId), "afterend", searchPlaceholder, searchPlaceholderFocus, dataPageType);

    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", IBodyHtmlPart(window.userRoleId, dataLogin))


    var centralHtmlPartId = new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "", iHtmlPartUrl + "/content/reload.png", "LOADING", "/", "", "").id

    if (dataPageType == 1)
        window.location.href = dataArticleUrlToRedirectInSource
    else {
        document.getElementById("itemsPCMMoreQ").insertAdjacentHTML("afterend", FixButtonHtmlPart("FixButtonHtmlPartArrowDown"))
        document.getElementById("itemsPCMMoreQ").insertAdjacentHTML("afterend", FixButtonHtmlPart("FixButtonHtmlPartArrowUp"))

        await ApiGetAticlesAppend(dataSearch, ApiGetAticlesPage, dataPageType, centralHtmlPartId, dataLogin)

        document.getElementById("FixButtonHtmlPartArrowUp").addEventListener('click', async () => {
            document.getElementById("FixButtonHtmlPartArrowUp").style.display = "none"
            document.documentElement.scrollTop = 0
        });
        document.getElementById("FixButtonHtmlPartArrowDown").addEventListener('click', async () => {
            document.getElementById("FixButtonHtmlPartArrowDown").style.display = "none"
            document.documentElement.scrollTop = document.body.clientHeight
        });
    }





    //-- html actions

    document.getElementById("itemsPCMMoreQ").addEventListener('click', async () => {
        await ApiGetAticlesAppend(dataSearch, GetNextPage(), dataPageType)
    });


    let scrollTopPrev = 0
    document.addEventListener('scroll', async (event) => {
        if (document.body.clientHeight - document.documentElement.scrollTop <= window.innerHeight + 1) {
            document.getElementById("FixButtonHtmlPartArrowDown").style.display = "none"
            await ApiGetAticlesAppend(dataSearch, GetNextPage())
        }
        else if (document.documentElement.scrollTop == 0) {
            document.getElementById("FixButtonHtmlPartArrowUp").style.display = "none"
        }

        if (document.documentElement.scrollTop > 2000)
            if (document.documentElement.scrollTop < scrollTopPrev) {
                document.getElementById("FixButtonHtmlPartArrowDown").style.display = "none"
                document.getElementById("FixButtonHtmlPartArrowUp").style.display = "block"
                setTimeout(function () {
                    document.getElementById("FixButtonHtmlPartArrowUp").style.display = "none"
                }, 5000)
            }
            else {
                document.getElementById("FixButtonHtmlPartArrowUp").style.display = "none"
                document.getElementById("FixButtonHtmlPartArrowDown").style.display = "block"
                setTimeout(function () {
                    document.getElementById("FixButtonHtmlPartArrowDown").style.display = "none"
                }, 5000)
            }

        scrollTopPrev = document.documentElement.scrollTop
    });

    if (dataPageType == 0 || dataPageType == 4 || dataPageType == 5)
        document.getElementById("SearchB").addEventListener('click', async () => {
            var tg = document.getElementById("HeaderUnderBoxHtmlPart")
            var tgt = document.getElementById("SearchHeaderHtmlPart")
            if (tg.style.display == "none") {
                tgt.style.display = "none"
                tg.style.display = "block"
            }
            else {
                tg.style.display = "none"
                tgt.style.display = "block"
            }
        });

    if (document.querySelector("img[src=\"/Pages/i/content/menu.png\"]") != null)
        document.querySelector("img[src=\"/Pages/i/content/menu.png\"]").addEventListener('click', async () => {
            var t = document.getElementById("MenuBoxByPageTypeHtmlPart")
            if (t.style.display == "" || t.style.display == "none")
                t.style.display = "block";
            else
                t.style.display = "none";
        });

    if (dataPageType == 4)
        document.getElementById("UserIsFollow").addEventListener('click', async () => {
            if (document.querySelector("#UserIsFollow img").getAttribute("src") == "/Pages/i/content/delete-friend.png") {
                let rsp = await ApiFollow(dataLogin)
                if (rsp)
                    document.querySelector("#UserIsFollow img").setAttribute("src", "/Pages/i/content/add-friend.png")

            }
            else if (document.querySelector("#UserIsFollow img").getAttribute("src") == "/Pages/i/content/add-friend.png") {
                let rsp = await ApiFollow(dataLogin)
                if(rsp)
                    document.querySelector("#UserIsFollow img").setAttribute("src", "/Pages/i/content/delete-friend.png")
            }
        });
}

//--------------------

function GetNextPage() {
    return parseInt(document.querySelector("#itemsPCMMoreQ a[rel=\"next\"]").getAttribute("href").split('/')[3])
}

function SetNextPage() {
    let p = parseInt(document.querySelector("#itemsPCMMoreQ a[rel=\"next\"]").getAttribute("href").split('/')[3])
    document.querySelector("#itemsPCMMoreQ a[rel=\"next\"]").setAttribute("href", "/i/-/" + (p + 1));
}





//-- html page components

function IBodyHtmlPart(roleId) {
    let html = "";
    html += "\
    <div id=\"IBody\">\
        <div>\
            <div id =\"IArticles\">\
                <ul>\
                </ul>\
                <div id=\"itemsPCMMoreQ\">\
                    <div>\
                        <a href=\"/i/-/" + ApiGetAticlesPage+ "\" rel=\"next\">\
                            <img src=\"/Pages/i/content/arrow-down-black.png\" />\
                        </a>\
                        <a>\
                            <span>\
                                Показать больше\
                            </span>\
                        </a>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div>\
            <div id=\"MenuXSearch\">\
                <div>\
                    <input type=\"text\" placeholder=\"Search\" />\
                    <a>\
                        <img src=\"/Pages/i/content/search.png\" />\
                    </a>\
                </div>\
                <div id=\"MenuXSearchQuery\">\
                    <h2>\
                        Последние запросы\
                    </h2>\
                    <ul>\
                        <li>\
                            <a>\
                                Казань Минниханов\
                            </a>\
                        </li>\
                        <li>\
                            <a>\
                                Тверь канализация\
                            </a>\
                        </li>\
                        <li>\
                            <a>\
                                Новости Калининграда\
                            </a>\
                        </li>\
                        <li>\
                            <a>\
                                Три веселых друга\
                            </a>\
                        </li>\
                        <li>\
                            <a>\
                                Сегодня открыли парус\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
                <div id=\"MenuXSearchWords\">\
                    <h2>\
                        Популярные слова\
                    </h2>\
                    <p>\
                        <a>#Маршевые</a>\
                        <a>#барабаны</a>\
                        <a>#закупили</a>\
                        <a>#Биробиджанском</a>\
                        <a>#районе</a>\
                        <a>#свердловских</a>\
                        <a>#аптек</a>\
                        <a>#пропал</a>\
                        <a>#популярный</a>\
                        <a>#противовирусный</a>\
                        <a>#препарат</a>\
                    </p>\
                </div>\
            </div>\
        </div>\
    </div>"


    return html;
}

function FixButtonHtmlPart(id) {
    let html = "\
        <a id=\""+ id + "\" class=\"FixButtonHtmlPart\">\
            <img src=\"\" />\
        </a>";

    return html;
}

async function ApiGetAticlesAppend(search, page, dataPageType, centralHtmlPartId, dataLogin = "") {
    if (ApiGetAticlesFlag) {
        ApiGetAticlesFlag = false;
        document.querySelector("#itemsPCMMoreQ img").setAttribute("src", "/Pages/i/content/loading-gif-transparent-13.gif")
        let itemsPCP = new window.itemsPCP(search, page)
        let items = await itemsPCP.ApiGetAticles();
        if (items != null) {
            if (items.length > 0) {
                document.querySelector("#IArticles ul").insertAdjacentHTML("beforeend", await itemsPCP.ArticlesHtmlPart(items))
                SetNextPage();
                itemsPCP.LoadImage()
                document.querySelector("#itemsPCMMoreQ img").setAttribute("src", "/Pages/i/content/arrow-down-black.png")

                for (var i = 0; i < document.getElementsByClassName("AticleQHrBookmark").length; i++) {
                    let trgt = document.getElementsByClassName("AticleQHrBookmark")[i]
                    trgt.addEventListener("click", async () => {
                        let bookmarkApiResponseOk = await BookmarkApiResponse(trgt.closest("article").getAttribute("data-titleHb"))
                        if (window.isTest)
                            bookmarkApiResponseOk = true;
                        if (bookmarkApiResponseOk == true)
                            if (trgt.getAttribute("data-selected") == "false") trgt.setAttribute("data-selected", "true")
                            else trgt.setAttribute("data-selected", "false")
                    })
                }

                if (page == 1) {
                    if (dataPageType == 2 && dataPageType == 3) {
                        let trg = document.querySelector("#IArticles li:first-child article");
                        trg.querySelector(".AticleQDescription").innerHTML = await ApiGetBody(trg.getAttribute("data-titlehb"))
                    }
                    document.getElementById("IArticles").style.display = "inline-block";

                    if (items.length < 20) {
                        document.getElementById("itemsPCMMoreQ").style.display = "none";
                    }

                    //if (dataPageType == 4 || dataPageType == 5) {
                    //    document.getElementById("IArticles").style.marginTop = "10px";
                    //}

                    
                }
            }



            if (page == 1) {
                document.getElementById(centralHtmlPartId).style.display = "none";
                let t = document.querySelector("#" + centralHtmlPartId + " > a > img")

                if (items.length == 0)
                    if (dataPageType == 5) {
                        t.setAttribute("src", "/Pages/i/content/plus.png")
                        document.querySelector("#" + centralHtmlPartId + " > p").innerHTML = "ДОБАВИТЬ ПУБЛИКАЦИЮ"
                        document.querySelector("#" + centralHtmlPartId + " > a").setAttribute("href", "/article-add/" + dataLogin)
                        document.getElementById(centralHtmlPartId).style.display = "inline-block";
                    }
                    else {
                        t.setAttribute("src", "/Pages/i/content/empty-folder.png")
                        document.querySelector("#" + centralHtmlPartId + " > p").innerHTML = "ARTICLES NOT FOUND"
                        document.querySelector("#" + centralHtmlPartId + " > a").setAttribute("href", document.URL)
                        document.getElementById(centralHtmlPartId).style.display = "inline-block";

                    }
            }
        }

        setTimeout(function () {
            ApiGetAticlesFlag = true
        }, 5000)
    }
}

class SearchHeaderHtmlPart {
    constructor(target, position, searchPlaceholder, searchPlaceholderFocus, dataPageType) {
        let html = "\
            <div id=\"SearchHeaderHtmlPart\">\
                <input type=\"search\" placeholder=\"" + searchPlaceholder + "\" />\
                <a>\
                    <img src=\"/Pages/i/content/search.png\" />\
                </a>\
            </div>"
        target.insertAdjacentHTML(position, html)

        document.querySelector("#SearchHeaderHtmlPart input[type=\"search\"]").addEventListener('focus', async () => {
            document.querySelector("#SearchHeaderHtmlPart input[type=\"search\"]").setAttribute("placeholder", searchPlaceholderFocus)
            document.querySelector("#SearchHeaderHtmlPart a").style.display = "block"
        });

        document.querySelector("#SearchHeaderHtmlPart input[type=\"search\"]").addEventListener('blur', async () => {
            let v = document.querySelector("input[type=\"search\"]").value
            if (v.length == 0) {
                document.querySelector("input[type=\"search\"]").setAttribute("placeholder", searchPlaceholder)
                document.querySelector("#SearchHeaderHtmlPart a").style.display = "none"
            }
        });

        document.querySelector("#SearchHeaderHtmlPart input[type=\"search\"]").addEventListener('keypress', function (event) {
            if (event.key == "Enter") {
                let v = document.querySelector("input[type=\"search\"]").value
                if (v.length > 0)
                    if (dataPageType == 5)
                        window.location.href = "/i/-" + dataLogin + "-" + v.replaceAll(" ", "-")
                    else
                        window.location.href = "/i/" + v.replaceAll(" ", "-")
            }
        });

        document.querySelector("#SearchHeaderHtmlPart a").addEventListener('click', async () => {
            let v = document.querySelector("input[type=\"search\"]").value
            if (v.length > 0)
                if (dataPageType == 5)
                    window.location.href = "/i/-" + dataLogin + "-" + v.replaceAll(" ", "-")
                else
                    window.location.href = "/i/" + v.replaceAll(" ", "-")
        });
    }
}

class SearchUserHeaderHtmlPart {
    constructor(target, position, searchPlaceholder, searchPlaceholderFocus) {
        let html = "\
            <div id=\"SearchUserHeaderHtmlPart\">\
                <div>\
                    <input type=\"search\" placeholder=\"" + searchPlaceholder + "\" />\
                    <a>\
                        <img src=\"/Pages/i/content/search.png\" />\
                    </a>\
                </div>\
                <div>\
                    <a>\
                        <span>793</span>\
                        <span>читает</span>\
                    </a>\
                    <a>\
                        <span>2517</span>\
                        <span>читателя(-ей)</span>\
                    </a>\
                </div>\
            </div>"
        target.insertAdjacentHTML(position, html)

        document.querySelector("#SearchUserHeaderHtmlPart input[type=\"search\"]").addEventListener('focus', async () => {
            document.querySelector("#SearchUserHeaderHtmlPart input[type=\"search\"]").setAttribute("placeholder", searchPlaceholderFocus)
            document.querySelector("#SearchUserHeaderHtmlPart a").style.display = "block"
        });

        document.querySelector("#SearchUserHeaderHtmlPart input[type=\"search\"]").addEventListener('blur', async () => {
            let v = document.querySelector("input[type=\"search\"]").value
            if (v.length == 0) {
                document.querySelector("input[type=\"search\"]").setAttribute("placeholder", searchPlaceholder)
                document.querySelector("#SearchUserHeaderHtmlPart a").style.display = "none"
            }
        });

        document.querySelector("#SearchUserHeaderHtmlPart input[type=\"search\"]").addEventListener('keypress', function (event) {
            if (event.key == "Enter") {
                let v = document.querySelector("input[type=\"search\"]").value
                if (v.length > 0)
                    if (dataPageType == 5)
                        window.location.href = "/i/-" + dataLogin + "-" + v.replaceAll(" ", "-")
                    else
                        window.location.href = "/i/" + v.replaceAll(" ", "-")
            }
        });

        document.querySelector("#SearchUserHeaderHtmlPart > *:first-child a").addEventListener('click', async () => {
            let v = document.querySelector("input[type=\"search\"]").value
            if (v.length > 0)
                if (dataPageType == 5)
                    window.location.href = "/i/-" + dataLogin + "-" + v.replaceAll(" ", "-")
                else
                    window.location.href = "/i/" + v.replaceAll(" ", "-")
        });
    }
}

class MainBox {
    constructor(target, position, dataPageType, dataLogoF, login, name, about, userFollowingsNumber, userFollowersNumber) {
        let backgroundType = 0

        for (var i = 0; i < login.length; i++)
            backgroundType += login.charCodeAt(i)

        while (backgroundType > 20) {
            var t = 0
            var ts = backgroundType.toString()
            for (var i = 0; i < ts.length; i++)
                t += parseInt(ts[i])
            backgroundType = t
        }

        let letterOne = "0"
        if (login.length > 0)
            letterOne = login[0]
        let letterTwo = "0"
        if (login.length > 1)
            letterTwo = login[1]
        let letterThree = "0"
        if (login.length > 2)
            letterThree = login[2]
        let letterFore = "0"
        if (login.length > 3)
            letterFore = login[3]

        let logoUrl = ""
        //let logoUrl = "/Pages/i/content/spaceship.png"
        if (dataLogoF)
            logoUrl = "/user-logo/" + login + ".jpg"

        if (name == null || name.length == 0)
            name = "@" + login

        let aboutHtml = ""
        if (about != null && about.length > 0)
            aboutHtml = "<p id=\"_UserDescription\"><span>" + about + "</span></p>"

        let mdRightOne = "";
        if (dataPageType == 5)
            mdRightOne = "\
                <a class=\"_LogoSubMain\" href=\"/article-add/" + login + "\">\
                    <img src=\"/Pages/i/content/plus.png\" />\
                </a>"

        let mdLeftOne = "";
        if (dataPageType == 5)
            mdLeftOne = "\
                    <a class=\"_LogoSubMain\">\
                        <img src=\"/Pages/i/content/bookmark.png\" />\
                    </a>"

        let _UserShortHtmlPart = "";
        try {
            let num = parseInt(login)
            if (isNaN(num)) {
                _UserShortHtmlPart = "<div id=\"_UserShort\">\
                        <div>\
                            <img />\
                            <span>\
                                @" + login + "\
                            </span>\
                        </div>\
                    </div>"
            }

        } catch {

            
        }
        

        // 45th President of the United States of America🇺🇸 // <span>Moscow, Russia</span></p>
        const UsersUrl = "/Pages/U";
        let html = "\
            <div id=\"MainBox\">\
                <div id=\"_UserProfile\">\
                    <div id=\"_UserLogo\">" + mdLeftOne + "\
                        <div id=\"_LogoMain\">\
                            <div data-backgroundType=\"" + backgroundType + "\">\
                                <div data-showf=\"" + dataLogoF + "\">\
                                    <div>\
                                        <span>" + letterOne + "</span>\
                                        <span>" + letterTwo + "</span>\
                                    </div>\
                                    <div>\
                                        <span>" + letterThree + "</span>\
                                        <span>" + letterFore + "</span>\
                                    </div>\
                                </div>\
                                <img data-showf=\"" + dataLogoF + "\" src=\"" + logoUrl + "\" />\
                            </div>\
                        </div>" + mdRightOne + "\
                    </div>" + _UserShortHtmlPart + "\
                    <h1>" + name.toUpperCase() + "</h1>" + aboutHtml + "\
                    <p id=\"_UserLocation\"><img src=\"" + UsersUrl + "/content/placeholder.png\" />\
                    <p id=\"_UserLink\"><img src=\"" + UsersUrl + "/content/link.png\" /><a>neftegaz.ru</a></p>\
                    <div id=\"_UserFls\">\
                        <a href=\"/users/" + login + "-followings\">\
                            <span>" + userFollowingsNumber + "</span>\
                            <span>\
                                 - читает\
                            </span>\
                        </a>\
                        <a href=\"/users/" + login + "-followers\">\
                            <span>" + userFollowersNumber + "</span>\
                            <span>\
                                 - читателя(-ей)\
                            </span>\
                        </a>\
                    </div>\
                </div>\
            </div>"

        if (_UserShortHtmlPart.length > 0)
            target.insertAdjacentHTML(position, html)
    }
}





//-- api




async function ApiEditProfile(loginPrev, name, login) {
    const response = await fetch("/api/EditProfile?loginPrev=" + loginPrev + "&name=" + name + "&login=" + login, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response.ok
}

async function BookmarkApiResponse(titleHb) {
    const response = await fetch("/api/Bookmark?titleHb=" + titleHb.toString(), {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response.ok;
}

async function ApiArticleFollow(login) {
    const response = await fetch(this.ApiUrl + "/RtInk/ArticleFollow?login=" + login, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response.ok;
}