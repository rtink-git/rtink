namespace RtInk.Pages
{
    public class U
    {
        internal string GetHtml(string login)
        {
            var scripts = new List<string>();
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/PageComponents/CentralHtmlPart/script.js");
            scripts.Add("/PageComponents/HeaderBox/script.js");
            scripts.Add("/Pages/U/script.js");


            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: login.ToUpper() + ". Users. RT", description: "", robot: "index,follow", scripts: scripts));
        }
    }
}
