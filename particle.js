let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let isDraw = getIsDraw();

ctx.fillStyle = '#FFFFFF';

let particles = [];
let mouse = {
    x: -500,
    y: -500
};
document.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

let btn = document.getElementById("render");
if (btn != null) {
    btn.addEventListener("click", function (event) {
        setIsDraw();
    });
}

window.addEventListener("resize", function (event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

function setIsDraw() {
    document.cookie = "isDraw=" + !isDraw;
    isDraw = getIsDraw();
}
function getIsDraw() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('isDraw=')) {
            return cookie.substring('isDraw='.length) === "true";
        }
    }
    return true;
}

class particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() - 0.55;
        this.vy = Math.random() - 0.55;
    }

    update() {
        if (this.x <= 0 || this.x >= canvas.width) {
            this.vx = -this.vx;
        }
        if (this.y <= 0 || this.y >= canvas.height) {
            this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        if (isDraw) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawLineP(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let squareDistance = dx * dx + dy * dy;
    if (squareDistance < 125 * 125) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        let distance = Math.sqrt(squareDistance);
        ctx.strokeStyle = "rgba(255,255,255," + (1 - (distance / 65)) + ")";
        ctx.stroke();
    }
}

function drawLineM(x1, y1, mx, my) {
    let dx = x1 - mx;
    let dy = y1 - my;
    let squareDistance = dx * dx + dy * dy;
    if (squareDistance < 10000) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(mx, my);
        let distance = Math.sqrt(squareDistance);
        ctx.strokeStyle = "rgba(255,255,255," + (1 - (distance / 100)) + ")";
        ctx.stroke();
    }
}

function init() {
    for (let i = 0; i < 75; i++) {
        particles.push(new particle())
    }
}

let p1, p2;

function ani() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i in particles) {
        p1 = particles[i];
        p1.update();
        p1.draw();
        drawLineM(p1.x, p1.y, mouse.x, mouse.y);
        if (isDraw) {
            for (let j in particles) {
                p2 = particles[j];
                if (p1 === p2) {
                    continue;
                }
                drawLineP(p1.x, p1.y, p2.x, p2.y);
            }
        }
    }
}

init();
setInterval(ani, 5);
