﻿export class Sessions {
    authJWToken
    async TokenRefresh(apiUrl) {
        let authJWTokenStr = "authJWToken"
        let sessionRefrshRequiredStr = "SessionRefrshRequired"
        let sessionRefrshRequiredR = localStorage.getItem(sessionRefrshRequiredStr)

        if (sessionRefrshRequiredR != "true" && sessionRefrshRequiredR != "false")
            sessionRefrshRequiredR = "true"

        const response = await fetch(apiUrl + "/Base/Authorization/Session/Refresh?required=" + sessionRefrshRequiredR, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(authJWTokenStr),
                "ProjectToken": "3:RtinkJhbGciOerwwerrewerwqqwerrewOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiI3IiwidXNlcklkIjoiMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjAiLCJleHBpcmVzIjoiMjcvMDIvMjAyMyAxNDowOTozNSIsImV4cCI6MTY3NzUwNjk3NSwiaXNzIjoiaHR0cHM6L32434324234324567566y9hcGkucnQuaW5rIiwiYXVkIjoiUnRpbmtBdXRoQ2xpZW50In0.d1BYwF8E3miHUsLdWWkwSeW3QXNqmere6NFDTGHFGDSGFSDGFDGDFSGFSDGFDGSDFGFDSGiwvTBsdfdsfdsf2132Ja5l2YA"
            }
        });

        if (response.ok === true) {
            const data = await response.json();
            this.authJWToken = data.token
            localStorage.setItem(authJWTokenStr, data.token)
            localStorage.setItem(sessionRefrshRequiredStr, "false")
        }
    }
}