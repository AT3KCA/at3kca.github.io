function isHtmlTag(line) {
    let htmlTagPattern = /<("[^"]*"|'[^']*'|[^'">])*>/
    return htmlTagPattern.test(line);
}

var e_pos_mark_up = document.getElementById("pos_mark_up");
function scroll_up(){
    e_pos_mark_up.scrollIntoView({
        behavior: 'smooth'
    });
}
var e_pos_mark_down = document.getElementById("pos_mark_down");
function scroll_down(){
    e_pos_mark_down.scrollIntoView({
        behavior: 'smooth'
    });
}

function load_text(name) {

    const http = new XMLHttpRequest();
    let url = "/" + name;
    let div = document.getElementById("boxs");
    div.innerHTML = "<p>尝试加载中,这需要一些时间</p><p>如果时间太长的话....就尝试多点几下或者刷新试试</p>";

    http.timeout = 15000
    http.open("GET", url, true);
    http.send();

    http.ontimeout = function (){
        div.innerHTML = "<p>请求超时,请尝试刷新</p><p>或者说你可以尝试改善你的网络,比如挂一个加速器</p><p>当然,你也可以根据html_util.js手动尝试获取我的文段</p>";
    }
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            div.innerHTML = "";
            let ps = http.responseText.split("#End_HTP");
            for (let i = 0; i < ps.length; i++) {
                let box = document.createElement("daily");
                box.className = "card bg-black font-20";

                let ls = ps[i].split("\n");

                for (let j = 0; j < ls.length; j++) {
                    console.log(ls[j],isHtmlTag(ls[j]))
                    if (ls[j].startsWith("###")) continue
                    if (isHtmlTag(ls[j])) {
                        box.innerHTML += ls[j]
                    } else {
                        if (ls[j].trim() === "") continue

                        let ap = document.createElement("p");
                        ap.innerText = ls[j]
                        box.append(ap);
                    }
                }
                div.append(box);
            }
        }
    }
    console.log("loaded document:", name);
    setTimeout(scroll_down,500);
}
