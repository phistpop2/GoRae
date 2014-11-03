/**
 * Created by shinsungho on 14. 11. 1..
 */
app.directive('whalesView', function () {
    return {
        restrict : 'ECA',
        replace : true,
        templateUrl : 'app/partials/editor/whalesView.html',
        link: function (scope, element, attr) {
            $('[id^=detail-]').hide();
            $('.toggle').click(function() {
                $input = $( this );
                $target = $('#'+$input.attr('data-toggle'));
                $target.slideToggle();
            });
            scope.whaletop;

            var whale;
            var mine = true ;
            scope.action = 'create';
            scope.searchKeyword = "";
            scope.searchFile = "";

            scope.sm1 = function( _action, _mine, _whale ){
                scope.action = _action;
                whale = _whale;
                mine = _mine;

                if( whale ){
                    scope.newWhaleName = whale.script_name;
                    scope.newWhaleDescription = whale.description;
                    scope.committer = whale.committer;
                }

                scope.whaletop = true;
                // scope.$parent.selectMinion( minion );
            }
            scope.sm1close = function(){
                scope.whaletop = false;
                scope.$parent.whaleClose();
            }
            scope.search = function(){
                scope.$parent.searchDocker( scope.searchKeyword );
            }


            scope.addedDockerFile = [];

            scope.dockering = function( dockerfile ){
                if( scope.isAdded( dockerfile ) ){
                    scope.addedDockerFile.splice( scope.addedDockerFile.indexOf(dockerfile), 1 );
                }else{
                    scope.addedDockerFile.push( dockerfile );
                }
            }
            scope.isAdded = function( dockerfile ){
                return scope.addedDockerFile.indexOf( dockerfile ) > -1;
            }

            //============== DRAG & DROP =============
            // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
            var dropbox = document.getElementById("dropbox")
            scope.dropText = 'Drop files here...'

            // init event handlers
            function dragEnterLeave(evt) {
                evt.stopPropagation()
                evt.preventDefault()
                scope.$apply(function(){
                    scope.dropText = 'Drop files here...'
                    scope.dropClass = ''
                })
            }
            dropbox.addEventListener("dragenter", dragEnterLeave, false)
            dropbox.addEventListener("dragleave", dragEnterLeave, false)
            dropbox.addEventListener("dragover", function(evt) {
                evt.stopPropagation()
                evt.preventDefault()
                var clazz = 'not-available'
                var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0
                scope.$apply(function(){
                    scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
                    scope.dropClass = ok ? 'over' : 'not-available'
                })
            }, false)
            dropbox.addEventListener("drop", function(evt) {
                console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
                evt.stopPropagation()
                evt.preventDefault()
                scope.$apply(function(){
                    scope.dropText = 'Drop files here...'
                    scope.dropClass = ''
                })
                var files = evt.dataTransfer.files
                if (files.length > 0) {
                    scope.$apply(function(){
                        scope.files = []
                        for (var i = 0; i < files.length; i++) {
                            scope.files.push(files[i])
                        }
                    })
                }
            }, false)
            //============== DRAG & DROP =============

            scope.nw = function(action){
                scope.newWhale({
                    uuid : whale ? whale.uuid : undefined,
                    script_name : scope.newWhaleName,
                    description : scope.newWhaleDescription,
                    dockerfile : scope.addedDockerFile
                }, scope.action );
            }
            scope.runWhale = function(){
                scope.runWhalesDock( scope.newWhaleName, scope.addedDockerFile );
            }


        }
    };
});


