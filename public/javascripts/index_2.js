$(function () {
    var icons = $(".section .icon");
    //    icons.click(function () {
    //        console.log(this);
    //        $(this).toggleClass("closed-icon");
    //    });
    icons.each(function (index, element) {
        $(element).click(function () {
            $(this).toggleClass("closed-icon");
        });
    });
    $(".profile-title").on("click", function () {
        var index = $(this).attr("data-index");
        index = parseInt(index);
        if (index !== 1) {
            $(this).siblings().slideToggle();
        }
        else {
            $(this).parent().children().last().children().last().slideToggle();
            $(".profile-data").toggleClass("profile-data-closed");
            $(".profile-photo").toggleClass("profile-photo-closed");
            //console.log($(this).parent());
        }
    });
    $(".column-title").click(function () {
        $(this).next().slideToggle();
    });
});