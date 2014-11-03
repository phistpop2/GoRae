/**
 * Created by shinsungho on 14. 10. 25..
 */
console.log('topbar?')
app.directive('topBar', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/topBar.html',
        link: function (scope, element, attr) {
            console.log('topbar~');


            $('div.split-pane').splitPane();
            $('.dropdown-toggle').dropdown();



        }
    };
});
