﻿//-- Tasks
//-- 2023-05-02 Modul нуждается в доработке

export class LocsHtmlBox {
    _Target
    _Position
    _Page

    _UrlContent
    _CheckedList

    Name
    Page

    constructor(target, position, page) {
        this._Target = target
        this._Position = position
        this._Page = page

        this.Name = this.constructor.name
        let url = "/PageComponents/" + this.Name;
        this._UrlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style" + this._Page.MinifiedCode + ".css"); document.head.append(css);

        this.Page = 1;
    }

    // Добавляем все базовые локации

    async AppendList() {
        let list = await this._ApiUsersAsLocations()
        if (list != null && list.length > 0) {
            if (this.Page == 1) {
                //-- Добавляем главный html блок - UL

                this._Target.insertAdjacentHTML(this._Position, this._HtmlPart());

                this._CheckedList = await this._ApiUsersLocationsChecked();
            }

            //-- Добавляем строки в главный html блок - UL -> LI

            list.forEach(e => {
                document.querySelector("#" + this.Name + " > ul").insertAdjacentHTML("beforeend", this._ItemHtmlBox(e.login))
                if (e.hasChildrens) this._MoreChildrensButtonHtmlBoxAppend(e.login)
                    if (document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB") != null)
                        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
                            let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                            let isSubscribed = mT.getAttribute("data-issubscribed")
                            let userSubscriptionSet = await this._ApiUserSubscriptionSet(e.login)
                            if (userSubscriptionSet.ok) {
                                if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false)
                                else mT.setAttribute("data-issubscribed", true)
                                this._CheckedList = await this._ApiUsersLocationsChecked()
                            }
                        });
            });

            if (this._CheckedList.length > 0) {
                this._CheckedList.forEach(e => {
                    let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                    if (mT != null) {
                        mT.setAttribute("data-issubscribed", true)
                    }
                    else {
                        e.parentLogins.forEach(ee => {
                            let mTx = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + ee + "\"]");
                            if (mTx.getAttribute("data-issubscribed") == "false")
                                mTx.setAttribute("data-issubscribed", "wait")
                        });
                    }
                })
            }
        }
    }

    // Кнопка, которая позволяет отобразить подлокации этой локации

    async _MoreChildrensButtonHtmlBoxAppend(login) {
        let html = "\
<a class=\"_HasChildrensB\">\
    <img src=\"" + this._UrlContent + "/arrow-down-black.png\" />\
</a>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"] ._HasChildrensB").addEventListener('click', async (event) => {
            let parentT = event.target.closest("._HasChildrensB");
            let dataLoading = parentT.getAttribute("data-loading")

            // Подгружаем строки если они еще не подгружены + отображаем / скрываем

            if (dataLoading == null || dataLoading == "false") {
                let list = await this._ApiUserChildrensAsLocations(login);
                if (list.length > 0) {
                    list.forEach(e => {
                        event.target.closest("li").insertAdjacentHTML("afterend", this._ItemHtmlBox(e.login, login))
                        if (e.hasChildrens) this._MoreChildrensButtonHtmlBoxAppend(e.login)
                        this._ItemLineHtmlBoxAppend(e.login)

                        if (document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB") != null)
                            document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"] ._SelectLocB").addEventListener('click', async (event) => {
                                let mT = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + e.login + "\"]");
                                let isSubscribed = mT.getAttribute("data-issubscribed")
                                let userSubscriptionSet = await this._ApiUserSubscriptionSet(e.login)
                                if (userSubscriptionSet.ok) {
                                    if (isSubscribed == "true") mT.setAttribute("data-issubscribed", false)
                                    else mT.setAttribute("data-issubscribed", true)

                                    this._CheckedList = await this._ApiUsersLocationsChecked()
                                }
                            });
                    });

                    parentT.setAttribute("data-loading", true)
                    parentT.setAttribute("data-display", true)

                    let mTy = document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]")

                    if (mTy.getAttribute("data-issubscribed") == "false" || mTy.getAttribute("data-issubscribed") == "wait") {
                        if (this._CheckedList.length > 0) {
                            this._CheckedList.forEach(e => {
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
                            });
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

                });
                parentT.setAttribute("data-display", true)


                // Скрываем всех детей детей - добавить код, когда появится соответствующий пример


                //-----

                if (mTy.getAttribute("data-issubscribed") == "false" || mTy.getAttribute("data-issubscribed") == "wait") {
                    if (this._CheckedList.length > 0) {
                        this._CheckedList.forEach(e => {
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




    //-- html parts

    _HtmlPart() {
        let html = "\
<div id=\"" + this.Name + "\">\
    <ul>\
    </ul>\
</div>"

        return html;
    }

    _ItemHtmlBox(login, parentLogin = null) {
        let parentLoginAttr = ""
        if (parentLogin != null)
            parentLoginAttr = "data-parentLogin=\"" + parentLogin + "\"";

        let _shtml = "";
        if (this._Page.RoleId > 0)
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

    _ItemLineHtmlBoxAppend(login) {
        let html = "\
<div class=\"_LineB\">\
</div>"

        document.querySelector("#" + this.Name + " > ul > li > div[data-login=\"" + login + "\"]").insertAdjacentHTML('beforeend', html)
    }



    //-- api ations

    async _ApiUsersAsLocations() {
        const response = await fetch(this._Page.UrlApi + "/Base/Users/AsLocation", {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._Page.Session.Token }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async _ApiUsersLocationsChecked() {
        const response = await fetch(this._Page.UrlApi + "/Base/Users/Locations/Checked", {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._Page.Session.Token }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async _ApiUserSubscriptionSet(login) {
        const response = await fetch(this._Page.UrlApi + "/RtInk/UserSubscriptionSet?userLogin=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._Page.Session.Token }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async _ApiUserChildrensAsLocations(login) {
        const response = await fetch(this._Page.UrlApi + "/Base/User/Childrens/AsLocation?login=" + login, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this._Page.Session.Token }
        });
        if (response.ok === true) return await response.json();
        return null;
    }
}