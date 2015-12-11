/**
 * Created by  on 2015/12/9.
 */

define(function(require){
    var $ = require("jquery");
    require('tweenLite');

    var colors= {
        primary50: "#e4f4f3",
        primary500: "#01a093",
        primary900: "#005f63",
        accent100: "#b0ffee",
        accent200: "#6fffdf",
        accent400: "#20ecbe",
        accent700: "#01c6ae",
        gradient100: "#effffc",
        gradient200: "#afe5e0",
        gradient300: "#99dcd6",
        gradient400: "#2cb1a6",
        gradient500: "#17a99d",
        gradient550: "#01958B",
        gradient600: "#007574",
        gradient700: "#006b6c"
    }
    var util = {
        colorToRGB : function(t, e){
            "string" == typeof t && "#" === t[0] && (t = window.parseInt(t.slice(1), 16)),
                e = void 0 === e ? 1 : e;
            var n = t >> 16 & 255
                , i = t >> 8 & 255
                , r = 255 & t
                , s = 0 > e ? 0 : e > 1 ? 1 : e;
            return 1 === s ? "rgb(" + n + "," + i + "," + r + ")" : "rgba(" + n + "," + i + "," + r + "," + s + ")"
        },
        randomBtw: function(t, e) {
            return ~~(Math.random() * (e - t + 1) + t)
        }
    }

    //创建多边形
    function Polygon(radius, sides, color, alpha, lineWidth){
        this.radius = void 0 === radius ? 50 : radius;
        this.sides = void 0 === sides ? 3 : sides;
        this.color = void 0 === color ? "red" : color;
        this.alpha = void 0 === alpha ? 1 : alpha;
        this.lineWidth = lineWidth ? 1 : 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
    }
    Polygon.prototype.draw = function(e){
        e.save();
        e.translate(this.x, this.y);
        this.rotation > 0 && e.rotate(this.rotation);
        e.scale(this.scaleX, this.scaleY);
        this.lineWidth > 0 && (e.lineWidth = this.lineWidth);
        e.fillStyle = this.alpha < 1 ? util.colorToRGB(this.color, this.alpha) : this.color;
        e.beginPath();
        this.buildRegularPolygon(e);
        e.closePath();
        e.fill();
        e.restore();
    }
    Polygon.prototype.getPath = function() {
        var e = [];
        for (var t, n = 0; n < this.sides;n++ ){
            t = this.calculatePolygonPoint(n);
            e.push(t);
        }
        return e;
    }
    Polygon.prototype.buildRegularPolygon = function(t) {
        for (var e, n = 0; n < this.sides; n++ ){
            e = this.calculatePolygonPoint(n);
            if(0 === n){
                t.moveTo(e.x, e.y)
            }else{
                t.lineTo(e.x, e.y)
            }
            if(this.lineWidth > 0 ){
                t.stroke()
            }
        }
    }
    Polygon.prototype.calculatePolygonPoint = function(t) {
        return {
            x: -this.radius * Math.sin(2 * t * Math.PI / this.sides),
            y: this.radius * Math.cos(2 * t * Math.PI / this.sides)
        }
    }

    var cc = (function(me){
        var E=[];
        var width = $(window).width() -10;
        var height = $(window).height() - 10;
        var helfWidth = width / 2;
        var helfHeight = height / 2;
        // 比例
        var ratio = 1;
        // 边书
        var sideNum = 6;
        var wrapper = $("#wrapper").css({width:width,height:height});
        var $canvas = $("<canvas></canvas>").attr({"width":width,"height":height}).appendTo(wrapper);
        var canvasObj = $canvas[0];
        var content = canvasObj.getContext("2d");
        var wrapperObj = wrapper[0];
        var pBoundSize = wrapperObj.getBoundingClientRect();
        var borderContent = createBorderCanvas();

        // 主粒子(最大的多边形)
        var mainParticle ;
        var particleArr = [];
        var curPath ;

        var colorsArray = [];


        createColors();
        createMainParticle();
        createParticle(666);
        render();


        function  createColors(){
            for (var i in colors){
                colorsArray.push(colors[i]);
                E.push(i);
            }
        }

        function createBorderCanvas(){
            var n = document.createElement("canvas");
            n.width = pBoundSize.width * ratio;
            n.height = pBoundSize.height * ratio;
            var content = n.getContext("2d")
            return content;
        }

        function render() {
            borderContent.clearRect(0, 0, canvasObj.width,canvasObj.height);
            particleArr.forEach(function(it) {
                 goAlpha(it);
                 d(it);
                 m(it);
                 v(it);
                 it.angle += it.speed;
                 it.draw(borderContent);
            });
            content.clearRect(0, 0, canvasObj.width, canvasObj.height);
            content.drawImage(borderContent.canvas, 0, 0);
            TweenLite.ticker.addEventListener("tick", render)
        }

        function goAlpha(t) {
            if(t.alpha < .9){
                t.alpha += .01;
            }
        }
        function d(t) {
            if(t.radius >= 4 * ratio){
                t.radius -= .1
            }
            if(t.centerScale < 1){
                t.centerScale += .1
            }
            t.scaleX = t.scaleY = t.centerScale + Math.sin(t.angle) * t.scaleRange
        }

        function m(t) {
            t.progress >= 1 && g(t),
            t.step.x = t.from.x + (t.to.x - t.from.x) * t.progress,
            t.step.y = t.from.y + (t.to.y - t.from.y) * t.progress,
            t.x = helfWidth + t.step.x,
            t.y = helfHeight + t.step.y,
            t.progress += t.step.speed
        }
        function g(t, e) {
            var n = t.path[t.index];
            t.from.x = n.x,
            t.from.y = n.y,
            t.index++,
            t.index === t.path.length && (t.index = 0),
            n = t.path[t.index],
            t.to.x = n.x,
            t.to.y = n.y,
            e || (t.progress = 0)
        }
        function v(t) {
            t.range.x < t.range.maxX && t.range.x++;
            t.range.y < t.range.maxY && t.range.y++;
            var e = t.step.x - Math.cos(t.angle) * t.range.x,
                n = t.step.y + Math.sin(t.angle) * t.range.y;
            t.x = helfWidth + e;
            t.y = helfHeight + n;
        }

        // 创建主多边形框对象
        function createMainParticle(t) {
            var e = getRedius();
            t ? mainParticle.radius = e : mainParticle = new Polygon(e,sideNum);
            mainParticle.x = helfWidth;
            mainParticle.y = helfHeight;
            curPath = mainParticle.getPath()
        }

        // 计算中心半径
        function getRedius() {
            var t;
            if (canvasObj.width >= canvasObj.height) {
                var e =  canvasObj.height / 10;
                t = (canvasObj.height - e) / 2
            } else {
                var n =  canvasObj.width / 10 * 2;
                t = (canvasObj.width - n) / 2;
            }
            return t;
        }


        // 创建粒子
        function createParticle(t) {
            particleArr = [];
            for (var polygon, n = 0; t > n; n++) {
                var i = 1 * ratio,
                    a = 4 * ratio;
                polygon = new Polygon(util.randomBtw(i, a),sideNum,colorsArray[n % E.length],0);
                polygon.scaleX = 0;
                polygon.scaleY = 1;
                polygon.centerScale = 0;
                polygon.scaleRange = .5;
                polygon.path = curPath;
                polygon.index = [n % sideNum];
                polygon.progress = 0;
                polygon.step = {
                    x: 0,
                    y: 0,
                    speed: .002 + .004 * Math.random()
                };
                polygon.from = {
                    x: 0,
                    y: 0
                };
                polygon.to = {
                    x: 0,
                    y: 0
                };
                g(polygon);
                n % sideNum === ~~(10 * Math.random()) && (polygon.radius += 5 + 20 * Math.random());
                var o = polygon.from.x,
                    l = polygon.from.y;
                polygon.from = {
                    x: o >= 0 ? o += util.randomBtw(0, 2.5 * canvasObj.width) : o -= util.randomBtw(0, 2.5 * canvasObj.width),
                    y: l >= 0 ? l += util.randomBtw(0, 2.5 * canvasObj.height) : l -= util.randomBtw(0, 2.5 * canvasObj.height)
                },
                polygon.range = {
                    maxX: util.randomBtw( 5 * ratio,  25 * ratio),
                    maxY: util.randomBtw( 8 * ratio,  16 * ratio),
                    x: 1,
                    y: 1
                },
                polygon.angle = 0,
                polygon.speed = .1 * Math.random(),
                polygon.x = helfWidth + polygon.from.x,
                polygon.y = helfHeight + polygon.from.y,
                particleArr.push(polygon)
            }
        }


    })()


});