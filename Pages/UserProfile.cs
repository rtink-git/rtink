namespace RtInk.Pages
{
    internal class UserProfile
    {
        internal string GetHtml()
        {
            var scripts = new List<string>();
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/Pages/UserProfile/script.js");

            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: "Edit Profile. RT", description: "", robot:"noindex,nofollow", scripts: scripts));
        }
    }
}
