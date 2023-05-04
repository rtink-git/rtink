//-- Tasks
//-- 2023-05-02 Modul нуждается в доработке

export class LocsHtmlBox {
    #Target
    #Position
    #ApiUrl
    #AuthJWToken
    #RoleId

    Name
    Page

    #UrlContent
    #ListChecked
    //#Take

    constructor(target, position, apiUrl, authJWToken, RoleId, MinifyExpansion=null) {
        this.#Target = target
        this.#Position = position
        this.#ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken
        this.#RoleId = RoleId

        this.Name = this.constructor.name
        let url = "/PageComponents/" + this.Name;
        this.#UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);

        this.Page = 1;
    }

    // Добавляем все базовые локации (страны)

    async AppendBaseList() {
        let list = await this.#ApiUsersAsLocations()

        if (list != null && list.length > 0) {
            if (this.Page == 1) {
                //-- Добавляем главный html блок - UL

                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())

                this.#ListChecked = await this.#ApiUsersLocationsChecked()
            }

            //-- Добавляем строки в главный html блок - UL -> LI

            list.forEach(e => {
                document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e.login))
                if (e.hasChildrens) this.#MoreChildrensButtonHtmlBoxAppend(e.login)

                if (document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB") != null)
                    document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
                        let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                        let isSubscribed = mT.getAttribute("data-issubscribed")
                        let userSubscriptionSet = await this.#ApiUserSubscriptionSet(e.login)
                        if (userSubscriptionSet.ok) {
                            if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false)
                            else mT.setAttribute("data-issubscribed", true)
                            this.#ListChecked = await this.#ApiUsersLocationsChecked()
                        }
                    });
            });

            if (this.#ListChecked.length > 0) {
                this.#ListChecked.forEach(e => { 
                    let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                    if (mT != null) {
                        mT.setAttribute("data-issubscribed", true)
                    }
                    else {
                        e.parentLogins.forEach(ee => {
                            let mTx = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + ee + "\"]");
                            if (mTx.getAttribute("data-issubscribed") == "false")
                                mTx.setAttribute("data-issubscribed", "wait")
                        })
                    }
                })
            }
        }
    }





    //-- html parts

    #HtmlPart() {
        let html = "\
        <div id=\"" + this.Name + "\">\
            <ul>\
            </ul>\
        </div>"

        return html;
    }

    #ItemHtmlBox(login, parentLogin = null) {
        let parentLoginAttr = ""
        if (parentLogin != null)
            parentLoginAttr = "data-parentLogin=\"" + parentLogin + "\"";

        let _shtml = "";
        if (this.#RoleId > 0)
            _shtml = "\
            <a class=\"_SelectLocB\">\
                <img />\
            </a>"

        let html = "\
        <li>\
            <div data-login=\"" + login + "\"  " + parentLoginAttr + " data-isSubscribed=\"false\">\
                <a href=\"/i/-" + login + "\">\
                    <span>\
                    " + login + "\
                    </span>\
                </a>\
                " + _shtml + "\
            </div>\
        </li>"

        return html;
    }

    #ItemLineHtmlBoxAppend(login) {
        let html = "\
        <div class=\"_LineB\">\
        </div>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)
    }

    // Кнопка, которая позволяет отобразить подлокации этой локации

    async #MoreChildrensButtonHtmlBoxAppend(login) {
        let html = "\
        <a class=\"_HasChildrensB\">\
            <img src=\"" + this.#UrlContent + "/arrow-down-black.png\" />\
        </a>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._HasChildrensB").addEventListener('click', async (event) => {
            let parentT = event.target.closest("._HasChildrensB");
            let dataLoading = parentT.getAttribute("data-loading")

            // Подгружаем строки если они еще не подгружены + отображаем / скрываем

            if (dataLoading == null || dataLoading == "false") {
                let list = await this.#ApiUserChildrensAsLocations(login);
                if (list.length > 0) {
                    list.forEach(e => {
                        event.target.closest("li").insertAdjacentHTML("afterend", this.#ItemHtmlBox(e.login, login))
                        if (e.hasChildrens) this.#MoreChildrensButtonHtmlBoxAppend(e.login)
                        this.#ItemLineHtmlBoxAppend(e.login)

                        if (document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB") != null)
                            document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
                                let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                                let isSubscribed = mT.getAttribute("data-issubscribed")
                                let userSubscriptionSet = await this.#ApiUserSubscriptionSet(e.login)
                                if (userSubscriptionSet.ok) {
                                    if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false)
                                    else mT.setAttribute("data-issubscribed", true)

                                    this.#ListChecked = await this.#ApiUsersLocationsChecked()
                                }
                            });
                    })

                    parentT.setAttribute("data-loading", true)
                    parentT.setAttribute("data-display", true)

                    let mTy = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]")

                    if (mTy.getAttribute("data-issubscribed") == "false" || mTy.getAttribute("data-issubscribed") == "wait") {
                        if (this.#ListChecked.length > 0) {
                            this.#ListChecked.forEach(e => {
                                let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                                if (mT != null) {
                                    mT.setAttribute("data-issubscribed", true)
                                }
                                else {
                                    e.parentLogins.forEach(ee => {
                                        let mTx = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + ee + "\"]");
                                        if (mTx.getAttribute("data-issubscribed") == "false")
                                            mTx.setAttribute("data-issubscribed", "wait")
                                    })
                                }
                            })
                        }
                    }
                    else if (mTy.getAttribute("data-issubscribed") == "true") {
                        list.forEach(e => {
                            let mTz = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]")
                            mTz.setAttribute("data-issubscribed", "null")
                        });
                    }
                }
            }
            else if (parentT.getAttribute("data-display") == "true") {
                document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
                    e.closest("li").style.display = "none"
                })
                parentT.setAttribute("data-display", false)
            }
            else {
                document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
                    e.closest("li").style.display = "list-item"
                    //e.closest("li").querySelector("div").setAttribute("data-issubscribed", "false")
                    //document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").setAttribute("data-issubscribed", "false")

                })
                parentT.setAttribute("data-display", true)


                // Скрываем всех детей детей - добавить код, когда появится соответствующий пример


                //-----

                if (mTy.getAttribute("data-issubscribed") == "false" || mTy.getAttribute("data-issubscribed") == "wait") {
                    if (this.#ListChecked.length > 0) {
                        this.#ListChecked.forEach(e => {
                            let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                            if (mT != null) {
                                mT.setAttribute("data-issubscribed", true)
                            }
                            else {
                                e.parentLogins.forEach(ee => {
                                    let mTx = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + ee + "\"]");
                                    if (mTx.getAttribute("data-issubscribed") == "false")
                                        mTx.setAttribute("data-issubscribed", "wait")
                                })
                            }
                        })
                    }
                }
                else if (mTy.getAttribute("data-issubscribed") == "true") {
                    document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").setAttribute("data-issubscribed", "null")
                }
            }
        });
    }

    





    //-- api actions

    async #ApiUsersAsLocations() {
        const response = await fetch(this.#ApiUrl + "/Base/Users/AsLocation", {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUserChildrensAsLocations(login) {
        const response = await fetch(this.#ApiUrl + "/Base/User/Childrens/AsLocation?login=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUsersLocationsChecked() {
        const response = await fetch(this.#ApiUrl + "/Base/Users/Locations/Checked", {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiUserSubscriptionSet(login) {
        const response = await fetch(this.#ApiUrl + "/RtInk/UserSubscriptionSet?userLogin=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }
}

//export class LocsHtmlBox {
//    #Target
//    #Position
//    #ApiUrl
//    #AuthJWToken

//    Name
//    Page

//    #UrlContent
//    //#Take

//    constructor(target, position, apiUrl, authJWToken) {
//        this.#Target = target
//        this.#Position = position
//        this.#ApiUrl = apiUrl
//        this.#AuthJWToken = authJWToken

//        this.Name = "LocsHtmlBox"
//        let url = "/PageComponents/" + this.Name;
//        this.#UrlContent = url + "/content"
//        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

//        this.Page = 1;
//        //this.#Take = 50;
//    }

//    async AppendList() {
//        let list = await this.#ApiUsersAsLocations()
//        let listCh = await this.#ApiUsersLocationsChecked()
//        //alert(listCh.length)
//        if (list != null && list.length > 0)
//            if (this.Page == 1)
//                this.#Target.insertAdjacentHTML(this.#Position, this.#HtmlPart())

//        list.forEach(e => {
//            document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this.#ItemHtmlBox(e.login, e.isSubscribed))
//            if (e.hasChildrens) this.#ItemHasChildrensButtonHtmlBoxAppend(e.login)
//            this.#ItemSelectLocButtonHtmlBoxAppend(e.login)
//            if (!e.isSubscribed) {
//                //    //alert(listCh.length)
//                //    //listCh.forEach(ee => {
//                //    //    if (login == e.login) {
//                //    //        alert("df")
//                //    //    }
//                //    //})
//                //alert(listCh.length)
//                for (var i = 0; i < listCh.length; i++) {
//                    for (var j = 0; j < listCh[i].parentLogins.length; j++)
//                        if (e.login == listCh[i].parentLogins[j]) {
//                            //alert(listCh[i].login)
//                            let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]")
//                            mT.setAttribute("data-isSubscribed", "wait")
//                        }
//                    if (e.login == listCh[i].login) {
//                        alert("df")
//                        //alert(listCh[i].login)
//                        let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]")
//                        mT.setAttribute("data-isSubscribed", "true")
//                    }
//                }
//            }

//        })

//        this.Page++;
//    }

//    //-- html parts

//    #HtmlPart() {
//        let html = "\
//        <div id=\"" + this.Name + "\">\
//            <ul>\
//            </ul>\
//        </div>"

//        return html;
//    }

//    #ItemHtmlBox(login, isSubscribed, parentLogin = null) { 
//        let parentLoginAttr = ""
//        if (parentLogin != null)
//            parentLoginAttr = "data-parentLogin=\"" + parentLogin + "\"";

//        let html = "\
//        <li>\
//            <div data-login=\"" + login + "\"  " + parentLoginAttr + " data-isSubscribed=\"" + isSubscribed + "\">\
//                <a href=\"/i/-" + login + "\">\
//                    <span>\
//                    " + login + "\
//                    </span>\
//                </a>\
//            </div>\
//        </li>"

//        return html;
//    }

//    async #ItemHasChildrensButtonHtmlBoxAppend(login) {
//        let html = "\
//        <a class=\"_HasChildrensB\" data-type=\"\", data-display=\"false\" data-childrensAppended=\"false\">\
//            <img src=\"" + this.#UrlContent + "/arrow-down-black.png\" />\
//        </a>"

//        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)

//        let listCh = await this.#ApiUsersLocationsChecked()

//        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._HasChildrensB").addEventListener('click', async (event) => {
//            let parentT = event.target.closest("._HasChildrensB");
//            let dataDisplay = parentT.getAttribute("data-display")
//            if (dataDisplay == "false") {
//                if (parentT.getAttribute("data-childrensAppended") == "false") {
//                    let list = await this.#ApiUserChildrensAsLocations(login);
//                    if (list.length > 0) {
//                        list.forEach(e => {
//                            event.target.closest("li").insertAdjacentHTML("afterend", this.#ItemHtmlBox(e.login, e.isSubscribed, login))
//                            if (e.hasChildrens) this.#ItemHasChildrensButtonHtmlBoxAppend(e.login)
//                            else this.#ItemSelectLocButtonHtmlBoxAppend(e.login)

//                            this.#ItemLineHtmlBoxAppend(e.login)
//                        })
//                    }

//                    parentT.setAttribute("data-childrensAppended", true)
//                    parentT.setAttribute("data-display", true)
//                }
//                else {
//                    document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
//                        e.closest("li").style.display = "block"
//                    })

//                    parentT.setAttribute("data-display", true)
//                }

//                //----------

//                let divT = event.target.closest("div")
//                let isSubscribed = divT.getAttribute("data-issubscribed")

//                if (isSubscribed == "true")
//                    document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
//                        e.setAttribute("data-issubscribed", "true")
//                        e.querySelector("._SelectLocB").style.opacity = 0
//                    })
//                else
//                    document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
//                        e.setAttribute("data-issubscribed", "false")
//                        e.querySelector("._SelectLocB").style.opacity = 0.5
//                    })

//                if (parentT.closest("div").querySelector("._SelectLocB") == null) this.#ItemSelectLocButtonHtmlBoxAppend(login)
//                else parentT.closest("div").querySelector("._SelectLocB").style.display = "block"


//                ////if (!e.isSubscribed) {

//                //for (var i = 0; i < listCh.length; i++) {
//                //    for (var j = 0; j < listCh[i].parentLogins.length; j++)
//                //        if (e.login == listCh[i].parentLogins[j]) {
//                //            //alert(listCh[i].login)
//                //            let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]")
//                //            mT.setAttribute("data-isSubscribed", "wait")
//                //        }
//                //    if (e.login == listCh[i].login) {
//                //        let mTx = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]")
//                //        alert(mTx.getAttribute("data-isSubscribed"))

//                //        //mTx.setAttribute("data-isSubscribed", "true")
//                //    }
//                //}
//                //            //}
//            }
//            else {
//                document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
//                    e.closest("li").style.display = "none"
//                })
//                parentT.setAttribute("data-display", false)
//                //parentT.closest("div").querySelector("._SelectLocB").style.display = "none"
//            }
//        });
//    }

//    #ItemSelectLocButtonHtmlBoxAppend(login) {
//        let html = "\
//        <a class=\"_SelectLocB\">\
//            <img />\
//        </a>"

//        let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]")
//        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] > *:first-child").insertAdjacentHTML('afterend', html)

//        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
//            document.querySelectorAll("#" + this.Name + " > ul > li > div[data-parentlogin=\"" + login + "\"]").forEach(e => {
//                e.closest("li").style.display = "none"
//            })

//            let parentT = event.target.closest("div").querySelector("._HasChildrensB");
//            if (parentT != null)
//                parentT.setAttribute("data-display", false)

//            let isSubscribed = mT.getAttribute("data-issubscribed")
//            let userSubscriptionSet = await this.#ApiUserSubscriptionSet(login)
//            if (userSubscriptionSet.ok) {
//                if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false) //mT.setAttribute("data-isSubscribed", false)
//                else mT.setAttribute("data-issubscribed", true) //mT.setAttribute("data-isSubscribed", true)
//            }
//        });
//    }

//    #ItemLineHtmlBoxAppend(login) {
//        let html = "\
//        <div class=\"_LineB\">\
//        </div>"

//        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)
//    }


//    //-- api actions

//    async #ApiUsersAsLocations() {
//        const response = await fetch(this.#ApiUrl + "/Base/Users/AsLocation", {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
//        });
//        if (response.ok === true) return await response.json();
//        return null;
//    }

//    async #ApiUserChildrensAsLocations(login) {
//        const response = await fetch(this.#ApiUrl + "/Base/User/Childrens/AsLocation?login=" + login, {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
//        });
//        if (response.ok === true) return await response.json();
//        return null;
//    }

//    async #ApiUserSubscriptionSet(login) {
//        const response = await fetch(this.#ApiUrl + "/RtInk/UserSubscriptionSet?userLogin=" + login, {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
//        });
//        if (response.ok === true) return await response.json();
//        return null;
//    }

//    async #ApiUsersLocationsChecked() {
//        const response = await fetch(this.#ApiUrl + "/Base/Users/Locations/Checked", {
//            method: "GET",
//            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
//        });
//        if (response.ok === true) return await response.json();
//        return null;
//    }
//}