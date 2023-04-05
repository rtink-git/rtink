export class SearchHeaderHtmlBox {
    constructor(target, position, placeholder, placeholderFocus) {
        let name = "SearchHeaderHtmlBox"
        let url = "/PageComponents/" + name;
        let css = document.createElement("link"); css.setAttribute("rel", "stylesheet"); css.setAttribute("href", url + "/style.css"); document.head.append(css);

        let html = "\
            <div id=\"" + name + "\">\
                <input type=\"text\" placeholder=\"" + placeholder + "\" />\
                <a>\
                    <img src=\"" + url + "/content/search.png\" />\
                </a>\
            </div>"

        target.insertAdjacentHTML(position, html)

        document.querySelector("#" + name + " input[type=\"text\"]").addEventListener('focus', async () => {
            document.querySelector("#SearchHeaderHtmlBox input[type=\"text\"]").setAttribute("placeholder", placeholderFocus)
        });

        document.querySelector("#" + name + " input[type=\"text\"]").addEventListener('blur', async () => {
            document.querySelector("#" + name + " input[type=\"text\"]").setAttribute("placeholder", placeholder)
        });

        document.querySelector("#" + name + " > a").addEventListener('click', async () => {
            let search = document.querySelector("#" + name + " input").value.toLowerCase();
            window.open("/i/" + search);
        });

        document.querySelector("#" + name + " input").addEventListener('keypress', async (event) => {
            if (event.key == "Enter") {
                let search = document.querySelector("#" + name + " input").value.toLowerCase();
                window.open("/i/" + search);

                //        //let v = document.querySelector("input[type=\"search\"]").value
                //        //if (v.length > 0)
                //        //    if (dataPageType == 5)
                //        //        window.location.href = "/i/-" + dataLogin + "-" + v.replaceAll(" ", "-")
                //        //    else
                //        //        window.location.href = "/i/" + v.replaceAll(" ", "-")
            }
        });
    }
}