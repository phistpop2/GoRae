/**
 * Created by shinsungho on 2014. 9. 19..
 */
WorkspaceManager = function( $scope, server ){

    var json = null;
    var source = [

    ];
    var minions = [];
    var whales = [];
    var pages = [];

    var WHALES_ICON = "lib/jqw/images/contactsIcon.png";
    var PAGES_ICON = "lib/jqw/images/card.png";
    var MINIONS_ICON = "lib/jqw/images/card.png";

    var minionsTree = [];
    var whalesTree = [];
    var pagesTree = [];

    var basicTree = [];

    var socket = null;



    server.get( '/search').
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log( data );
            whales = data.whales;
            pages = data.pages;


            basicTree = [

                {
                    id : 'minions-tree',
                    icon: "lib/jqw/images/folder.png",
                    label: "Minions",
                    items : minionsTree
                },
                {
                    id : 'whales-tree',
                    icon: "lib/jqw/images/folder.png",
                    label: "Whales",
                    items: whalesTree
                }
            ];

            var newProject = {
                icon : "lib/jqw/images/docker.png",
                label : $scope.username+"'s workspace",
                expanded : true,
                items: basicTree

            };




            $scope.whales = [];
            whales.forEach( function( whale, index ){
                whalesTree.push(
                    {
                        id : 'whale',
                        icon : WHALES_ICON,
                        label : whale.script_name? whale.script_name : 'anonymous'
                    }
                );

                $scope.whales.push( whale );
            });

            source.push( newProject );

            $('#jqxTree').jqxTree({ source: source, width: '100%', height: '100%'});
            $('#jqxTree').jqxTree('selectItem', null);

            $('#jqxTree').on('select', function (event) {
                var args = event.args;
                var item = $('#jqxTree').jqxTree('getItem', args.element );
                $scope.setGround( item.id );
                switch( item.id ){
                    case 'minions':
                        break;
                    case 'whales':
                        console.log('show whales page');
                        break;
                    case 'pages':
                        console.log('show pages page');
                        break;
                    case 'minion':
                        break;
                    case 'whale':
                        break;
                    case 'page':
                        break;
                }
            });
            server.get( '/minion').
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    var head = $('#minions-tree');
                    console.log( data );
                    minions = data.minions;
                    $scope.minions = minions;
                    minions.forEach( function( minion, index ){
                        console.log('push', minion);
                        var json = {
                            id : "minion-view",
                            icon : MINIONS_ICON,
                            label : minion.name
                        }

                        minionsTree.push(json);
                        $('#jqxTree').jqxTree('addTo', json, head );
                    });
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log( data );
                });
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
                console.log( data );
        });

    function init( callback ) {



    }
    function genTree(){
        var newProject = {
            icon : "lib/jqw/images/folder.png",
            label : "test",
            expanded : false,
            items: [
                { icon: "lib/jqw/images/folder.png", label: "Location" },
                { icon: "lib/jqw/images/folder.png", label: "State" }
            ]
        }

        source.unshift( newProject );

        $('#jqxTree').jqxTree('addBefore', newProject, null, false);
        $('#jqxTree').jqxTree('render');
        var contextMenu = $("#jqxMenu").jqxMenu({ width: '120px', theme: 'darkblue', height: '56px', autoOpenPopup: false, mode: 'popup' });
        var clickedItem = null;
// open the context menu when the user presses the mouse right button.

        $("#jqxTree li").on('contextmenu', function (event) {
            console.log('mousedown', event);
            var target = $(event.target).parents('li:first')[0];
            $("#jqxTree").jqxTree('selectItem', target);
            contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
            return false;
        });
    }
    function getProjects(){

    }
    function save(){

    }

    return {
        initialize : init,
        getTree : function(){
            return  source;
        },
        addProject : function( name ){
            console.log("add Project");
            var newProject = {
                icon : "lib/jqw/images/folder.png",
                label : "test",
                expanded : false,
                items: [
                    { icon: "lib/jqw/images/folder.png", label: "Location" },
                    { icon: "lib/jqw/images/folder.png", label: "State" }
                ]
            }

            source.unshift( newProject );
            console.log( source );

            $('#jqxTree').jqxTree('addBefore', newProject, null, false);
            $('#jqxTree').jqxTree('render');
            $('#jqxTree').jqxTree({ source: source, width: '100%', height: '100%'});
            $('#jqxTree').jqxTree('selectItem', null);
            var contextMenu = $("#jqxMenu").jqxMenu({ width: '120px', theme: 'darkblue', height: '56px', autoOpenPopup: false, mode: 'popup' });
            var clickedItem = null;
// open the context menu when the user presses the mouse right button.

            $("#jqxTree li").on('contextmenu', function (event) {
                console.log('mousedown', event);
                var target = $(event.target).parents('li:first')[0];
                $("#jqxTree").jqxTree('selectItem', target);
                contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                return false;
            });
        },
        setJavaPath : function( java, javac ){
            json.java = java;
            json.javac = javac;
            save();
        },
        getJavaPath : function(){
            return json;
        }

    }
}