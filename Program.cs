//-- Notes
//-- Main page





//-- Project publication
//-- 1. wwwroot /PageComponents/Page/script.js 
//---- Set window.isTest = false
//---- Set server host url RtInk.Constants





//-- Tasks
//-- 2023-04-25 i/-user (location account) - RT / LOC





//-- Knowledge Library
//-- ASP.NET: Polly with .NET 6, Part 4 - Dependency Injection of a HttpClientFactory and Policy into a Minimal API Endpoint: https://nodogmablog.bryanhogan.net/2022/03/polly-with-net-6-part-4-dependency-injection-of-a-httpclientfactory-and-policy-into-a-minimal-api-endpoint/
//-- JS: Private class features: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields




using System.Text.Json;
using RtInk;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(1);
});

builder.Services.AddHttpClient("ApiRtInkNetCoreApp", client => {
    client.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();  
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseRouting();
app.UseAuthorization();

app.MapGet("/", async (context) => { await context.Response.WriteAsync("<script type=\"module\" src=\"/Pages/i/script.js\"></script>"); }); // /*await context.Response.WriteAsync(new RtInk.Pages.I().GetHtml());*/
app.MapGet("/i/{search}", async (context) => { await context.Response.WriteAsync("<script type=\"module\" src=\"/Pages/i/script.js\"></script>"); });
app.MapGet("/users", async (context) => { await context.Response.WriteAsync("<script type=\"module\" src=\"/Pages/Users/script.js\"></script>"); });
app.MapGet("/locations", async (context) => { await context.Response.WriteAsync("<script type=\"module\" src=\"/Pages/Locations/script.js\"></script>"); });

app.MapGet("/a/{urlShort}", async (string urlShort, HttpContext context, IHttpClientFactory httpClientFactory) => {
    //-- Task.Note: app.MapGet [/a/{urlShort}] устарел, но необходимо поддерживать, потому что применялся в ранних версиях и может оставаться актуальным

    //var request = context.Request;
    //long userId = new Session.JWToken().GetUserId(context);

    string? url = null;
    //string[] pathSplit = context.Request request.Path.ToString().TrimEnd('/').Split('/');
    //if (pathSplit.Length == 3)
    if(!String.IsNullOrEmpty(urlShort))
    {
        string urlX = Constants.urlApi + Constants.apiRtInkWebPartStr + "/ArticleUrl?urlShort=" + urlShort + "&userId=0"; // + "&userId=" + userId;
        if (httpClientFactory != null)
            using (var httpClient = httpClientFactory.CreateClient(urlX))
            {
                //httpClient.DefaultRequestHeaders.Add("Authorization", authJWTokenBearer);
                var m = JsonSerializer.Deserialize<ArticleUrlModel>(httpClient.GetStringAsync(urlX).Result);
                if (m != null)
                    url = m.url;
            }

        //using (var httpClient = new HttpClient())
        //{
        //    httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
        //    var m = JsonSerializer.Deserialize<ArticleUrlModel>(httpClient.GetStringAsync(urlX).Result);
        //    if (m != null)
        //        url = m.url;
        //}
    }
    if (url != null && url.Length > 0)
        context.Response.Redirect(url);
    else
        await context.Response.WriteAsync("Error 404");
});
app.MapGet("/f/{id_with_extension}", (string id_with_extension) =>
{
    try
    {
        string[] q_split = id_with_extension.Split('.');
        string type = q_split[1];

        var folder = RtInk.Constants.fls + "ArticlesFiles\\" + q_split[0] + "\\";
        string[] fl = Directory.GetFiles(folder);

        string file_url = new FileInfo(fl[0]).FullName;
        byte[] file_byte_l = System.IO.File.ReadAllBytes(file_url);

        var mime_type = "*";
        if (type == "png")
            mime_type = "image/png";
        else if (type == "jpg" || type == "jpeg")
            mime_type = "image/jpeg";

        return Results.File(file_byte_l, mime_type, "rt.ink_" + id_with_extension); //await context.Response.WriteAsync("Error 404");// base.File(file_byte_l, mime_type, "rt.ink_" + pathSplit[2]);
    }
    catch { return Results.Redirect("/"); }
});

app.MapGet("/ApiUrl", () => { return Results.Ok(Constants.urlApi); });


//app.MapPost("/user-logo-upload", async (IFormFile file, HttpContext context) => {
//    try
//    {
//        string filePath = Path.Combine(@"C:\wecan\Users\", file.FileName);

//        using (var fs = new FileStream(filePath, FileMode.Create))
//        {
//            await file.CopyToAsync(fs);
//        }
//        return Results.Ok();
//        //return StatusCode(StatusCodes.Status201Created);
//    }
//    catch
//    {
//        return Results.NotFound();
//        //return StatusCode(StatusCodes.Status500InternalServerError);
//    }
//});
//app.MapGet("/user-logo/{login_with_extension}", (string login_with_extension) =>
//{
//    var path = RtInk.Constants.fls + "Users\\" + login_with_extension;
//    if (File.Exists(path))
//    {
//        byte[] file_byte_l = System.IO.File.ReadAllBytes(path);
//        return Results.File(file_byte_l, "image/jpeg", login_with_extension); //await context.Response.WriteAsync("Error 404");// base.File(file_byte_l, mime_type, "rt.ink_" + pathSplit[2]);
//    }
//    else
//        return Results.NotFound();

//});

//app.MapGet("/u/{login}", async (context) => {
//    string[] pathSplit = context.Request.Path.ToString().TrimEnd('/').Split('/');
//    if (pathSplit.Length == 3)
//        await context.Response.WriteAsync(new RtInk.Pages.U().GetHtml(pathSplit[2]));
//});
//app.MapGet("/users", async (context) => {
//    await context.Response.WriteAsync(new RtInk.Pages.Users().GetHtml(context.Request.Path));
//});
//app.MapGet("/users/{search}", async (context) => {
//    await context.Response.WriteAsync(new RtInk.Pages.Users().GetHtml(context.Request.Path));
//});


//-- Api

//app.MapGet("/api/UserBio", [Authorize] (HttpContext context, IHttpClientFactory httpClientFactory) => {
//    try
//    {
//        var sessionId = context.Request.Headers["sessionId"][0];
//        var sessionToken = context.Request.Headers["Authorization"][0];
//        if (sessionToken != null)
//            sessionToken = sessionToken.Replace("Bearer ", "");

//        UserBioModel? m = null;
//        using (var httpClient = httpClientFactory.CreateClient("ApiRtInkNetCoreApp"))
//        {
//            httpClient.DefaultRequestHeaders.Add("sessionToken", sessionId + ":" + sessionToken);
//            m = httpClient.GetFromJsonAsync<UserBioModel>(Constants.urlApi + Constants.apiRtInkWebPartStr + "/UserBio").Result;
//        }

//        if (m != null)
//            return Results.Ok(m);
//        else
//            return Results.NotFound();
//    }
//    catch { return Results.NotFound(); }

//});
//app.MapGet("/api/UserProfilePage", (string login, HttpContext context) =>
//{
//    if (!String.IsNullOrEmpty(login))
//    {
//        long userId = 0;
//        byte roleId = 0;
//        var claims = context.User.Claims;
//        if (claims != null)
//            foreach (var i in claims)
//                if (i.Type == "userId")
//                    userId = Convert.ToInt64(i.Value);
//                else if (i.Type == ClaimTypes.Role)
//                    roleId = Convert.ToByte(i.Value);

//        string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/UserProfilePage?userId=" + userId + "&login=" + login + "&roleId=" + roleId;
//        using (var httpClient = new HttpClient())
//        {
//            httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//            var m = httpClient.GetFromJsonAsync<UserProfileModel>(url).Result; //JsonSerializer.Deserialize<IPageModel>(httpClient.GetStringAsync(url).Result);
//            if (m != null)
//                if (m.name != null)
//                    return Results.Ok(m);
//        }
//    }
//    return Results.NotFound();
//});
//app.MapPost("/api/Follow", async (string login, HttpContext context) => {
//    long userId = 0;
//    var claims = context.User.Claims;
//    if (claims != null)
//        foreach (var i in claims)
//            if (i.Type == "userId")
//                userId = Convert.ToInt64(i.Value);
//    if (userId > 0)
//    {
//        string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/UserFollow?userId=" + userId + "&login=" + login;
//        using (var httpClient = new HttpClient())
//        {
//            httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//            var t = await httpClient.GetAsync(url); // PostAsync(url, null);
//            if(t.StatusCode == System.Net.HttpStatusCode.OK)
//                return Results.Ok();
//        }
//        //new wecandbMssqlLibrary.Programmability.StoredProccedures.UserSubscriptionsFollowWebApi().Post(jWToken.GetUserId(context.User), context.Request.Headers["login"][0]); 
//    }
//    return Results.NotFound();
//});
//app.MapGet("/api/Users", async (string search, long sessionId, string sessionToken, HttpContext context) =>
//{
//    try
//    {
//        string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/Users?search=" + search + "&sessionId=" + sessionId + "&sessionToken=" + sessionToken;
//        using (var httpClient = new HttpClient())
//        {
//            httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//            var l = httpClient.GetFromJsonAsync<List<UserModel>>(url).Result;
//            return Results.Ok(l);
//        }
//    }
//    catch { }
//    return Results.NotFound();
//});

//app.MapPost("/api/Article", [Authorize] async (ArticleModel articleModel, HttpContext context) => {
//    long sessionId = 0;
//    long userId = 0;
//    var claims = context.User.Claims;
//    if (claims != null)
//        foreach (var i in claims)
//            if (i.Type == ClaimTypes.Sid)
//                sessionId = Convert.ToInt64(i.Value);
//            else if (i.Type == "userId")
//                userId = Convert.ToInt64(i.Value);

//    if (userId > 0)
//    {
//        var token = context.Request.Headers["Authorization"][0];
//        if (token != null)
//            token = token.Substring(7, token.Length - 7);
//        if (token != null)
//        {
//            string json = JsonSerializer.Serialize(new ArticlePostModel(sessionId, token, articleModel.title)); // JsonConvert.SerializeObject(createLoginPayload(usernameTextBox.Text, password)));
//            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
//            var t = 0;
//            string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/Article";
//            using (var httpClient = new HttpClient())
//            {
//                httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//                var rsp = await httpClient.PostAsync(url, httpContent);
//                if (rsp.StatusCode == System.Net.HttpStatusCode.OK)
//                    return Results.Ok();
//            }
//        }
//    }

//    return Results.NotFound();
//});


//app.MapPost("/api/EditProfile", async (string loginPrev, string name, string login, string about, HttpContext context) => {
//    long userId = 0;
//    byte roleId = 0;
//    var claims = context.User.Claims;
//    if (claims != null)
//        foreach (var i in claims)
//            if (i.Type == "userId")
//                userId = Convert.ToInt64(i.Value);
//            else if (i.Type == ClaimTypes.Role)
//                roleId = Convert.ToByte(i.Value);
//    if (userId > 0)
//    {
//        string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/EditProfile?userId=" + userId + "&roleId=" + roleId + "&loginPrev=" + loginPrev + "&name=" + name + "&login=" + login + "&about=" + about;
//        using (var httpClient = new HttpClient())
//        {
//            httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//            var t = await httpClient.PostAsync(url, null); // PostAsync(url, null);
//            if (t.StatusCode == System.Net.HttpStatusCode.OK)
//                return Results.Ok();
//        }
//        //new wecandbMssqlLibrary.Programmability.StoredProccedures.UsersUpdateByClientApi().Post(jWToken.GetUserId(context.User), jWToken.GetRoleId(context.User), context.Request.Headers["loginPrev"][0], name, 
//        //    context.Request.Headers["login"][0]); 
//    }
//    return Results.NotFound();
//});


//app.MapGet("/api/GetAticleSimillars", (HttpContext context) => {
//    long userId = new Session.JWToken().GetUserId(context);

//    string url = Constants.urlApi + Constants.apiRtInkWebPartStr + "/AticleSimillarList?userId=" + userId;
//    using (var httpClient = new HttpClient())
//    {
//        httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeyRtInk);
//        var m = JsonSerializer.Deserialize<List<GetAticleSimillarsModel>>(httpClient.GetStringAsync(url).Result);
//        if (m != null)
//            return Results.Ok(m);
//    }
//    return Results.NotFound();
//});

//-------------------------

app.Run();

public class SigninModel { public byte roleId { get; set; } public string login { get; set; } };
public class IPageModel { public string userLogin { get; set; } public string userName { get; set; } public string userAbout { get; set; } public string articleUrl { get; set; } public byte pageType { get; set; } public byte userIsFollowType { get; set; } public int userFollowingsNumber { get; set; } public int userFollowersNumber { get; set; } public bool logoF { get; set; } };
public class GetAticlesModel{public string title { get; set; } public string urlShort { get; set; } public long fileId { get; set; } public string extension { get; set; } public string description { get; set; } public DateTime dt { get; set; } public string login { get; set; } public int isBody { get; set; } public string titleHb { get; set; } public string? fileUrlSource { get; set; }};
public record GetAticleSimillarsModel(long titleHb, string title, string urlShort);
public record ArticleUrlModel (string url);
public record UPDATE_roleIdGET_updateNumberModel(int updateNumber);
public record UserProfileModel(string name, string about);
public record ArticleModel(string title);
public record ArticlePostModel(long sessionId, string sessionToken, string title);
public record UserModel(string login, string name, string about, int userIsFollowing, int userIsFollower);
public record UserBioModel(string login, string name, string about);

