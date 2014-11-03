/**
 * Created by shinsungho on 2014. 9. 18..
 */


app.directive('fileDialogView', [function() {

    //var fs = require("fs");

    return {
        restrict: 'A',
        transclude: true,
        require: '^?body',
        link: function (scope, element, attr, controller ) {
            var parentController = element.parent().controller();

            element.bind('change', function (evt) {
                var path = ""+evt.srcElement.value;
                var end = path.lastIndexOf("/");
                if( end < 0 )
                    end = path.lastIndexOf("\\");


                var dir = path.substring(0, end);

                parentController.openWorkspace( dir );
                console.log('change', path, dir, controller );

                //var data = fs.readFileSync( path, 'utf8' );
                //console.log( 'data', data );

                //console.log( evt );
                //var data = fs.readFileSync(this.value, 'utf8');

                //console.log("change file", evt );
                //scope.$emit('fileAdded', evt.target.files[0]);
                scope.inputFile = path;
            });
            console.log("ok");
        }
    };
}]);
app.directive('sensorDialogView', [function() {

    //var fs = require("fs");

    return {
        restrict: 'A',
        transclude: true,
        require: '^?body',
        link: function (scope, element, attr, controller ) {
            var parentController = element.parent().controller();

            element.bind('change', function (evt) {
                var path = ""+evt.srcElement.value;

                parentController.openFile( path );
                console.log('change', path );

                scope.inputFile = path;
            });
            //$(element).trigger('click');
            console.log("ok");
        }
    };
}]);

app.directive('javaDialogView', [function() {
    return {
        restrict: 'A',
        transclude: true,
        require: '^?body',
        link: function (scope, element) {
            var parentController = element.parent().controller();
            element.bind('change', function (evt) {
                parentController.setJavaPath( evt.srcElement.value );
            });
        }
    };
}]);

app.directive('postRender', [ function() {
    var def = {
        restrict : 'A',
        terminal : true,
        transclude : true,
        link : function(scope, element, attrs) {
            console.log("ok######", element);

        }
    };
    return def;
}])