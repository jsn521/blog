/**
 * Created with JetBrains WebStorm.
 * User: Jsn
 * Date: 13-9-10
 * Time: 下午8:47
 * To change this template use File | Settings | File Templates.
 */
(function (window) {
    var canvas = null,
        context = null,
        FONT_HEIGHT = 15,
        MARGIN = 35,
        HAND_TRUNCATION = 0,     //12
        HOUR_HAND_TRUNCATION = 0,    //30
        NUMERAL_SPACING = 20,
        RADIUS = 0,
        HAND_RADIUS = 0,
        flag = 0,
        loop = null;
    window.Clock = {};
    var _document = window.document;
    Clock.SetObject = function (id) {
        try {
            canvas = _document.getElementById(id);
            if (canvas == null || canvas == undefined)
                return false;
            context = canvas.getContext('2d');
            HAND_TRUNCATION = canvas.width / 25;
            HOUR_HAND_TRUNCATION = canvas.height / 10;
            RADIUS = canvas.width / 2 - MARGIN;
            HAND_RADIUS = RADIUS + NUMERAL_SPACING;
            context.font = FONT_HEIGHT + "px Arial";
            flag = 1;
            return true;
        } catch (e) {
            return false;
        }
    };
    Clock.Draw = function () {
        if (flag == 0)
            alert("参数配置错误，请检查您的配置！");
        loop = setInterval(drawClock,1000);
    };
    function drawCircle() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
        context.stroke();
    }

    function drawNumerals() {
        var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], angle = 0, numeralWidth = 0;
        numerals.forEach(function (numeral) {
            angle = Math.PI / 6 * (numeral - 3);
            numeralWidth = context.measureText(numeral).width;
            context.fillText(numeral, canvas.width / 2 + Math.cos(angle) * HAND_RADIUS - numeralWidth / 2,
                canvas.height / 2 + Math.sin(angle) * HAND_RADIUS + FONT_HEIGHT / 3);
        });
    }

    function drawCenter() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
        context.fill();
    }

    function drawHand(loc, isHour) {
        var angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2,
            handRadius = isHour ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION : RADIUS - HAND_TRUNCATION;
        context.moveTo(canvas.width / 2, canvas.height / 2);
        context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius,
            canvas.height / 2 + Math.sin(angle) * handRadius);
        context.stroke();
    }

    function drawHands() {
        var date = new Date,
            hour = date.getHours();
        hour = hour > 12 ? hour - 12 : hour;
        drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true);
        drawHand(date.getMinutes(), false);
        drawHand(date.getSeconds(), false);
    }

    function drawClock() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle();
        drawCenter();
        drawHands();
        drawNumerals();
    }
    Clock.SetObject('clock');
    Clock.Draw();
})(window);
//console.log(window.Clock);
//var clock = window.Clock;
//var result = clock.SetObject('canvas');
//if (result === false)
//    alert("参数配置出错");
//clock.Draw();