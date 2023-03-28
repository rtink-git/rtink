const ArticleAddeUrl = "/Pages/ArticleAdd";

let UserProfileCss = document.createElement("link");
UserProfileCss.setAttribute("rel", "stylesheet");
UserProfileCss.setAttribute("href", ArticleAddeUrl + "/style.css");
document.head.append(UserProfileCss);

window.onload = async function () {
    await window.RefreshJSTokenAsync();

    //-- data from url -----

    let dataLogin = ""
    let urlSrplit = document.URL.split('/')
    if (urlSrplit.length > 4)
        dataLogin = urlSrplit[4];


    //-- html build -----

    if (dataLogin != null) {
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", ArticleAddHtmlPart(dataLogin))
        document.getElementById("ArticleAddHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("ArticleAddHtmlPart").offsetHeight) / 2) + "px";
    }
    else {
        window.location.href = "/i/-" + dataLogin
    }





    //-- html actions

    if (document.querySelector("#ArticleAddHtmlPart > div > div > a") != null)
        document.querySelector("#ArticleAddHtmlPart > div > div > a").addEventListener('click', async () => {
            //alert(document.getElementsByTagName("textarea")[0].value);
            let rsp = await ApiArticlePost(document.getElementsByTagName("textarea")[0].value)
            if (rsp.ok) {
                document.getElementById("ArticleAddHtmlPart").style.display = "none"
                document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", LoadingHtmlPart("/i/-" + dataLogin, "/Pages/i/content/check.png", "ADD CORRECTLY", "USER PAGE"))
                document.getElementById("LoadingHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("LoadingHtmlPart").offsetHeight) / 2) + "px";
                setTimeout(function () { window.location.href = "/i/-" + dataLogin }, 1000);
            }
            else {
                document.getElementById("ArticleAddHtmlPart").style.display = "none"
                document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", LoadingHtmlPart("/i/-" + dataLogin, "/Pages/i/content/cross.png", "NOT ADDED", "USER PAGE"))
                document.getElementById("LoadingHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("LoadingHtmlPart").offsetHeight) / 2) + "px";
                setTimeout(function () { window.location.href = "/i/-" + dataLogin }, 1000);
            }
        });
}





//-- html page components

function ArticleAddHtmlPart(login) {
    let html = "\
        <div id=\"ArticleAddHtmlPart\">\
            <div>\
                <h1>\
                    Новая публикация\
                </h1>\
                <div>\
                    <textarea placeholder=\"Max длина 256 символов\" minlength=\"12\" maxlength=\"256\"></textarea>\
                    <a>\
                        Добавить\
                    </a>\
                </div>\
                <p>\
                    <a href=\"/i/-" + login + "\">\
                        Вернуться на страницу пользователя\
                    </a>\
                </p>\
            </div>\
        </div>";
    return html;
}

function LoadingHtmlPart(urlPrev, urlImg, txt, prevText) {
    let html = "\
        <div id=\"LoadingHtmlPart\">\
            <img src=\"/Pages/i/content/loading-gif-transparent-13.gif\" />\
            <a href=\"" + document.URL + "\"><img src=\"" + urlImg + "\" /></a>\
            <p>" + txt + "</p>\
            <p><a href=\"" + urlPrev + "\">" + prevText + "</a><p/>\
        </div>"
    return html
}



//-- api

async function ApiArticlePost(title) {
    const response = await fetch("/api/Article", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        },
        body: JSON.stringify({ title: title })
    });
    return response
}