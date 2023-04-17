import { isTest, apiUrl, PageHeadsBuild, authJWToken } from '/PageComponents/Page/script.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.js';
import { HeaderDescriptionHtmlBox } from '/PageComponents/HeaderDescriptionHtmlBox/script.js';
import { SearchHeaderQHtmlBox } from "/PageComponents/SearchHeaderQHtmlBox/script.js";

const UsersPageName = "Users";
const UsersPageUrl = "/Pages/" + UsersPageName;
const UsersPageUrlContent = UsersPageUrl + "/content";
let UsersPageCss = document.createElement("link"); UsersPageCss.setAttribute("rel", "stylesheet"); UsersPageCss.setAttribute("href", UsersPageUrl + "/style.css"); document.head.append(UsersPageCss);
PageHeadsBuild("Users - RT", "")

let menuList = new Array()
menuList.push({ "icon": UsersPageUrlContent + "/search.png", "href": "", "id": "SearchBM" });
menuList.push({ "icon": UsersPageUrlContent + "/undo.png", "href": "/" });

new HeaderHtmlBox(document.getElementsByTagName("body")[0], "afterbegin", "RT", null, menuList, isTest)
new HeaderDescriptionHtmlBox(document.getElementById("HeaderHtmlBox"), "afterend", "USERS", "", "")
new SearchHeaderQHtmlBox(document.getElementById("HeaderDescriptionHtmlBox"), "afterend", "", "", "")

let page = 1
let take = 50
let UsersList = new Array();
let UsersJson = await ApiUsers(page);
UsersJson.forEach(e => { UsersList.push(e); })
document.getElementById("SearchHeaderQHtmlBox").insertAdjacentHTML("afterend", UsersHtmlPart())
if (page == 1 && UsersList.length == take)
{
    document.getElementById("UsersHtmlPart").insertAdjacentHTML("beforeend", MoreButton())
}
if (UsersJson.length > 0) page++;




//-- html parts

function UsersHtmlPart() {
    let html = "\
    <div id=\"UsersHtmlPart\">\
        <div>\
        </div>\
    </div>"

    return html;
}

function UsersHtmlPartAppend(e) {
    let html = "\
        <div data-login=\"" + e.login + "\">\
            <a href=\"/i/-" + e.login + "\">\
                <span>\
                " + e.login + "\
                </span>\
            </a>\
            <a class=\"_Subscrib\" data-type=\"" + e.subscribeType + "\">\
                <img />\
            </a>\
            <div class=\"_ArticleN\">\
                <span>\
            " + e.artn + "\
                </span>\
            </div>\
        </div>"

    document.querySelector("#UsersHtmlPart > *").insertAdjacentHTML("beforeend", html)
}

function MoreButton() {
    let html = "\
        <div id=\"MoreButton\">\
            <div>\
                <a>\
                    <img src=\"/PageComponents/ArticlesHtmlBox/content/arrow-down-black.png\" />\
                </a>\
                <a>\
                    <span>\
                        Показать больше\
                    </span>\
                </a>\
            </div>\
        </div>"

    return html;
}

UsersList.forEach(e => {
    UsersHtmlPartAppend(e)
})





//-- html actions

document.getElementById("SearchBM").addEventListener('click', async (event) => {
    document.getElementById("SearchBM").style.display = "none";
    document.getElementById("SearchHeaderQHtmlBox").style.display = "block";
});





//-- api actions

async function ApiUsers(page) {
    const response = await fetch(apiUrl + "/RtInk/Users?take=" + take + "&page=" + page, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + authJWToken }
    });
    if (response.ok === true) return await response.json();
    return null;
}





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









//let ListPageCss = document.createElement("link"); ListPageCss.setAttribute("rel", "stylesheet"); ListPageCss.setAttribute("href", "/Pages/List/style.css"); document.head.append(ListPageCss);

//const ListPageUrl = "/Pages/List";

//window.onload = async function () {
//    try {
//        await window.RefreshJSTokenAsync();

