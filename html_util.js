window.addEventListener("load",function(){
    let down_btn = document.getElementById('down');
    if (down_btn != null) {
        down_btn.addEventListener('click', () => {
            downBTN()
        })
    }
})

function downBTN() {
    window.scrollTo(0, document.body.scrollHeight)
}


let inp
let count = 0
let timer
let isEnd = false
window.addEventListener('load', function () {
    inp = document.getElementById('in');
    if (!inp) {
        return
    }
    inp.addEventListener('click', function () {
        count++;
        if (count >= 6) {
            if (isEnd) {
                return
            }
            isEnd = true;
            inp.innerHTML = "<a class='hover_b' target='_blank' href='/the-hidden.html'>AT3K_CA copyright</a>";
        }
        if (!timer) {
            timer = setTimeout(() => {
                count = 0;
                timer = null;
            }, 2000);
        }
    });

});


function isHtmlTag(line) {
    let htmlTagPattern = /<("[^"]*"|'[^']*'|[^'">])*>/
    return htmlTagPattern.test(line);
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
            div.innerHTML = ""
            let ps = http.responseText.split("#End_HTP");
            for (let i = 0; i < ps.length; i++) {
                let box = document.createElement("div");
                box.className = "box";

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
}