/**
 * Created by shinsungho on 14. 10. 27..
 */
app.directive('minionsView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/minionsView.html',
        link: function (scope, element, attr) {
            scope.checked;
            scope.sm = function( minion ){
                scope.checked = true;
                scope.$parent.selectMinion( minion );

            }
            scope.index = [ 1,2,3,4,5,6,7 ];
            scope.onIndex = function( index ){
                scope.experiment(index);
            }

        }
    };
});
app.directive('minionView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/minionView.html',
        link: function (scope, element, attr) {


        }
    };
});
app.directive('pagesView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/pagesView.html',
        link: function (scope, element, attr) {
            $('[id^=detail-]').hide();
            $('.toggle').click(function() {
                $input = $( this );
                $target = $('#'+$input.attr('data-toggle'));
                $target.slideToggle();
            });
            scope.pagetop;
            var page;
            var mine = true ;
            scope.action = 'create';
            scope.newPageRest = 'get';
            scope.newPageLanguage = 'javascript';
            scope.searchKeyword = "";
            scope.searchFile = "";

            scope.sm2 = function( _action, _mine, _page ){
                scope.action = _action;
                page = _page;
                mine = _mine;

                if( page ){
                    scope.newPageName = page.page_name;
                    scope.newPageCommitMessage = page.commit_msg;
                    scope.newPageDescription = page.description;
                    scope.newPageRest = page.cont.rest;
                    scope.newPageUrl = page.cont.url;
                    scope.committer = page.committer;
                    editor.setValue( page.cont.code );
                    scope.newPageLanguage = page.cont_parser;
                }

                scope.pagetop = true;
                // scope.$parent.selectMinion( minion );
            }
            scope.sm2close = function(){
                scope.pagetop = false;
                scope.$parent.pageClose();
            }
            scope.search = function(){
                scope.$parent.searchDocker( scope.searchKeyword );
            }
            scope.setDocker = function( docker ){
                scope.searchFile = docker;

            };


            // create first editor
            var editor = ace.edit("editor2");
            editor.setTheme("ace/theme/twilight");
            editor.session.setMode("ace/mode/java");
            editor.renderer.setScrollMargin(10, 10);
            editor.setOptions({
                // "scrollPastEnd": 0.8,
                autoScrollEditorIntoView: true
            });

            scope.np = function(){
                scope.newPage({
                        uuid : page ? page.uuid : undefined,
                        page_name : scope.newPageName,
                        commit_msg : scope.newPageCommitMessage,
                        description : scope.newPageDescription,
                        cont : {
                            rest : scope.newPageRest,
                            url : scope.newPageUrl,
                            code : editor.getValue()

                        },
                        cont_parser : scope.newPageLanguage

                }, scope.action );
            }
            scope.updatePage();
        }
    };
});
