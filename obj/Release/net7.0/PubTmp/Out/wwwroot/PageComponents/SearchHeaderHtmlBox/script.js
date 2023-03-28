export class SearchHeaderHtmlBox {
    constructor(target, position, placeholder, placeholderFocus) {
        let name = "SearchHeaderHtmlBox"
        let url = "/PageComponents/" + name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        let html = "\
            <div id=\"" + name + "\">\
                <input type=\"search\" placeholder=\"" + placeholder + "\" />\
                <a>\
                    <img src=\"" + url + "/content/search.png\" />\
                </a>\
            </div>"

        target.insertAdjacentHTML(position, html)

        document.querySelector("#" + name + " input[type=\"search\"]").addEventListener('focus', async () => {
            document.querySelector("#SearchHeaderHtmlBox input[type=\"search\"]").setAttribute("placeholder", placeholderFocus)
            document.querySelector("#SearchHeaderHtmlBox a").style.display = "block"
        });
    }
}