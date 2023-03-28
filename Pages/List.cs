namespace RtInk.Pages
{
    public class List
    {
        internal string GetHtml(string? url = null)
        {
            var scripts = new List<string>();
            var links = new List<string>();

            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/PageComponents/CentralHtmlPart/script.js");
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/headerQPCP/script.js");
            //scripts.Add("/PageComponents/HeaderUnderBoxHtmlPart/script.js");
            scripts.Add("/Pages/List/script.js");


            //var datas = new List<(string id, string value)>();

            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: "List. RT", description: "", scripts: scripts, links: links));
        }
    }
}
