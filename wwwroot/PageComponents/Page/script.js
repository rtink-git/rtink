//-- Knowledge Library
//--------------------
//-- Js. Модули: https://learn.javascript.ru/modules-intro
//-- Js. Sort array of objects by string property value. https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
//-- CEO What’s the difference between shortcut icon and just icon? https://www.sitepoint.com/community/t/whats-the-difference-between-shortcut-icon-and-just-icon/330324
//-- web master
//-- https://search.google.com/
//-- https://webmaster.yandex.ru/
//-- https://www.bing.com/webmasters
//-- https://www.amazon.com/ - not russia
//-- note: https://ogp.me
//-- note: https://habr.com/ru/company/htmlacademy/blog/563894/
//-- note: https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
//-- note: https://habr.com/ru/post/445264/
//-- icon sizes - https://blog.hubspot.com/website/what-is-a-favicon

/*-- Tasks --*/



import { Sessions } from '/PageComponents/Sessions.js';

let MontserratGoogleFont = document.createElement("link"); MontserratGoogleFont.setAttribute("rel", "stylesheet"); MontserratGoogleFont.setAttribute("href", "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900;1000&display=swap"); document.head.append(MontserratGoogleFont);


export let isTest = false; // true - режим тестирования. false - режим реализации
export let MinifyExpansion = ".min";
if (isTest)
    MinifyExpansion = "";

export let apiUrl = await ApiUrl()

var sessions = new Sessions();
await sessions.TokenRefresh(apiUrl);
export let authJWToken = sessions.authJWToken

let authorizationInformationApi = await AuthorizationInformationApi()
export let RoleId = await authorizationInformationApi.roleId

let PageStylesheet = document.createElement("link"); PageStylesheet.setAttribute("rel", "stylesheet"); PageStylesheet.setAttribute("href", "/PageComponents/Page/style.min.css"); document.head.append(PageStylesheet);


