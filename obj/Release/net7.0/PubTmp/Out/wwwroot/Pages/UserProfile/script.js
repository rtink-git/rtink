const UserProfileUrl = "/Pages/UserProfile";

let UserProfileCss = document.createElement("link");
UserProfileCss.setAttribute("rel", "stylesheet");
UserProfileCss.setAttribute("href", UserProfileUrl + "/style.css");
document.head.append(UserProfileCss);

window.onload = async function () {
    await window.RefreshJSTokenAsync();

    //-- data from url -----

    let dataLogin = ""
    let urlSrplit = document.URL.split('/')
    if (urlSrplit.length > 4)
        dataLogin = urlSrplit[4];

    //-- data from server model -----

    let dataName = null
    let dataAbout = null

    //-- data from server model api get -----

    let apiGetUserNameResponse = await ApiUserProfilePage(dataLogin)
    if (apiGetUserNameResponse.ok) {
        let jsn = await apiGetUserNameResponse.json()
        dataName = jsn.name
        dataAbout = jsn.about
    }

    //-- html build -----

    if (dataName == null || dataAbout == null) {
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", LoadingHtmlPart("/i/-" + dataLogin, "/Pages/i/content/loop.png", "LOADING", "PREVIOS PAGE"))
        document.getElementById("LoadingHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("LoadingHtmlPart").offsetHeight) / 2) + "px";
    }
    else {
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", EditProfileHtmlPart(dataLogin, dataName, dataAbout))
        document.getElementById("EditProfileHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("EditProfileHtmlPart").offsetHeight) / 2) + "px";
    }

    //-- html actions

    document.querySelector("#EditProfileHtmlPart > div > div > a").addEventListener('click', async () => {
        let loginNew = document.querySelector("#EditProfileHtmlPart input[name=\"login\"]").value
        let nameNew = document.querySelector("#EditProfileHtmlPart input[name=\"name\"]").value
        let aboutNew = document.querySelector("#EditProfileHtmlPart textarea").value
        let ApiEditProfileResponse = await ApiEditProfile(dataLogin, nameNew, loginNew, aboutNew)
        if (ApiEditProfileResponse.ok) {
            document.getElementById("EditProfileHtmlPart").style.display = "none"
            document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", LoadingHtmlPart("/i/-" + dataLogin, "/Pages/i/content/check.png", "CHANGED CORRECTLY", "USER PAGE"))
            document.getElementById("LoadingHtmlPart").style.marginTop = ((document.documentElement.offsetHeight - document.getElementById("LoadingHtmlPart").offsetHeight) / 2) + "px";
            setTimeout(function () { window.location.href = "/i/-" + loginNew }, 1000);
        }
    });

    document.querySelector("#_logo").addEventListener('click', async () => {
        document.getElementById("imgupload").click()
    });

    // Select your input type file and store it in a variable
    const input = document.getElementById('imgupload');

    // This will upload the file after having read it
    //const upload = (file) => {
    //    fetch("/upload-avatar", { // Your POST endpoint
    //        method: 'POST',
    //        body: file // This is your file object
    //    }).then(
    //        response => response.json() // if the response is a JSON object
    //    ).then(
    //        success => console.log(success) // Handle the success response object
    //    ).catch(
    //        error => console.log(error) // Handle the error response object
    //    );
    //};
    //function saveImage(image) {
    //    var form = new FormData()
    //    form.append('image', image)
    //    alert("s")
    //    this.http.fetch('/api/Images', {
    //        method: 'POST',
    //        //headers: { 'Content-Type': image.type },
    //        body: form
    //    })
    //        .then(response => {
    //            return response
    //        })
    //        .catch(error => {
    //            console.log("Some Failure...");
    //            throw error.content;
    //        })

    //    return true;
    //}

    //// Event handler executed when a file is selected
    //const onSelectFile = () => saveImage(input.files[0]);

    //// Add a listener on your input
    //// It will be triggered when a file will be selected
    //input.addEventListener('change', onSelectFile(), false);
    input.addEventListener('change', async () => {

        const file = document.getElementById("imgupload"); //the File Upload input
        const formdata = new FormData();
        formdata.append("file", file.files[0], dataLogin + ".jpg");
        const response = await fetch("/user-logo-upload", { // Your POST endpoint
            method: "POST",
            body: formdata // This is your file object
        })

        if (response.ok)
            window.location.href = "/user-profile/" + dataLogin;
        else {

        }
    });
};





//-- html page components

function LoadingHtmlPart(urlPrev, urlImg, txt, prevText) {
    let html = "\
        <div id=\"LoadingHtmlPart\">\
            <img src=\"/Pages/i/content/loading-gif-transparent-13.gif\" />\
            <a href=\""+ document.URL + "\"><img src=\"" + urlImg + "\" /></a>\
            <p>" + txt + "</p>\
            <p><a href=\"" + urlPrev + "\">" + prevText + "</a><p/>\
        </div>"
    return html
}

function EditProfileHtmlPart(login, name, title) {
    let html = "\
        <div id=\"EditProfileHtmlPart\">\
            <div>\
                <h1>\
                    Редактировать профиль\
                </h1>\
                <div>\
                    <div>\
                        <a id=\"_logo\">\
                            <img src=\"/user-logo/" + login + ".jpg\" />\
                            <img src=\"/Pages/UserProfile/content/direct-download-white.png\" />\
                        </a>\
                        <input id=\"imgupload\" type=\"file\" accept=\"image/jpeg\" style=\"display:none;\">\
                    </div>\
                    <input name=\"login\" type=\"text\" placeholder=\"Login\" value=\"" + login + "\" />\
                    <input name=\"name\" type=\"text\" placeholder=\"Name\"  value=\"" + name + "\" />\
                    <textarea placeholder=\"Описание пользователя\">" + title + "</textarea>\
                    <a id=\"_submit\">\
                        Изменить\
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





//-- api

async function ApiUserProfilePage(login) {
    const response = await fetch("/api/UserProfilePage?login=" + login, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response
}

async function ApiEditProfile(loginPrev, name, login, about) {
    const response = await fetch("/api/EditProfile?loginPrev=" + loginPrev + "&name=" + name + "&login=" + login + "&about=" + about, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authJWToken")
        }
    });
    return response
}