//        if (window.userRoleId > 0) {

//            //-- params from ApiUserBio -----

//            let userLoginP = "";
//            let userNameP = ""
//            let userAboutP = ""

//            let ApiUserBioJson = await ApiUserBio()
//            if (ApiUserBioJson != null) {
//                userLoginP = ApiUserBioJson.login
//                userNameP = ApiUserBioJson.name
//                userAboutP = ApiUserBioJson.about
//            }

//            //----------

//            let users = []

//            //-- data from server model api get -----

//            //----------

//            if (userLoginP != null && userLoginP != "") {
//                let menuList = []
//                menuList.push({ "icon": ListPageUrl + "/content/logout.png", "href": "", "id": "Signout" });

//                //menuList.push({ "icon": ListPageUrl + "/content/user.png", "href": "/i/-" + userLoginP });

//                new window.headerQPCP("LIST", "", "/", menuList).insertAdjacentHTML("afterbegin", document.body)

//                let listPageBox = new ListPageBox(document.getElementById("headerQPCP"), "afterend")
//                if (window.isTest)
//                    users = listPageBox.testUserList();

//                listPageBox.insertUl("_Channel")
//                if (userLoginP != null && userLoginP.length > 0 && userNameP != null && userNameP.length > 0 && userAboutP != null && userAboutP.length > 0)
//                    listPageBox.insertCreateChannelLi("_Channel", userLoginP, userNameP, userAboutP, "https://cdn-icons-png.flaticon.com/512/3658/3658756.png", "/i/-" + userLoginP)
//                else
//                    listPageBox.insertCreateChannelLi("_Channel", userLoginP, "Edit profile", "", "https://cdn-icons-png.flaticon.com/512/3658/3658756.png", "/user-profile/" + userLoginP)


//                listPageBox.insertUl("_Bookmarks", "Bookmarks")
//                listPageBox.testUserQList().forEach(e => {
//                    listPageBox.insertUserLi("_Bookmarks", e.login, e.name, e.about, e.imgUrl, e.type)
//                });

//                listPageBox.insertUl("_Actions", "Actions")
//                listPageBox.testUserQList().forEach(e => {
//                    listPageBox.insertUserLi("_Actions", e.login, e.name, e.about, e.imgUrl, e.type)
//                });

//                listPageBox.insertUl("_Reactions", "Rections")
//                listPageBox.testUserQList().forEach(e => {
//                    listPageBox.insertUserLi("_Reactions", e.login, e.name, e.about, e.imgUrl, e.type)
//                });


//                //if (bookmarksNumber > 0)
//                //    listPageBox.insertCreateChannelLi(userLoginP, "Bookmarks", "", "https://www.scrivenervirgin.com/wp-content/uploads/2020/08/Bookmark-dreamstime_m_100217128.jpg")
//                //if (commentsNumber > 0)
//                //    listPageBox.insertCreateChannelLi(userLoginP, "Comments", "", "https://icons-for-free.com/download-icon-chatting+circle+comment+message+messaging+icon-1320196712916974892_512.png")
//                listPageBox.insertUl("_ChannelOne", "Followings")
//                users.forEach(e => {
//                    listPageBox.insertUserLi("_ChannelOne", e.login, e.name, e.about, e.imgUrl, e.type)
//                });

//            }
//            else
//                new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "0", "", "USER IS NOT FOUND", "", "COME BACK", "/");
//        }
//        else
//            new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "0", "", "UNAUTHORIZED", "", "COME BACK", "/");
//    }
//    catch {
//        new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "beforeend", "0", "", "ERROR 404", "", "COME BACK.", "/")
//    }
//}

//class ListPageBox {
//    constructor(target, position) {
//        let html = "\
//            <div id=\"ListPageBox\">\
//                <div>\
//                </div>\
//            </div>";
//        target.insertAdjacentHTML(position, html)
//    }

