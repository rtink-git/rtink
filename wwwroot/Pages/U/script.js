const UsersUrl = "/Pages/U";

let UsersCss = document.createElement("link"); UsersCss.setAttribute("rel", "stylesheet"); UsersCss.setAttribute("href", UsersUrl + "/style.css"); document.head.append(UsersCss);

window.onload = async function () {
    let urlComeBack = "/"
    try {
        let urlLoginSplit = document.URL.split('/')
        if (urlLoginSplit.length == 5) {
            urlComeBack = "/i/-" + urlLoginSplit[4]

            await window.RefreshJSTokenAsync();

            let isAuthorDataApi = false;
            let isLogoDataApi = false;

            let menuList = []
            if (window.userRoleId > 0 && isAuthorDataApi)
                menuList.push({ "icon": UsersUrl + "/content/logout.png", "href": "", "id": "Signout" });
            new window.HeaderBox(document.getElementsByTagName("body")[0], "afterbegin", "USER", "", "/i/-" + urlLoginSplit[4], menuList)

            new MainBox(document.getElementById("HeaderBox"), "afterend")
        }
        else
            new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "afterbegin", "", "", "ERROR 404", "", "COME BACK", urlComeBack)
    }
    catch {
        document.querySelector("body > *").style.display = "none";
        new window.CentralHtmlPart(document.getElementsByTagName("body")[0], "afterbegin", "", "", "ERROR 404", "", "COME BACK", urlComeBack)
    }
}





//-- actions

if (document.getElementById("Signout") != null)
    document.getElementById("Signout").addEventListener('click', async () => {
        if (await ApiSignout(document.getElementsByTagName("body")[0], "afterbegin"))
            window.location.href = "/"
    });





//-- html page components

class MainBox {
    constructor(target, position) {
        let html = "\
            <div id=\"MainBox\">\
                <div id=\"_UserProfile\">\
                    <img src=\"https://pyxis.nymag.com/v1/imgs/fde/459/91443e2d311ad3302473a89ab907a126f7-beyonce.rsquare.w330.jpg\" />\
                    <h1>РЕАЛЬНОЕ ВРЕМЯ</h1>\
                    <p id=\"_UserLogin\">\
                        <a>@cnn_news</a>\
                    </p>\
                    <p id=\"_UserDescription\"><span>45th President of the United States of America🇺🇸</span></p>\
                    <p id=\"_UserLocation\"><img src=\"" + UsersUrl + "/content/placeholder.png\" /><span>Moscow, Russia</span></p>\
                    <p id=\"_UserLink\"><img src=\"" + UsersUrl + "/content/link.png\" /><a>neftegaz.ru</a></p>\
                </div>\
                <div class=\"_UserFollowBox\">\
                    <div class=\"_ListBox\">\
                        <h1>\
                            123 - ЧИТАЕТ\
                        </h1>\
                        <ul>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @apple\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @orange\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @bbc_news\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @werweerfewew\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @yandex_ru\
                                </a>\
                            </li>\
                        <ul>\
                    </div>\
                    <div class=\"_ListBox\">\
                        <h1>\
                            654 - ЧИТАТЕЛЯ(-ЕЙ)\
                        </h1>\
                        <ul>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @elon_mask\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @bill_geits\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @marktsukerberg\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @hhh_reddifert\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @retwit\
                                </a>\
                            </li>\
                        <ul>\
                    </div>\
                </div>\
                <div class=\"_UserFollowBox\">\
                    <div class=\"_ListBox\">\
                        <h1>\
                            RECOMENDED\
                        </h1>\
                        <ul>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @sadsaddadsaa\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @powerbank\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @comparer\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @microscop\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    @loricat\
                                </a>\
                            </li>\
                        <ul>\
                    </div>\
                    <div class=\"_ListBox\">\
                        <h1>\
                            LAST ARTICLES\
                        </h1>\
                        <ul>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    В Магадане открылся молодежный православный клуб\
                                </a>\
                            </li>\
                            <li>\
                                <a>\
                                    <img />\
                                </a>\
                                <a>\
                                    Росреестр: госпошлина уменьшилась с 2000 рублей до 350\
                                </a>\
                            </li>\
                        <ul>\
                    </div>\
                </div>\
            </div>"

        target.insertAdjacentHTML(position, html)
    }
}





//-- api

async function ApiSignout() {
    const response = await fetch("/api/signout", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response.ok
}