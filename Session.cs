using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using System.Diagnostics.Eventing.Reader;

namespace RtInk
{
    internal class Session
    {
        internal class JWToken
        {
            const string sessionIdStr = "sessionId";
            const string userIdStr = "userId";
            const string roleIdStr = "roleId";
            public class AuthOptions
            {
                public const string ISSUER = "https://rt.ink"; // издатель токена
                public const string AUDIENCE = "RtinkAuthClient"; // потребитель токена
                const string KEY = "kniTR!617_secretkey!0123!456";   // ключ для шифрации
                public const int LIFETIME = 5; // время жизни токена - 1 минута
                public static SymmetricSecurityKey GetSymmetricSecurityKey()
                {
                    return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
                }
            }
            public record SessionModel (long id, string token, int roleId);
            public SessionModel Refresh(HttpContext context)
            {
                string tokenR = string.Empty;
                int roleIdR = 0;

                //----------

                long id = 0;
                long userId = 0;
                string token = string.Empty;
                byte roleId = 0;
                var expiresF = false;
                DateTime expires = DateTime.UtcNow;

                var tokenSub = context.Request.Headers["Authorization"][0];
                try { id = Convert.ToInt64(context.Request.Headers["id"][0]); } catch { };
                if (tokenSub != null && tokenSub.Length > 7)
                    token = tokenSub.Substring(7, tokenSub.Length - 7);

                var claims = context.User.Claims;
                if (claims != null)
                    foreach (var i in claims)
                        if (i.Type == ClaimTypes.Role)
                            roleId = Convert.ToByte(i.Value);
                        else if (i.Type == "expires")
                        {
                            expiresF = true;
                            expires = Convert.ToDateTime(i.Value);
                        }

                byte roleIdSub = 0;
                try { roleIdSub = Convert.ToByte(context.Session.GetString(roleIdStr)); } catch { }

                //----------


                if (expiresF && expires > DateTime.UtcNow && id > 0 && token.Length > 0 && roleIdSub == roleId )
                    return new SessionModel(id, token, roleId);
                else
                {
                    var tokenQ = token;

                    try
                    {
                        string url = Constants.urlApi + "/Authorization/Session/Select?id=" + id + "&token=" + tokenQ;
                        using (var httpClient = new HttpClient())
                        {
                            httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeySecurityApi);
                            var m = JsonSerializer.Deserialize<SELECT_userId_roleId_Model>(httpClient.GetStringAsync(url).Result);
                            if (m != null)
                            {
                                userId = Convert.ToInt64(m.userId);
                                roleId = Convert.ToByte(m.roleId);
                            }
                            else
                                id = 0;
                        }
                    }
                    catch (Exception e)
                    {
                        var code = e.HResult;
                        if (code == -2146233088)
                            return new SessionModel(id, token, roleId);
                    }

                    var random = new Random();
                    var tokenNew = new string(Enumerable.Repeat("AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789()", 128)
                        .Select(s => s[random.Next(s.Length)]).ToArray());

                    if (id == 0)
                    {
                        string url = Constants.urlApi + "/Authorization/Session/New?token=" + tokenNew;
                        try
                        {
                            using (var httpClient = new HttpClient())
                            {
                                httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeySecurityApi);
                                var m = JsonSerializer.Deserialize<INSERT_EMPTY_GET_idModel>(httpClient.GetStringAsync(url).Result);
                                if (m != null)
                                {
                                    id = m.id;
                                    tokenQ = tokenNew;
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            var code = e.HResult;
                            if (code == -2146233088)
                                return new SessionModel(id, token, roleId);
                        }
                    }

                    if (id > 0)
                    {
                        var claimsQ = new List<Claim> { new Claim(ClaimTypes.Sid, id.ToString()), new Claim(ClaimTypes.Role, roleId.ToString()), new Claim("userId", userId.ToString()), new Claim("expires", DateTime.UtcNow.AddMinutes(5).ToString()) };
                        var jwt = new JwtSecurityToken(
                            issuer: AuthOptions.ISSUER,
                            audience: AuthOptions.AUDIENCE,
                            claims: claimsQ,
                            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(5)),
                            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
                        tokenR = new JwtSecurityTokenHandler().WriteToken(jwt);
                        if (userId > 0)
                            context.Session.SetString(userIdStr, userId.ToString());

                        string url = Constants.urlApi + "/Authorization/Session/Update?id=" + id + "&token=" + tokenQ + "&tokenNew=" + tokenR;
                        try
                        {
                            using (var httpClient = new HttpClient())
                            {
                                httpClient.DefaultRequestHeaders.Add("key", Constants.apiKeySecurityApi);
                                var m = JsonSerializer.Deserialize<UPDATE_token_tokenExpiryTime_GET_roleIdModel>(httpClient.GetStringAsync(url).Result);
                                if (m != null)
                                    roleIdR = m.roleId;
                            }

                        }
                        catch (Exception e)
                        {
                            var code = e.HResult;
                            if(code == -2146233088)
                                return new SessionModel(id, token, roleId);
                        }
                    }
                }

                long sessionIdInSessions = 0;
                try { sessionIdInSessions = Convert.ToInt64(context.Session.GetString("sessionId")); } catch { }
                if (sessionIdInSessions != id)
                    context.Session.SetString("sessionId", id.ToString());
                string tokenInSessions = string.Empty;
                try { 
                    var st = context.Session.GetString("sessionToken");
                    if (st != null)
                        tokenInSessions = st;
                } catch { }
                if(tokenInSessions != tokenR)
                    context.Session.SetString("sessionToken", tokenR);
                byte roleIdSessions = 0;
                try { roleIdSessions = Convert.ToByte(context.Session.GetString("roleId")); } catch { }
                if(roleIdSessions != roleIdR)
                    context.Session.SetString("roleId", roleIdR.ToString());
                byte userIdSessions = 0;
                if(userId==0)
                    context.Session.SetString(userIdStr, ((-1)*id).ToString());

                return new SessionModel(id, tokenR, roleIdR);
            }

            public long GetUserId(HttpContext context)
            {
                long userId = 0;
                long sessionId = 0;

                var claims = context.User.Claims;
                if (claims != null)
                    foreach (var i in claims)
                    {
                        if (i.Type == userIdStr)
                            userId = Convert.ToInt64(i.Value);
                        if (i.Type == ClaimTypes.Sid)
                            sessionId = Convert.ToInt64(i.Value);
                    }
                if (userId == 0 && sessionId > 0)
                {
                    userId = (-1) * sessionId;
                    context.Session.SetString(userIdStr, userId.ToString());
                }
                if (userId == 0)
                    try { userId = Convert.ToInt64(context.Session.GetString(userIdStr)); } catch { }
                if (userId == 0)
                    try { userId = (-1) * Convert.ToInt64(context.Session.GetString(sessionIdStr)); } catch { }


                return userId;
            }

            public record SELECT_userId_roleId_Model(long userId, byte roleId);
            public class INSERT_EMPTY_GET_idModel { public long id { get; set; } }
            public class UPDATE_token_tokenExpiryTime_GET_roleIdModel { public int roleId { get; set; } }

        }
    }
}
