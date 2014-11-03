/**
 * Created by shinsungho on 14. 10. 27..
 */
app.directive('notificationSlide', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/notificationSlide.html',
        link: function (scope, element, attr) {
            $.SlidePanel();
            $('.side.btn-group').on('click', 'a', function () {
                $(this).siblings().removeClass('active').end().addClass('active');
            });
            $("#slidein-panel-btn").click();

        }
    };
});
