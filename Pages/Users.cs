namespace RtInk.Pages
{
    public class Users
    {
        internal string GetHtml(string? url)
        {
            var scripts = new List<string>();
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/PageComponents/CentralHtmlPart/script.js");
            scripts.Add("/PageComponents/HeaderBox/script.js");
            scripts.Add("/PageComponents/HeaderUnderBoxHtmlPart/script.js");
            scripts.Add("/Pages/Users/script.js");

            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: "Users. RT", description: "", robot: "index,follow", scripts: scripts));
        }
    }
}
