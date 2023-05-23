﻿import { Page } from '/PageComponents/Page/script.min.js';
import { HeaderHtmlBox } from '/PageComponents/HeaderHtmlBox/script.min.js';
import { HeaderTitleDescriptionHtmlBox } from '/PageComponents/HeaderTitleDescriptionHtmlBox/script.min.js';
import { LocsHtmlBox } from '/PageComponents/LocsHtmlBox/script.min.js';

let PageModuleUse = new Page({ name: "Locations", title: "Locations - RT" })
await PageModuleUse.Build();
let HeaderHtmlBoxModuleUse = new HeaderHtmlBox(PageModuleUse.MinifiedCode)
let HeaderTitleDescriptionHtmlBoxModuleUse = new HeaderTitleDescriptionHtmlBox(PageModuleUse.MinifiedCode);

//--------------------

let href = "/users"
if (PageModuleUse.Session.RoleId == 0)
    href = "/"
HeaderHtmlBoxModuleUse.PushMenuRow({ "icon": PageModuleUse.UrlContent + "/undo.png", "href": href })
HeaderHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementsByTagName("body")[0], "afterbegin", "")
HeaderTitleDescriptionHtmlBoxModuleUse.InsertAdjacentHTML(document.getElementById("HeaderHtmlBox"), "afterend", "LOCATIONS", "watch & choose")

let locsHtmlBox = new LocsHtmlBox(document.getElementById(HeaderTitleDescriptionHtmlBoxModuleUse.Name), "afterend", PageModuleUse)
await locsHtmlBox.AppendList()