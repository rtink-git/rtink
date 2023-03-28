using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;

namespace RtInk.Pages
{
    internal class I
    {
        internal string GetHtml(string? url=null)
        {
            var scripts = new List<string>();
            var links = new List<string>();

            scripts.Add("/PageComponents/itemsPCP/script.js");
            scripts.Add("/PageComponents/RefreshJSTokenAsync.js");
            scripts.Add("/PageComponents/CentralHtmlPart/script.js");
            scripts.Add("/PageComponents/Page/script.js");
            scripts.Add("/PageComponents/headerQPCP/script.js");
            scripts.Add("/PageComponents/HeaderUnderBoxHtmlPart/script.js");
            //scripts.Add("/Pages/i/script.js");
            //scripts.Add("/main.js");

            var datas = new List<(string id, string value)>();
            var subHtml = "<script type=\"module\" src=\"main.js\"></script>";

            
            //string login = string.Empty;
            //string name = string.Empty;
            //try
            //{
            //    var loginAndNameM = new wecandbMssqlLibrary.Tables.Users().LoginAndName(userId);
            //    string urlApi = Constants.urlApi + "/UserLoginAndName?userId="+ userId;
            //    try
            //    {
            //        if (userId > 0)
            //            using (var httpClient = new HttpClient())
            //            {
            //                httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
            //                var m = JsonSerializer.Deserialize<(string login, string name)>(httpClient.GetStringAsync(url).Result);
            //                login = loginAndNameM.login;
            //                name = loginAndNameM.name;
            //            }


            //    }
            //    catch { }
            //}
            //catch { }

            //datas.Add(("login", login));
            //datas.Add(("name", name));


            return new PageComponents.HtmlBase().Get(new PageComponents.HtmlBase.headModel(title: "RT - News aggregator", description: "RT - точка сбора самых интересных и актуальных новостей российских онлайн-медиа. \"Картина дня\" формируется автоматически на базе популярности материалов.", scripts: scripts, links: links), datas: datas, subHtml);
        }
    }
}
