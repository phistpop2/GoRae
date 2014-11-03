/**
 * Created by shinsungho on 14. 10. 27..
 */
app.directive('treeView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/treeView.html',
        link: function (scope, element, attr) {
            $('.dropdown-toggle').dropdown();
            scope.setToken();
        }
    };
});