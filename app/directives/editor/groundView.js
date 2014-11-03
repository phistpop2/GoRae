/**
 * Created by shinsungho on 14. 10. 27..
 */
app.directive('groundView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/groundView.html',
        link: function (scope, element, attr) {

        }
    };
});
