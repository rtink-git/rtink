//-- Knowledge Library
//-- JS: Private class features: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

export class ArticlesHtmlBox {
    target
    position
    page
    take
    search
    ApiUrl
    #AuthJWToken
    IsTest
    #name
    #list

    constructor(target, position, search, apiUrl, authJWToken, isTest) {
        this.#name = "ArticlesHtmlBox"
        let url = "/PageComponents/" + this.#name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        this.target = target
        this.position = position
        this.search = search;
        this.ApiUrl = apiUrl
        this.#AuthJWToken = authJWToken
        this.IsTest = isTest
        this.page = 1;
        this.take = 20;

        this.#list = new Array();
    }

    async ListAppend() {
        let list = await this.#ApiAticles()
        list.forEach(e => { this.#list.push({ "title": e.title, "urlShort": e.urlShort, "fileId": e.fileId, "extension": e.extension, "fileUrlSource": e.fileUrlSource, "description": e.description, "dt": e.dt, "login": e.login, "isBody": e.isBody, "titleHb": e.titleHb, "fileUrlSource": e.fileUrlSource, "isBookmark": e.isBookmark, "rating": e.rating, "appended": false, "imgcheck": false, "bookmarkActionAdded": false }) });

        if (this.#list != null && this.#list.length > 0)
            if (this.page == 1)
                this.target.insertAdjacentHTML(this.position, this.#BodyHtmlBox(this.#name))

        document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("beforeend", this.#LisHtmlBox())
        await this.#LoadImages()
        await this.#ListActionSet()

        if (this.page == 1 && this.#list.length == this.take) {
            document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("afterend", this.#MoreButton())

            document.getElementById("MoreButton").addEventListener('click', async () => {
                let list = await this.#ApiAticles()
                list.forEach(e => { this.#list.push({ "title": e.title, "urlShort": e.urlShort, "fileId": e.fileId, "extension": e.extension, "fileUrlSource": e.fileUrlSource, "description": e.description, "dt": e.dt, "login": e.login, "isBody": e.isBody, "titleHb": e.titleHb, "fileUrlSource": e.fileUrlSource, "isBookmark": e.isBookmark, "rating": e.rating, "appended": false, "imgcheck": false, "bookmarkActionAdded": false }) });
                document.querySelector("#" + this.#name + " > ul").insertAdjacentHTML("beforeend", this.#LisHtmlBox())
                await this.#LoadImages()
                await this.#ListActionSet()

                this.page++;
            });
        }

        this.page++;
    }

    //-- Html Boxes

    #BodyHtmlBox(name) {
        let html = "\
        <div id=\"" + name + "\">\
            <ul>\
            </ul>\
        </div>"

        return html;
    }

    #LisHtmlBox() {
        let html = "";

        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let loginFlag = false;
        for (var i = 0; i < this.#list.length; i++)
            if (this.#list[0].login != this.#list[i].login)
                loginFlag = true;

        this.#list.forEach(e => {
            if (!e.appended) {
                let dt = new Date(e.dt);
                let dtnow = new Date()
                dt.setHours(dt.getHours() + (-1) * dt.getTimezoneOffset() / 60)
                let mm = dt.getMinutes().toString();
                if (mm.length == 1) mm = "0" + mm;

                const dtstrbase = months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " · " + dt.getHours() + ":" + mm
                let dtstr = dtstrbase

                let minago = parseFloat(Date.now() - dt) / 1000 / 60
                if (minago < 60) dtstr = parseInt(minago) + " min ago"
                else if (new Date().getFullYear() == dt.getFullYear())
                    if (dtnow.getDate() == dt.getDate()) dtstr = dt.getHours() + ":" + mm
                    else dtstr = months[dt.getMonth()] + " " + dt.getDate()

                let _dtLoginHtmlPartUp = "";
                let _dtLoginHtmlPartDown = "";
                let _dtLoginHtmlPart = this.#DtLoginHtmlPart(dtstr, e.login, loginFlag)
                if (e.rating == 2) _dtLoginHtmlPartDown = _dtLoginHtmlPart
                else _dtLoginHtmlPartUp = _dtLoginHtmlPart

                let _descriptionHtmlPart = "";
                let isDescription = false
                if (e.description != null && e.description != undefined && e.description.length > 0) {
                    _descriptionHtmlPart = e.description;
                    isDescription = true
                }

                html += "\
                <li>\
                    <article data-titleHb=\"" + e.titleHb + "\" data-tp=\"" + e.rating + "\" data-isBody=\"" + e.isBody + "\">\
                        <div>\
                            <h1>\
                                <a href=\"/i/" + e.urlShort + "-\">\
                                    " + e.title + "\
                                </a>\
                            </h1>\
                            " + _dtLoginHtmlPartDown + "\
                        </div>\
                        <img src=\"" + e.fileUrlSource + "\" />\
                        <div id=\"_Description\" data-isDescription=\"" + isDescription + "\">\
                        " + _descriptionHtmlPart + "\
                        </div>\
                        <div id=\"_Inf\">\
                            " + _dtLoginHtmlPartUp + "\
                            <hr />\
                        </div>\
                        <div>\
                            <a class=\"BookmarkButton\" data-isBookmark=\"" + e.isBookmark + "\">\
                                <img />\
                            </a>\
                            <a id=\"_source\" href=\"/a/" + e.urlShort + "\">\
                                source\
                            </a>\
                        </div>\
                    </article>\
                </li>"

                e.appended = true;
            }
        });

        return html;
    }

    #DtLoginHtmlPart(time, login, loginFlag) {
        let loginHtmlPart = ""
        if (loginFlag)
            loginHtmlPart = "<a href=\"/i/-" + login + "\">@" + login.toLowerCase() + "</a>"

        let html = "\
        <div id=\"_DtLoginHtmlPart\">\
            <time>\
                " + time + " · \
            </time>\
            " + loginHtmlPart + "\
        </div>";

        return html;
    }

    #MoreButton() {
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

    //----------

    async #ListActionSet() {
        if (this.#list.length > 0)
            if (this.#list[0].rating == -9223372036854776000) {
                let tr = document.querySelectorAll("article")[0]
                if (this.#list[0].isBody) {
                    let bodyObj = await this.#ApiArticleBody(this.#list[0].titleHb)
                    if (bodyObj != null && bodyObj.body.length > 0) {
                        let dsT = tr.querySelector("#_Description")
                        dsT.innerHTML = bodyObj.body
                        dsT.setAttribute("data-body", true);
                        dsT.setAttribute("data-isDescription", true)
                    }
                } 
            }
        

        for (var i = 0; i < this.#list.length; i++) {
            if (!this.#list[i].bookmarkActionAdded) {
                let tr = document.querySelectorAll("article")[i]
                let trg = tr.getElementsByClassName("BookmarkButton")[0]

                let rating = this.#list[i].rating
                let isBody = this.#list[i].isBody
                let isBookmark = this.#list[i].isBookmark
                let titleHb = this.#list[i].titleHb

                trg.addEventListener("click", async event => {
                    if (rating == 2) {
                        rating = 0;
                        tr.setAttribute("data-tp", rating);
                        var q = tr.querySelector("#_DtLoginHtmlPart")
                        var w = "<div id=\"_DtLoginHtmlPart\">" + q.innerHTML + "</div>";
                        q.remove()
                        tr.querySelector("#_Inf").insertAdjacentHTML("afterbegin", w)
                    }

                    if (isBody) {
                        let bodyObj = await this.#ApiArticleBody(titleHb)
                        if (bodyObj != null && bodyObj.body.length > 0) {
                            let dsT = tr.querySelector("#_Description")
                            dsT.innerHTML = bodyObj.body
                            dsT.setAttribute("data-body", true);
                            dsT.setAttribute("data-isDescription", true)
                        }
                    }              

                    if (isBookmark) {
                        let apiArticleBookmark = await this.#ApiArticleBookmark(titleHb)
                        if (apiArticleBookmark)
                            if (tr.querySelector(".BookmarkButton").getAttribute("data-isBookmark") == "false")
                                tr.querySelector(".BookmarkButton").setAttribute("data-isBookmark", true)
                            else tr.querySelector(".BookmarkButton").setAttribute("data-isBookmark", false)
                    }
                })
            }
        }
    }

    async #LoadImages() {
        for (var i = 0; i < this.#list.length; i++) {
            if (this.#list[i].appended && !this.#list[i].imgcheck && this.#list[i].fileId > 0) {
                let tr = document.querySelectorAll("article")[i];
                let trg = tr.querySelector("img")
                let fileId = this.#list[i].fileId
                let extension = this.#list[i].extension.trim()

                let img = new Image(trg);
                img.onload = function () { trg.style.display = "flex" }
                img.onerror = function () {
                    let srcQ = "https://rt.ink/f/" + fileId + "." + extension
                    trg.setAttribute("src", srcQ);
                    let imgQ = new Image();
                    imgQ.onload = function () { trg.style.display = "flex" }
                    imgQ.src = srcQ
                }
                img.src = this.#list[i].fileUrlSource

                let rating = this.#list[i].rating
                trg.addEventListener("click", async event => {
                    if (rating == 2) {
                        rating = 0;
                        tr.setAttribute("data-tp", rating);
                        var q = tr.querySelector("#_DtLoginHtmlPart")
                        var w = "<div id=\"_DtLoginHtmlPart\">" + q.innerHTML + "</div>";
                        q.remove()
                        tr.querySelector("#_Inf").insertAdjacentHTML("afterbegin", w)
                    }
                });

            }
        }
    }

    //-- Api

    async #ApiAticles() {
        //alert(this.search)
        const response = await fetch(this.ApiUrl + "/RtInk/Articles?search=" + this.search + "&take=" + this.take + "&page=" + this.page, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiArticleBody(titleHb) {
        const response = await fetch(this.ApiUrl + "/RtInk/ArticleBody?titleHb=" + titleHb.toString(), {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + this.#AuthJWToken }
        });
        if (response.ok === true) return await response.json();
        return null;
    }

    async #ApiArticleBookmark(titleHb) {
        const response = await fetch(this.ApiUrl + "/RtInk/ArticleBookmark?titleHb=" + titleHb.toString(), {
            method: "POST",
            headers: { "Authorization": "Bearer " + this.#AuthJWToken }
        });
        return response.ok
    }

    //-- Test

    #ListTest() {
        var list = new Array();

        list.push({
            "title": "Для строительства пяти домов в Саратове проложат новую дорогу за 10 миллионов",
            "urlShort": "8YuJ",
            "fileId": "4779190",
            "extension": "jpeg",
            "description": "ООО «Государственное жилищное строительство» заказывает строительство временной дороги по улицам Николая Нишнева и Федора Пяткова. Линейный объект необходим для строительства жилых...",
            "dt": "2023-02-21 09:18:13.530",
            "login": "saratovnews",
            "isBody": true,
            "titleHb": "385651799697845368",
            "fileUrlSource": "http://www.saratovnews.ru/i/news/big/167759094746.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "В костромских школах появились молодые навигаторы детства",
            "urlShort": "8zBe",
            "fileId": "4796502",
            "extension": "jpeg",
            "description": "В России 2023 год объявлен годом педагога и наставника. Общественное внимание к профессии велико. В регионе действует программа поддержки молодых педагогов и сельских учителей. В школах области появляются и новые должности.",
            "dt": "2023-02-22 10:18:13.530",
            "login": "419",
            "isBody": true,
            "titleHb": "4197287898088108026",
            "fileUrlSource": "https://yakutia.info/uploads/images/23/03/4HeH0ZDVTI.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "«Министр сам выглядит как шутка»: Собчак раскритиковала идею Коробченко",
            "urlShort": "8zeP",
            "fileId": "4782063",
            "extension": "jpeg",
            "description": "Журналистка Ксения Собчак в своем Telegram-канале обратила внимание на слова главы министерства промышленности и торговли Татарстана Олега Коробченко о курьерах и таксистах.",
            "dt": "2023-02-23 11:18:13.530",
            "login": "inkazan",
            "isBody": false,
            "titleHb": "1383830501521908224",
            "fileUrlSource": "https://inkazan.ru/attachments/3ced69c4c7baf58f32d9c65eb1ecaedbaa26f429/store/crop/0/0/1600/900/1600/900/0/ab85470eb06645d5896aaba9030fb09440d8e86c1168b3b578c5b86cfb4e/1677612804921.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "Из Смоленского горсовета «сбежал» депутат от КПРФ",
            "urlShort": "8Yxs",
            "fileId": "0",
            "extension": "",
            "description": "Член фракции КПРФ в Смоленском городском Совете Анатолий Смирнов написал заявление по собственному. Депутаты Смоленского городского Совета проголосовали за сложение полномочий своего коллеги Анатолия Смирнова. 31-летний «народный избранник», попавший в гор",
            "dt": "2023-02-24 12:18:13.530",
            "login": "ura_ru",
            "isBody": true,
            "titleHb": "3888361008586626457",
            "fileUrlSource": "",
            "isBookmark": false
        })
        list.push({
            "title": "Бесплатный автобус начал курсировать в одном из поселков Карелии",
            "urlShort": "8Yrz",
            "fileId": "0",
            "extension": "",
            "description": "Бесплатный общественный транспорт запустили в поселке Шуя.Сообщение",
            "dt": "2023-02-24 12:18:13.530",
            "login": "ura_ru",
            "isBody": false,
            "titleHb": "4534756579325805762",
            "fileUrlSource": "",
            "isBookmark": false
        })
        list.push({
            "title": "Профессор консерватории из Китая провела мастер-класс в пензенском музыкальном колледже",
            "urlShort": "8Ytb",
            "fileId": "4779024",
            "extension": "jpeg",
            "description": "",
            "dt": "2023-02-25 13:18:13.530",
            "login": "485",
            "isBody": true,
            "titleHb": "-601280397348676017",
            "fileUrlSource": "https://riapo.ru/upload/sachenkova/0000/37/Picsart_23-02-27_20-01-56-180-01.jpeg",
            "isBookmark": false
        })
        list.push({
            "title": "В Курске жители дома на Ломоносова после обрушения стены отказались от временного жилья",
            "urlShort": "8zar",
            "fileId": "4781017",
            "extension": "jpeg",
            "description": "",
            "dt": "2023-02-25 13:18:13.530",
            "login": "gtrkkursk",
            "isBody": false,
            "titleHb": "6450696506356080411",
            "fileUrlSource": "https://gtrkkursk.ru/sites/default/files/news/34656/preview-193282253.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "Житель Новотроицка угрожал полицейскому канцелярскими ножницами",
            "urlShort": "8z6R",
            "fileId": "4780631",
            "extension": "jpeg",
            "description": "",
            "dt": "2023-02-26 14:18:13.530",
            "login": "82",
            "isBody": false,
            "titleHb": "323052367523952910",
            "fileUrlSource": "https://orengrad.ru/wp-content/uploads/2022/11/naruchniki.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "Курганцы борются за звание лучших знатоков вопросов ЖКХ",
            "urlShort": "8ZAn",
            "fileId": "",
            "extension": "",
            "description": "",
            "dt": "2023-02-27 15:18:13.530",
            "login": "428",
            "isBody": false,
            "titleHb": "-6073403562271064268",
            "fileUrlSource": "",
            "isBookmark": false
        })
        list.push({
            "title": "Михаил Власов из Солнечногорска стал лучшим универсальным специалистом МФЦ в Подмосковье",
            "urlShort": "8ZLc",
            "fileId": "0",
            "extension": "",
            "description": "Данный региональный конкурс проводится в 9 раз. Чтобы получить звание «Лучший универсальный специалист МФЦ», участники прошли три этапа: профессиональный отбор, тестирование на знание госуслуг и финальное собеседование с экспертной комиссией.",
            "dt": "2023-02-28 16:18:13.530",
            "login": "446",
            "isBody": false,
            "titleHb": "-5916711952845761423",
            "fileUrlSource": "",
            "isBookmark": false
        })
        list.push({
            "title": "Калининградка хотела прыгнуть с моста и попала на камеры «Безопасного города»",
            "urlShort": "93sc",
            "fileId": "0",
            "extension": "",
            "description": "",
            "dt": "2022-02-28 17:28:13.530",
            "login": "pskov",
            "isBody": false,
            "titleHb": "4362290439948101350",
            "fileUrlSource": "",
            "isBookmark": false
        })
        list.push({
            "title": "Непогода внесла свои коррективы в работу барнаульского аэропорта",
            "urlShort": "93nY",
            "fileId": "4810541",
            "extension": "jpeg",
            "description": "",
            "dt": "2022-02-29 18:28:13.530",
            "login": "tytaskinos_foxy",
            "isBody": true,
            "titleHb": "4362290439948101350",
            "fileUrlSource": "https://vesti22.tv/upload/iblock/476/2kqgkipmfxjzg46ilc82hk12v2gm6de0/aerop_nepogoda.jpg",
            "isBookmark": false
        })
        list.push({
            "title": "Калининградка хотела прыгнуть с моста и попала на камеры «Безопасного города»",
            "urlShort": "93sc",
            "fileId": "",
            "extension": "",
            "description": "",
            "dt": "2022-03-04 19:28:13.530",
            "login": "tytaskinos_foxy",
            "isBody": true,
            "titleHb": "4362290439948101350",
            "fileUrlSource": "",
            "isBookmark": false
        })

        return list;
    }

    #ArticlesBodys() {
        var list = new Array();

        list.push({
            "titleHb": "385651799697845368",
            "body": "Кроме того, эти государства пострадали от собственных ограничений на поставки продукции в Россию. Целый ряд зарубежных компаний, которые прежде работали с нами и завозили свои товары в РФ, сейчас вынуждены сокращать производство и увольнять сотрудников. Отсюда следует простой тезис — вводя ограничения, невозможно не почувствовать их и на себе.Мы же, в свою очередь, абсолютно не отчаиваемся.Россия учится и работает уже в новых условиях. Более того, реагируя на новые вызовы, мы начали активно вкладывать деньги в собственные компетенции, которые раньше приобретали за рубежом.Это и электроника, и авиастроение, и автомобилестроение, и машиностроение.То есть все те такие критические технологии, в которых мы ориентировались на наших западных партнёров.Сейчас такого доверия к Западу уже нет, а значит, нужно развивать их самим. Всё это мы уже проходили.Например, до 2014 года на полках наших магазинов была в основном импортная продовольственная продукция, а сейчас наша.То же самое будет и с промышленными товарами.Просто для этого нужно больше времени.Мы не сомневаемся, что сможем у себя развить такие компетенции и быть самодостаточными по критическим технологиям, от которых зависит технологическая безопасность нашей страны. — Западные медиа в своих материалах говорят о том, что Россия существенно нарастила объём инвестиций, хотя изначально ожидания были ровно противоположными.Откуда на это взялись средства? — Как я уже сказал, мы начали развивать собственные компетенции.Бюджет и наши государственные компании в прошлом году практически не меняли свои производственные и инвестиционные планы. Мы почти не сократили инфраструктурные инвестиционные программы.Кроме того, государство с помощью различных мер всячески поддерживало стремление бизнеса к инвестированию. Помимо этого, объём сбережений в экономике вырос за прошлый год, и власти стали направлять эти деньги в инвестиционные проекты.В частности, мы начали активно задействовать средства Фонда национального благосостояния для инфраструктурных проектов.По сути, та работа, которая готовилась в предыдущие годы, она началась в 2022-м и продолжится в 2023-м.Мы не снижали темпы наших мер для поддержки и стимулирования экономики, и они дали свой результат. — Запад между тем продолжает вводить против России всё новые санкции и, вероятно, продолжит это делать в дальнейшем.Какие планы министерство ставит на будущее, чтобы обезопасить страну финансово? — Мы должны выстроить такую систему, чтобы никакие санкции и другие внешние воздействия со стороны недружественных стран не влияли на наши планы. В первую очередь речь идёт о бюджетных планах и производственных проектах бизнеса.Это наша задача, и для её выполнения нужно обеспечить финансовую устойчивость и независимость. Мы должны проводить бюджетную политику таким образом, чтобы иметь запас прочности и реагировать на внешние вызовы, сохраняя при этом бюджетный баланс.То есть, с одной стороны, у нас должна быть возможность финансировать все наши социальные и инфраструктурные программы, а с другой — не должна нарушаться общая макроэкономическая стабильность."
        })
        list.push({
            "titleHb": "3888361008586626457",
            "body": "По нашим планам уже в 2025 году мы выходим к сбалансированному бюджету. То есть бюджет будет сбалансирован на первичном уровне (без учёта процентных расходов) — расходы будут равны доходам. Это очень важно в плане обеспечения макроэкономической стабильности и выполнения всех наших обязательств, в первую очередь перед гражданами. Причём если мы посмотрим, что делается в странах, которые принимают санкции, то там до таких бюджетных параметров, как у нас, очень далеко. — Нынешнее состояние российского бюджета в последнее время стало одной из самых обсуждаемых тем в экспертном сообществе.В январе бюджетный дефицит составил 1, 76 трлн рублей и превысил половину от заложенной на весь 2023 год суммы.Причём есть оценки ряда аналитиков, что в феврале дефицит вырос до 4 трлн рублей.С чем связана такая динамика и как планируется возвращаться к намеченному уровню 2, 93 трлн ?"
        })
        list.push({
            "titleHb": "-601280397348676017",
            "body": "По итогам февраля — эта информация ещё нигде не звучала — мы видим, что за январь — февраль 2023-го доходов в бюджеты бюджетной системы поступило больше, чем за январь — февраль 2022-го, несмотря на то что наши планы по году в целом были скромнее. За два месяца 2023 года в бюджетную систему Российской Федерации поступило более 5 трлн рублей налоговых доходов, что превышает аналогичный показатель прошлого года. Сейчас казначейство осуществляет распределение этих доходов по уровням бюджетной системы. В ближайшее время мы опубликуем эту статистику, и я думаю, что те, кто прогнозировал нам большой дисбаланс, будут очень сильно расстроены. — Как продвигаются переговоры с крупным бизнесом по поводу однократного взноса в бюджет? — У нас есть инициатива Министерства финансов о том, чтобы привлечь в бюджет дополнительные источники доходов.При этом мы в своих предложениях исходили из принципа справедливости. В чём смысл наших предложений? Он заключается в следующем: на протяжении последних нескольких лет мы видели достаточно высокий уровень конъюнктурных доходов у целых направлений бизнеса.Государство предложило этим компаниям часть рентной и конъюнктурной сверхприбыли перечислить в бюджет в виде налога."
        })
        list.push({
            "titleHb": "4362290439948101350",
            "body": "Третьеклассник Федя, спасший, несмотря на полученное им ранение, двух девочек при нападении диверсантов на село в Брянской области, будет представлен к государственной награде — медали «За отвагу». Об этом заявил губернатор региона Александр Богомаз. Ранее в Кремле выразили восхищение поступком мальчика. «Разумеется, мы все — и в Кремле, и президент — мы восхищены этим геройством мальчика и этого мужчины(погибшего в результате обстрела автомобиля водителя Леонида. — RT).Вся страна гордится ими.Сейчас своевременно, разумеется, каким - то образом их геройство будет отмечено», — заявил пресс - секретарь российского президента Дмитрий Песков. Напомним, утром 2 марта диверсионная группа с территории Украины проникла в село Любечане Климовского района Брянской области.Злоумышленники обстреляли автомобиль, в котором находились дети."
        })
        list.push({
            "titleHb": "4362290439948101350",
            "body": "«В Минобороны открывается дополнительный номер горячей линии по вопросам проведения специальной военной операции — 117», — отмечается в сообщении пресс-службы ведомства. Кроме того, в министерстве напомнили, что информацию по вопросам частичной мобилизации и призыва граждан на военную службу можно получить, позвонив на единый номер информационно- справочной службы — 122. Горячая линия 122 была запущена 22 сентября прошлого года, на следующий день после объявления о проведении в стране частичной мобилизации."
        })

        return list;
    }
}