export function PageHeadsBuild(title = null, description = null, imageUrl = null, imageAlt = null, urlCanonical = null, robot = "index,follow") {
    //-- base project params

    let urlBase = "https://rt.ink";
    let latitude = null; // example: 12.345
    let longitude = null; // example: 54.321
    let geoRegion = null; // example: "RU-MO"
    let geoPlacename = null; // examle: Москва
    let ogLocale = null; // example: ru_RU
    let geoStreet = null; // example: Московский проспект 123
    let geoCountry = null; // example: Россия
    let email = null; // example: xmail@gmail.com
    let phone = null; // example: +79012345678
    let icon144 = "" // example: this.urlBase + "/PageComponents/HtmlBase/content/logo.png\"
    let iconUrlAppleTouch = null;
    let iconUrlAndroidTouch = null;
    let iconUrl528 = null;
    let twitterSite = null; // example: @ElonMusk
    let ogSiteName = null;

    //----------

    document.documentElement.lang = navigator.language;
    //document.documentElement.setAttribute('lang', navigator.language);

    //----------

    let metaHeadCharset = document.createElement("meta"); metaHeadCharset.setAttribute("charset", "utf-8"); document.head.append(metaHeadCharset);
    let metaHeadViewport = document.createElement("meta"); metaHeadViewport.setAttribute("name", "viewport"); metaHeadViewport.setAttribute("content", "width=device-width, initial-scale=1"); document.head.append(metaHeadViewport);

    /*-- og --*/

    if (ogSiteName != null) {
        let metaHeadOgType = document.createElement("meta"); metaHeadOgType.setAttribute("property", "og:type"); metaHeadOgType.setAttribute("content", "article"); document.head.append(metaHeadOgType);
        let metaHeadOgSiteName = document.createElement("meta"); metaHeadOgSiteName.setAttribute("property", "og:site_name"); metaHeadOgSiteName.setAttribute("content", ogSiteName); document.head.append(metaHeadOgSiteName);
        let metaHeadOgUrl = document.createElement("meta"); metaHeadOgUrl.setAttribute("property", "og:url"); metaHeadOgUrl.setAttribute("content", document.URL); document.head.append(metaHeadOgUrl);
    }

    /*-- twitter --*/

    if (twitterSite != null) {
        let metaHeadTwitterSite = document.createElement("meta"); metaHeadTwitterSite.setAttribute("name", "twitter:site"); metaHeadTwitterSite.setAttribute("content", twitterSite); document.head.append(metaHeadTwitterSite);
        let metaHeadTwitterCard = document.createElement("meta"); metaHeadTwitterCard.setAttribute("name", "twitter:card"); metaHeadTwitterCard.setAttribute("content", "summary_large_image"); document.head.append(metaHeadTwitterCard);
        let metaHeadTwitterUrl = document.createElement("meta"); metaHeadTwitterUrl.setAttribute("name", "twitter:description"); metaHeadTwitterUrl.setAttribute("content", document.URL); document.head.append(metaHeadTwitterUrl);
    }

    /*-- icons --*/

    if (icon144 != null) {
        let linkIcon = document.createElement("link"); linkIcon.setAttribute("rel", "icon"); linkIcon.setAttribute("href", icon144); linkIcon.setAttribute("sizes", "144x144"); document.head.append(linkIcon);
    }
    //html += "<link rel=\"icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon16.png\" type=\"image/png\" sizes=\"16x16\">";
    //html += "<link rel=\"icon\" href=\"" + baseUrl + "/content/Icon32.png\" type=\"image/png\" sizes=\"32x32\">";
    //html += "<link rel=\"icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon96.png\" type=\"image/png\" sizes=\"96x96\">";
    //html += "<link rel=\"mask-icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon32.png\" />";
    //html += "<link rel=\"image_src\" href=\"" + Constants.url + "/" + baseUrl + "/content/fav.png\" />";

    if (iconUrlAppleTouch != null) {
        let linkIconApple = document.createElement("link"); linkIconApple.setAttribute("rel", "apple-touch-icon"); linkIconApple.setAttribute("href", iconUrlAppleTouch); document.head.append(linkIconApple);
    }
    if (iconUrlAndroidTouch != null) {
        let linkIconAndroid = document.createElement("link"); linkIconAndroid.setAttribute("rel", "icon"); linkIconAndroid.setAttribute("href", iconUrlAndroidTouch); linkIconAndroid.setAttribute("type", "image/png"); linkIconAndroid.setAttribute("sizes", "192x192"); document.head.append(linkIconAndroid);
    }
    if (iconUrl528 != null) {
        let linkIcon528 = document.createElement("link"); linkIcon528.setAttribute("rel", "icon"); linkIcon528.setAttribute("href", iconUrl528); linkIcon528.setAttribute("type", "image/png"); linkIcon528.setAttribute("sizes", "528x528"); document.head.append(linkIcon528);
    }

    /*-- geo --*/

    if (latitude != null && longitude != null) {
        let metaICBM = document.createElement("meta"); metaICBM.setAttribute("name", "ICBM"); metaICBM.setAttribute("content", latitude + "," + longitude); document.head.append(metaICBM);
        let metaGeoPosition = document.createElement("meta"); metaGeoPosition.setAttribute("name", "geo.position"); metaGeoPosition.setAttribute("content", latitude + ";" + longitude); document.head.append(metaGeoPosition);
        let metaPlaceLatitude = document.createElement("meta"); metaPlaceLatitude.setAttribute("property", "place:location:latitude"), metaPlaceLatitude.setAttribute("content", latitude); document.head.append(metaPlaceLatitude);
        let metaPlaceLongitude = document.createElement("meta"); metaPlaceLongitude.setAttribute("property", "place:location:longitude"); metaPlaceLongitude.setAttribute("content", longitude); document.head.append(metaPlaceLongitude);
    }
    if (geoRegion != null) {
        let metaGeoRegion = document.createElement("meta"); metaGeoRegion.setAttribute("name", "geo.region"); metaGeoRegion.setAttribute("content", geoRegion); document.head.append(metaGeoRegion);
    }
    if (geoPlacename != null) {
        let metaGeoPlacename = document.createElement("meta"); metaGeoPlacename.setAttribute("name", "geo.placename"); metaGeoPlacename.setAttribute("content", geoPlacename); document.head.append(metaGeoPlacename);
    }
    if (ogLocale != null) {
        let metaOgLocale = document.createElement("meta"); metaOgLocale.setAttribute("name", "og.locale"); metaOgLocale.setAttribute("content", ogLocale); document.head.append(metaOgLocale);
    }

    /*-- business --*/

    if (geoPlacename != null) {
        let metaBusinessLocality = document.createElement("meta"); metaBusinessLocality.setAttribute("property", "business:contact_data:locality"); metaBusinessLocality.setAttribute("content", geoPlacename); document.head.append(metaBusinessLocality);
    }
    if (geoStreet != null) {
        let metaBusinessStreet = document.createElement("meta"); metaBusinessStreet.setAttribute("property", "business:contact_data:street_address"); metaBusinessStreet.setAttribute("content", geoStreet); document.head.append(metaBusinessStreet);
    }
    if (geoCountry != null) {
        let metaBusinessCountry = document.createElement("meta"); metaBusinessCountry.setAttribute("property", "business:contact_data:country_name"); metaBusinessCountry.setAttribute("content", geoCountry); document.head.append(metaBusinessCountry);
    }
    if (email != null) {
        let metaBusinessEmail = document.createElement("meta"); metaBusinessEmail.setAttribute("property", "business:contact_data:email"); metaBusinessEmail.setAttribute("content", email); document.head.append(metaBusinessEmail);
    }
    if (phone != null) {
        let metaBusinessPhone = document.createElement("meta"); metaBusinessPhone.setAttribute("property", "business:contact_data:phone_number"); metaBusinessPhone.setAttribute("content", phone); document.head.append(metaBusinessPhone);
    }
    if (urlBase != null) {
        let metaBusinessWebsite = document.createElement("meta"); metaBusinessWebsite.setAttribute("property", "business:contact_data:website"); metaBusinessWebsite.setAttribute("content", urlBase); document.head.append(metaBusinessWebsite);
    }

    //-- project api

    let linkApi = document.createElement("link"); linkApi.setAttribute("rel", "preconnect"); linkApi.setAttribute("href", "https://api.rt.ink"); linkApi.setAttribute("crossorigin", ""); document.head.append(linkApi);

    /*-- fonts --*/

    let linkFontsGoogleapis = document.createElement("link"); linkFontsGoogleapis.setAttribute("rel", "preconnect"); linkFontsGoogleapis.setAttribute("href", "https://fonts.googleapis.com"); document.head.append(linkFontsGoogleapis);
    let linkFontsGstatic = document.createElement("link"); linkFontsGstatic.setAttribute("rel", "preconnect"); linkFontsGstatic.setAttribute("href", "https://fonts.gstatic.com"); linkFontsGstatic.setAttribute("crossorigin", ""); document.head.append(linkFontsGstatic);
    //let linkFontsMontserrat = document.createElement("link"); linkFontsMontserrat.setAttribute("rel", "stylesheet"); linkFontsMontserrat.setAttribute("href", "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900;1000&display=swap"); document.head.append(linkFontsMontserrat);

    //----------



    /*-- robot --*/

    let metaHeadRobot = document.createElement("meta"); metaHeadRobot.setAttribute("name", "robots"); metaHeadRobot.setAttribute("content", robot); document.head.append(metaHeadRobot);

    /*-- title & description --*/

    if (title != null) { let titleTag = document.createElement("title"); titleTag.innerHTML = title; document.head.append(titleTag); }
    if (description != null) { let metaHeadDescription = document.createElement("meta"); metaHeadDescription.setAttribute("name", "description"); metaHeadDescription.setAttribute("content", description); document.head.append(metaHeadDescription); }

    /*-- canonical --*/

    if (urlCanonical != null) { let metaHeadCanonical = document.createElement("meta"); metaHeadCanonical.setAttribute("rel", "canonical"); metaHeadCanonical.setAttribute("href", urlCanonical); document.head.append(metaHeadCanonical); }

    //--------------------

    if (twitterSite != null) {
        if (title != null) { let metaHeadTwitterTitle = document.createElement("meta"); metaHeadTwitterTitle.setAttribute("name", "twitter:title"); metaHeadTwitterTitle.setAttribute("content", title); document.head.append(metaHeadTwitterTitle); }
        if (description != null) { let metaHeadTwitterDescription = document.createElement("meta"); metaHeadTwitterDescription.setAttribute("name", "twitter:description"); metaHeadTwitterDescription.setAttribute("content", description); document.head.append(metaHeadTwitterDescription); }
        if (imageUrl != null) { let metaHeadTwitterImgUrl = document.createElement("meta"); metaHeadTwitterImgUrl.setAttribute("name", "twitter:image"); metaHeadTwitterImgUrl.setAttribute("content", imageUrl); document.head.append(metaHeadTwitterImgUrl); }
        if (imageAlt != null) { let metaHeadTwitterImgAlt = document.createElement("meta"); metaHeadTwitterImgAlt.setAttribute("name", "twitter:image:alt"); metaHeadTwitterImgAlt.setAttribute("content", imageAlt); document.head.append(metaHeadTwitterImgAlt); }
    }
    if (ogSiteName != null) {
        if (title != null) { let metaHeadOgTitle = document.createElement("meta"); metaHeadOgTitle.setAttribute("property", "og:title"); metaHeadOgTitle.setAttribute("content", title); document.head.append(metaHeadOgTitle); }
        if (description != null) { let metaHeadOgDescription = document.createElement("meta"); metaHeadOgDescription.setAttribute("property", "og:description"); metaHeadOgDescription.setAttribute("content", description); document.head.append(metaHeadOgDescription); }
        if (imageUrl != null) { let metaHeadOgImage = document.createElement("meta"); metaHeadOgImage.setAttribute("property", "og:image"); metaHeadOgImage.setAttribute("content", imageUrl); document.head.append(metaHeadOgImage); }
        if (imageAlt != null) { let metaHeadOgAlt = document.createElement("meta"); metaHeadOgAlt.setAttribute("property", "og:image:alt"); metaHeadOgAlt.setAttribute("content", imageUrl); document.head.append(metaHeadOgAlt); }
    }

    /*-- Google tag(gtag.js) --*/

    let scriptHeadGoogletagmanager = document.createElement("script"); scriptHeadGoogletagmanager.setAttribute("async", ""); scriptHeadGoogletagmanager.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-M6XTS2RJDG"); document.head.append(scriptHeadGoogletagmanager);
    let scriptHeadGoogleTag = document.createElement("script"); scriptHeadGoogleTag.textContent = "window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-M6XTS2RJDG');"; document.head.append(scriptHeadGoogleTag);
}





//-- api actions

async function ApiUrl() {
    const response = await fetch("/ApiUrl", {
        method: "GET"
    });
    if (response.ok === true) return response.json();
    return null;
}

async function AuthorizationInformationApi() {
    const response = await fetch(apiUrl + "/Base/Authorization/Information", {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + sessions.authJWToken }
    });
    if (response.ok === true)
        return await response.json();
    return null;
}