//    insertUl(id, title) {
//        let titleHtmlPart = ""
//        if (title != null && title != undefined && title.length > 0)
//            titleHtmlPart = "<h3>" + title + "</h3>"

//        let html = "\
//        " + titleHtmlPart + "\
//        <ul id=\"" + id + "\">\
//        </ul>"
//        document.querySelector("#ListPageBox > div").insertAdjacentHTML("beforeend", html)
//    }

//    insertCreateChannelLi(ulId, login, title, about, imgUrl, url) {
//        let html = "\
//        <li>\
//            <a href=\"" + url + "\" class=\"_boxTOne\">\
//                <img src=\"" + imgUrl + "\" />\
//                <div>\
//                    <p>\
//                        @" + login + "\
//                    </p>\
//                    <h2>" + title + "</h2>\
//                    <p>" + about + "</p>\
//                </div>\
//            </a>\
//        </li>"
//        document.querySelector("#ListPageBox #" + ulId).insertAdjacentHTML("beforeend", html)
//    }

//    insertUserLi(ulId, login, title, about, imgUrl, type) {
//        // type = 0 - комментарий к вашему комментарию (user profile and comment article text)
//        // type = 2 - новая публикация человека на которого вы подписаны
//        // type = 3/4 - публикация человека на которого подписаны вы
//        // type = 4/3 - публикация человека на которого вы не подписаны и он на вас не подписан
//        // type = 5 - пользователь добавил вас в друзья
//        // Ваша публикация добавлена в bookmark
//        // Ответ к вашей публикации

//        let urlType = ListPageUrl + "/content/add-friend.png";
//        if (type == 1)
//            urlType = ListPageUrl + "/content/delete-friend.png";

//        let html = "\
//        <li>\
//            <a class=\"_boxTwo\">\
//                <img src=\"" + imgUrl + "\" />\
//                <div>\
//                    <p>\
//                        <span>\
//                            " + title + "\
//                        </span>\
//                        <span>\
//                            - @" + login + "\
//                        <span>\
//                    </p>\
//                    <p>" + about + "</p>\
//                </div>\
//                <div>\
//                    <img src=\"" + urlType + "\" />\
//                    <span>0</span>\
//                </div>\
//            </a>\
//        </li>"
//        document.querySelector("#ListPageBox #" + ulId).insertAdjacentHTML("beforeend", html)
//    }

