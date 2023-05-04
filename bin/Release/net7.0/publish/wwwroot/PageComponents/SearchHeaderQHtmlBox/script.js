export class SearchHeaderQHtmlBox {
    userLogin

    constructor(target, position, placeholder, placeholderFocus, userLogin, MinifyExpansion=null) {
        let name = "SearchHeaderQHtmlBox"
        let url = "/PageComponents/" + name;
        let urlContent = url + "/content"
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.min.css"); document.head.append(css);

        this.userLogin = userLogin

        let html = "\
        <div id=\"" + name + "\">\
            <input type=\"text\" placeholder=\"" + placeholder + "\" />\
            <a>\
                <img src=\"" + urlContent + "/search.png\" />\
            </a>\
        </div>"

        target.insertAdjacentHTML(position, html)

        //----------

        document.querySelector("#" + name + " input[type=\"text\"]").addEventListener('focus', async () => {
            document.querySelector("#" + name + " input[type=\"text\"]").setAttribute("placeholder", placeholderFocus)
        });

        document.querySelector("#" + name).addEventListener('blur', async () => {
            document.querySelector("#" + name + " input[type=\"text\"]").setAttribute("placeholder", placeholder)
        });

        document.querySelector("#" + name + " > a").addEventListener('click', async () => {
            let search = document.querySelector("#" + name + " input").value.toLowerCase();
            if (this.userLogin.length > 0)
                search = "-" + this.userLogin + "-" + search
            if (search.length > 0)
                window.location.href = "/i/" + search
        });

        document.querySelector("#" + name + " input").addEventListener('keypress', async (event) => {
            if (event.key == "Enter") {
                let search = document.querySelector("#" + name + " input").value.toLowerCase();
                if (this.userLogin.length > 0)
                    search = "-" + this.userLogin + "-" + search
                if (search.length > 0)
                    window.location.href = "/i/" + search
            }
        });
    }
}