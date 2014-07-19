/**
 * Created by Administrator on 14-4-12.
 */
$(function () {
    var _inside = $("#inside");
    var _project = $(".project>ol")[0];
    console.log(_project);
    $(".nav_item").each(function (index, element) {
        $(element).on("click", {_index: index}, function (event) {
            var _index = event.data._index + 1;
            var _moveDistance = -(_index - 1) * 960;
//            console.log(_index);
            $(this).addClass("nav_item_active").siblings().removeClass("nav_item_active");
            _inside.animate({marginLeft: _moveDistance + "px"}, 600);

        });
    });
    $(".next").each(function (index, element) {
        $(element).on("click", function () {
            var _index = -1;
            if (this.dataset)
                _index = this.dataset.index;
            else
                _index = this.getAttribute("data-index");
            _index = +_index;
            $(_project).animate({marginTop: -(_index - 1) * 350 + "px"});
        });
    });
    $(".previous").each(function (index, element) {
        $(element).on("click", function () {
            var _index = -1;
            if (this.dataset)
                _index = this.dataset.index;
            else
                _index = this.getAttribute("data-index");
            _index = +_index;
            $(_project).animate({marginTop: -(_index - 1) * 350 + "px"});
        });
    });
});