/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-12-16
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */
(function (document) {
    var articles = $(".summary .content");
//    articles.each(function (element, index) {
//        $(element).html($(element).innerHTML);
//    });
    var i = 0, len = articles.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            if ($.browser.mozilla)
                articles[i].innerHTML = convert(articles[i].textContent);
            else
                articles[i].innerHTML = convert(articles[i].innerText);

        }
    }
    function convert(input) {
        var div = document.createElement('div');
        if ($.browser.mozilla) {
            return input;
        }
        div.innerText = input;
        return div.innerText;
    }

//    $("a").attr('target', "_blank");
})
    (window.document);