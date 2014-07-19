/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-12-28
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent)
            element.attachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    removeHandler: function () {
        if (element.removeEventListener)
            element.removeEventListener(type, handler);
        else if (element.detachEvent)
            element.detach("on" + type, handler);
        else
            element['on' + type] = null;
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target ? event.target : event.srcElement;
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else
            event.returnVale = false;
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else
            event.cancelBubble = true;
    },
    gettoElement: function (event) {
        return event.relatedTarget || event.toElement;
    },
    getfromElement: function (event) {
        return event.relatedTarget || event.fromElement;
    },
    getPageWidth: function () {
        var width = window.innerWidth;//兼容IE8
        if (typeof width != "number") {
            if (document.compatMode == "CSS1Compat") {
                return document.documentElement.clientWidth;
            }
            else
                return document.body.clientWidth;
        }
        return width;
    },
    getPageHeight: function () {
        var height = window.innerHeight;
        if (typeof height != "number") {
            if (document.compatMode == "CSS1Compat")
                return document.documentElement.clientHeight;
            else
                return document.body.clientHeight;
        }
        return height;
    }
};
function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    }
    else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHTTP.6.0",
                "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"], i, length;
            for (i = 0; i < length; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (e) {
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    }
    else {
        throw new Error("NO XHR object available.");
    }
}