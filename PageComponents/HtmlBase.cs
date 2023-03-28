namespace RtInk.PageComponents
{
	internal class HtmlBase
	{
        string? urlBase = null;

        public HtmlBase()
        {
            this.urlBase = "https://rt.ink";
        }

        internal record headModel(
            string? url = null,
            string? urlCanonical = null,
            string? robot = "index,follow",
            string? title = "",
            string? description = "",
            string? imageUrl = "",
            string? imageAlt = "",
            List<string>? scripts = null,
            List<string>? links = null
        );
        internal string Get(headModel headM, List<(string id, string value)>? datas = null, string? subHtml=null)
		{
			string html = "";

            string bodyDataStr = "";
            if (datas != null)
            {
                foreach (var i in datas)
                    bodyDataStr += "data-" + i.id + "=\"" + i.value + "\" ";
                bodyDataStr = " " + bodyDataStr;
            }

            html += "<!DOCTYPE html>";
            html += "<html>"; // lang=\"ru\"
            html += "<head>";
            html += GetHead(headM);
            html += subHtml;
            html += "</head>";
            html += "<body" + bodyDataStr + ">";
            html += "</body>";
            html += "</html>";

            return html;
        }

        string GetHead(headModel m)
        {
            string? urlBase = "https://rt.ink";

            string html = "";

            string? latitude = null; // example: 12.345
            string? longitude = null; // example: 54.321
            string? twitterSite = null; // example: @ElonMusk
            string? ogSiteName = "RT - News Aggregator";
            string? geoRegion = null; // example: "RU-MO"
            string? geoPlacename = null; // examle: Москва
            string? ogLocale = null; // example: ru_RU
            string? geoStreet = null; // example: Московский проспект 123
            string? geoCountry = null; // example: Россия
            string? email = null; // example: xmail@gmail.com
            string? phone = null; // example: +79012345678
            string? iconUrl528 = null; // example: urlBase + "/Pages/_Layout/Head/Icon528.png";
            string? iconUrlAppleTouch = null; // example: urlBase + "/Pages/_Layout/Head/Icon180Sub.png";
            string? iconUrlAndroidTouch = null; // example: urlBase + "/Pages/_Layout/Head/Icon192Sub.png";
            //if (m.url == urlBase)
            //{
            //    iconUrlAppleTouch = urlBase + "/Pages/_HeadBase/content/Icon180.png";
            //    iconUrlAndroidTouch = urlBase + "/Pages/_HeadBase/content/Icon192.png";
            //}

            // web master
            // https://search.google.com/
            // https://webmaster.yandex.ru/
            // https://www.bing.com/webmasters
            // https://www.amazon.com/ - not russia

            //string baseUrl = "/Pages/_Layout";
            //string baseUrlHeadDir = "/Pages/_Layout/Head";

            // note: https://ogp.me
            // note: https://habr.com/ru/company/htmlacademy/blog/563894/
            // note: https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
            // note: https://habr.com/ru/post/445264/
            // icon sizes - https://blog.hubspot.com/website/what-is-a-favicon

            html += "<meta charset=\"utf-8\">";
            html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";

            /*-- Google tag(gtag.js) --*/
            html += "<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-M6XTS2RJDG\"></script><script>window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-M6XTS2RJDG');</script>";




            string robot = "index,follow";
            if (m.robot != null)
                robot = m.robot;
            html += "<meta name=\"robots\" content=\"" + robot + "\">";

            /*-- title & description --*/

            if (m.title != null)
                html += "<title>" + m.title + "</title>";
            if (m.description != null)
                html += "<meta name=\"description\" content=\"" + m.description + "\">";

            if (m.urlCanonical != null)
                html += "<link rel=\"canonical\" href=\"" + (this.urlBase + m.urlCanonical) + "\">";

            /*-- og --*/

            if (ogSiteName != null)
            {
                html += "<meta property=\"og:type\" content=\"article\">";
                html += "<meta name=\"og:site_name\" content=\"" + ogSiteName + "\">";

                if (m.title != null)
                    html += "<meta property=\"og:title\" content=\"" + m.title + "\">";
                if (m.url != null)
                    html += "<meta property=\"og:url\" content=\"" + (this.urlBase + m.url) + "\">";
                if (m.description != null)
                    html += "<meta property=\"og:description\" content=\"" + m.description + "\">";
                html += "<meta property=\"og:image\" content=\"" + m.imageUrl + "\">";
                if (m.imageAlt != null)
                    html += "<meta property=\"og:image:alt\" content=\"" + m.imageAlt + "\">";
            }

            /*-- twitter --*/

            if (twitterSite != null)
            {
                html += "<meta name=\"twitter:site\" content=\"" + twitterSite + "\">";
                html += "<meta name=\"twitter:card\" content=\"summary_large_image\">";
                if (m.title != null)
                    html += "<meta name=\"twitter:title\" content=\"" + m.title + "\">";
                if (m.description != null)
                    html += "<meta name=\"twitter:description\" content=\"" + m.description + "\">";
                if (m.url != null)
                    html += "<meta name=\"twitter:url\" content=\"" + (this.urlBase + m.url) + "/\">";
                html += "<meta name=\"twitter:image\" content=\"" + m.imageUrl + "\">";
                if (m.imageAlt != null)
                    html += "<meta property=\"twitter:image:alt\" content=\"" + m.imageAlt + "\">";
            }

            /*-- icons --*/

            // https://www.sitepoint.com/community/t/whats-the-difference-between-shortcut-icon-and-just-icon/330324
            html += "<link rel=\"icon\" href=\"" + this.urlBase + "/PageComponents/HtmlBase/content/logo.png\" sizes=\"144x144\">";
            //html += "<link rel=\"icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon16.png\" type=\"image/png\" sizes=\"16x16\">";
            //html += "<link rel=\"icon\" href=\"" + baseUrl + "/content/Icon32.png\" type=\"image/png\" sizes=\"32x32\">";
            //html += "<link rel=\"icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon96.png\" type=\"image/png\" sizes=\"96x96\">";
            //html += "<link rel=\"mask-icon\" href=\"" + Constants.url + "/" + baseUrl + "/content/Icon32.png\" />";
            //html += "<link rel=\"image_src\" href=\"" + Constants.url + "/" + baseUrl + "/content/fav.png\" />";

            if (iconUrlAppleTouch != null)
                html += "<link rel=\"apple-touch-icon\" href=\"" + iconUrlAppleTouch + "\" />";
            if (iconUrlAndroidTouch != null)
                html += "<link rel=\"icon\" href=\"" + iconUrlAndroidTouch + "\" type=\"image/png\" sizes=\"192x192\">";
            if (iconUrl528 != null)
                html += "<link rel=\"icon\" href=\"" + iconUrl528 + "\" type=\"image/png\" sizes=\"528x528\">";

            //---------

            html += "<link href='https://api.rt.ink' rel='preconnect' crossorigin>";

            //---------

            /*-- geo --*/

            if (latitude != null && longitude != null)
            {
                html += "<meta name=\"ICBM\" content=\"" + latitude + "," + longitude + "\">";
                html += "<meta name=\"geo.position\" content=\"" + latitude + ";" + longitude + "\">";
                html += "<meta proporty=\"place:location:latitude\" content=\"" + latitude + "\">";
                html += "<meta proporty=\"place:location:longitude\" content=\"" + longitude + "\">";
            }
            if (geoRegion != null)
                html += "<meta name=\"geo.region\" content=\"" + geoRegion + "\">";
            if (geoPlacename != null)
                html += "<meta name=\"geo.placename\" content=\"" + geoPlacename + "\">";
            if (ogLocale != null)
                html += "<meta name=\"og.locale\" content=\"" + ogLocale + "\">";

            /*-- business --*/

            if (geoPlacename != null)
                html += "<meta proporty=\"business:contact_data:locality\" content=\"" + geoPlacename + "\">";
            if (geoStreet != null)
                html += "<meta proporty=\"business:contact_data:street_address\" content=\"" + geoStreet + "\">";
            if (geoCountry != null)
                html += "<meta proporty=\"business:contact_data:country_name\" content=\"" + geoCountry + "\">";
            if (email != null)
                html += "<meta proporty=\"business:contact_data:email\" content=\"" + email + "\">";
            if (phone != null)
                html += "<meta proporty=\"business:contact_data:phone_number\" content=\"" + phone + "\">";
            if (urlBase != null)
                html += "<meta proporty=\"business:contact_data:website\" content=\"" + urlBase + "\">";

            /*-- fonts --*/

            html += "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />";
            html += "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />";
            html += "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900;1000&display=swap\" />";

            /*-- style --*/

            html += "<link rel=\"stylesheet\" href=\"/PageComponents/HtmlBase/style.css\" />";

            /*-- scripts --*/

            //html += "<script src=\"" + this.baseUrl + "/RefreshJSTokenAsync.js\"></script>";
            //html += "<script src=\"" + baseUrl + "/ErrorBoxHtmlPart/engine.js\"></script>";
            //html += "<script src=\"" + baseUrl + "/headerPCP/engine.js\"></script>";
            //html += "<script src=\"" + baseUrl + "/SearchHeaderHtmlPart/engine.js\"></script>";

            if (m.scripts != null)
                for (var i = 0; i < m.scripts.Count; i++)
                    html += "<script src=\"" + m.scripts[i] + "\"></script>";

            /*-- links --*/

            if (m.links != null)
                for (var i = 0; i < m.links.Count; i++)
                    html += "<link rel=\"stylesheet\" href=\"" + m.links[i] + "\" />"; //"<script src=\"" + m.links[i] + "\"></script>";

            return html;
        }
    }
}

