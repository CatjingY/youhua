// Oil Painting
// Ported from flash project - http://wonderfl.net/c/92Ul

var reflect = function(p, p0, p1) {
    var dx, dy, a, b, x, y;

    dx = p1.x - p0.x;
    dy = p1.y - p0.y;
    a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
    b = (2 * dx * dy) / (dx * dx + dy * dy);
    x = Math.round(a * (p.x - p0.x) + b * (p.y - p0.y) + p0.x);
    y = Math.round(b * (p.x - p0.x) - a * (p.y - p0.y) + p0.y);

    return {
        x: x,
        y: y
    };
};

const scale = 2;

function OilPainting() {
    var canvas;
    var context;

    var width;
    var height;

    let mouseDown = false;

    var startPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    var prevPos = {
        x: window.innerWidth / 2,
        y: 0
    };
    var dist = {
        x: 0,
        y: 0
    };
    var colour = "#326df5"

    this.initialize = function() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");

        width = (window.innerWidth - 40) * scale;
        height = (window.innerHeight - 40) * scale;

        canvas.width = width;
        canvas.height = height;

        context.scale(scale, scale);

        canvas.addEventListener("mousemove", MouseMove, false);

        canvas.addEventListener("mousedown", onDown, false);
        canvas.addEventListener("mouseup", onUp, false);
        canvas.addEventListener("mouseout", onUp, false);


        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", MouseMove, false);
        canvas.addEventListener("touchend", onUp, false);
        canvas.addEventListener("touchcancel", onUp, false);

        this.fillBackground('#ffffff')
    };

    this.setColor = function(colorToSet) {
        colour = colorToSet;
    };

    this.fillBackground = (color) => {
        context.fillStyle = color
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    const onDown = () => {
        mouseDown = true;
    };

    const onUp = () => {
        mouseDown = false;
    };

    const touchDown = (event) => {
        const e = (event.touches && event.touches.item(0)) || event;
        onDown()
        prevPos.x = e.clientX - 20;
        prevPos.y = e.clientY - 20;
    }


    var MouseMove = function(event) {

        const e = (event.touches && event.touches.item(0)) || event;

        var distance = Math.sqrt(
            Math.pow(prevPos.x - startPos.x, 2) + Math.pow(prevPos.y - startPos.y, 2)
        );

        var a = distance * 15 * (Math.pow(Math.random(), 2) - 0.5);

        var r = Math.random() - 0.5;

        var size = (Math.random() * 14) / distance + 0.3;

        dist.x = (prevPos.x - startPos.x) * Math.sin(0.5) + startPos.x;
        dist.y = (prevPos.y - startPos.y) * Math.cos(0.5) + startPos.y;

        startPos.x = prevPos.x;
        startPos.y = prevPos.y;

        const eventObject = (e.touches && e.touches.item(0)) || e;
        prevPos.x = eventObject.clientX - 20;
        prevPos.y = eventObject.clientY - 20;

        // ------- Draw -------
        var lWidth =
            (Math.random() + 20 / 10 - 0.5) * size +
            (1 - Math.random() + 30 / 20 - 0.5) * size;
        context.lineWidth = lWidth;
        context.strokeWidth = lWidth;

        context.lineCap = "round";
        context.lineJoin = "round";

        context.beginPath();
        context.moveTo(startPos.x, startPos.y);

        let newPoint = reflect(dist, startPos, prevPos);

        context.quadraticCurveTo(newPoint.x, newPoint.y, prevPos.x, prevPos.y);

        context.fillStyle = colour;
        context.strokeStyle = colour;

        context.moveTo(newPoint.x + a, newPoint.y + a);
        context.lineTo(newPoint.x + r + a, newPoint.y + r + a);

        if (mouseDown) {
            context.stroke();
            context.closePath();
        }
    };
};