//    testUserList() {
//        let users = []
//        users.push({ "login": "410", "name": "Cnn", "about": "В БФУ им. Канта появится новая учебная программа по специальности «Судебная и прокурорская деятельность»", "imgUrl": "https://images.squarespace-cdn.com/content/v1/53af1c83e4b0b3e1fc2000bd/1446397787787-SI1H06DNOL2QJSX13DCD/Randy+Krum+Profile+Photo+square.jpg", "type": 0 })
//        users.push({ "login": "ura_ru", "name": "Информ агентство URA", "about": "В Челябинске продают бизнес по производству туалетной бумаги. Скрин", "imgUrl": "https://cdn-icons-png.flaticon.com/512/168/168728.png", "type": 2 })
//        users.push({ "login": "newsnn", "name": "Новости Нижегородское", "about": "В столице России встретились президент РАН Геннадий Красников и советник президента РФ Антон Кобяков", "imgUrl": "https://www.earthdata.nasa.gov/s3fs-public/2022-05/poinar%20square.jpg?VersionId=KPuUZGiwzGWVHP_axKe84s_mIT_G0aYg", "type": 1 })
//        users.push({ "login": "gcheb_cap", "name": "Город Чебоксары - портал", "about": "АО \"Дорэкс\" продолжает штатные работы на дорогах города", "imgUrl": "https://cdn.shopify.com/s/files/1/0036/4806/1509/products/84d0d64aad6ac0b1d2f4cd67bb0c822f0c284440_square1517458_1.jpg?v=1665378503", "type": 1 })
//        users.push({ "login": "penzainform", "name": "Пензенские вести", "about": "Жительница Зеленограда заступилась за мужа, который взял за шиворот их трехлетнего сына, упавшего на дороге.", "imgUrl": "https://www.s3i.co.uk/image/s3i/bar-rail-tube-square-hero.jpg", "type": 0 })
//        users.push({ "login": "newsorel", "name": "Орловское медиа", "about": "В Орле подрядчику пришлось в суде выбивать оплату за ремонт библиотеки.", "imgUrl": "https://www.strictlytablesandchairs.co.uk/pub/media/catalog/product/cache/014b90b552b8d6a67d9faf0ca0e5ab2d/s/q/square-banqueting-table-cloth_4.jpg", "type": 1 })
//        users.push({ "login": "vesti_kalic", "name": "Вести Калининграда", "about": "Командующий Балтфлотом сегодня вручил знамя нового образца соединению морской авиации.", "imgUrl": "https://pyxis.nymag.com/v1/imgs/7ad/43b/a5ce5d339b4d09c4334aae2921deccdb28-31-selena-gomez.rsquare.w700.jpg", "type": 0 })
//        users.push({ "login": "moe_online", "name": "Моё онлайн", "about": "Воронежцы требуют наказать «Квадру» за запредельные суммы в платёжках", "imgUrl": "https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/image/rDtN98Qoishumwih/graphicstock-woman-holding-tablet-computer-with-social-network-user-profile-on-a-screen-woman-standing-on-the-background-of-world-map-with-avatars-of-social-network-vector-flat-design-illustration-square-layout_HQWBO-AIUb_thumb.jpg", "type": 0 })
//        users.push({ "login": "riabir", "name": "РИА Биробиджан", "about": "Тельцы не всегда могут подобрать нужные слова, а Львы могут успешно.", "imgUrl": "https://img.archiexpo.com/images_ae/photo-mg/156261-15643362.jpg", "type": 0 })
//        users.push({ "login": "sm_news", "name": "SM News", "about": "Тигр заразил охотника инфекцией", "imgUrl": "https://images.squarespace-cdn.com/content/v1/5e2675ab8ee5021e016a1ecc/1673486445286-UJ1TO0TEQG6HPOIR5J48/squarespace+seo+tutorial+list.png?format=1000w", "type": 0 })

//        return users
//    }

//    testUserQList() {
//        let users = []
//        users.push({ "login": "moe_online", "name": "Моё онлайн", "about": "Воронежцы требуют наказать «Квадру» за запредельные суммы в платёжках", "imgUrl": "https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/image/rDtN98Qoishumwih/graphicstock-woman-holding-tablet-computer-with-social-network-user-profile-on-a-screen-woman-standing-on-the-background-of-world-map-with-avatars-of-social-network-vector-flat-design-illustration-square-layout_HQWBO-AIUb_thumb.jpg", "type": 0 })
//        users.push({ "login": "riabir", "name": "РИА Биробиджан", "about": "Тельцы не всегда могут подобрать нужные слова, а Львы могут успешно.", "imgUrl": "https://img.archiexpo.com/images_ae/photo-mg/156261-15643362.jpg", "type": 0 })
//        users.push({ "login": "newsorel", "name": "Орловское медиа", "about": "В Орле подрядчику пришлось в суде выбивать оплату за ремонт библиотеки.", "imgUrl": "https://www.strictlytablesandchairs.co.uk/pub/media/catalog/product/cache/014b90b552b8d6a67d9faf0ca0e5ab2d/s/q/square-banqueting-table-cloth_4.jpg", "type": 1 })

//        return users
//    }
//}





////-- api

//async function ApiUserBio() {
//    const response = await fetch("/api/UserBio", {
//        method: "GET",
//        headers: {
//            "Accept": "application/json",
//            "Authorization": "Bearer " + localStorage.getItem("authJWToken"),
//            "SessionId": localStorage.getItem("sessionId")
//        }
//    });
//    if (response.ok === true)
//        return await response.json();
//    return null;
//}