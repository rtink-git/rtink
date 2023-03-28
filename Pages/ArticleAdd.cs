namespace RtInk.Pages
{
    internal class ArticleAdd
    {
        internal string GetHtml()
        {
            var scripts = new List<string>();
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/Pages/ArticleAdd/script.js");

            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: "Add Article. RT", description: "", robot: "noindex,nofollow", scripts: scripts));
        }
    }
}
