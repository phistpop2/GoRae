/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like the break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them.
  example. 

  #######################################################################*/
app.controller( 'WhalesController', ['$scope', function( $scope ){

}]);

app.controller('ToolController', [ '$scope', 'server', function( $scope, server ){
    var TOOL_VERSION = 0.01;


    $scope.minions = [];
    $scope.whales = [];
    $scope.pages = [];
    $scope.dockerfiles = [];
    $scope.containers = [];

    $scope.selectedMinion = null;

    $scope.all_kill = function(){

    }
    $scope.destroy_all = function(){

        server.get('/destroy').success(function(data, status, headers, config){
            console.log( data );
        }).error(function(data, status, headers, config){
            console.log(data);

        });

    }

    $scope.selectMinion = function( minion ){
        $scope.selectedMinion = minion;
        server.get('/container/'+minion.name).success(function(data, status, headers, config){
            console.log( data );
            data.forEach( function( d , index ){
                d.cal = new Date(parseInt( d.Created )*1000);
                if(d.Names[0])
                    d.Names[0] = " "+d.Names[0].substring(1);

            });
            $scope.containers = data;
        }).error(function(data, status, headers, config){
            console.log(data);

        });


        console.log( 'minion name', minion.name );
    }
    $scope.topClose = function(){
        $scope.dockerfiles = [];
    };
    $scope.searchDocker = function( keyword ){
        server.get('/dockerfile/'+keyword).success(function(data, status, headers, config){
            console.log( data );
            $scope.searchFiles = data;

        }).error(function(data, status, headers, config){
            console.log(data);

        });
    }
    $scope.pageClose = function(){
        $scope.searchFiles = [];
    }
    $scope.whaleClose = function(){
        $scope.searchFiles = [];

    }


    $scope.genDocker = function( dockerfile ){
        var params = {
            name : $scope.selectedMinion.name,
            dockerfile : dockerfile.name

        }
        server.put('/dockerfile', params ).success(function(data, status, headers, config){
            console.log( data );

        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }
    $scope.runWhalesDock = function( minion, list ){

        list.forEach( function( dockerfileName, index ){
            var params = {
                name : minion.name,
                dockerfile : dockerfileName

            }
            server.put('/dockerfile', params ).success(function(data, status, headers, config){
                console.log( data );
            }).error(function(data, status, headers, config){
                console.log(data);
            });

        })
    }
    $scope.pagesMine = [];
    $scope.pagesNotMine = [];
    $scope.updatePage = function(){
        server.get('/pageMine').success(function(data, status, headers, config){
            console.log( data );

            var list = data.pages;
            list.forEach( function( item, index ){
                console.log( 'cont',''+item.cont );
                item.cont = item.cont? JSON.parse( item.cont ) : "";
            });

            $scope.pagesMine = list;
        }).error(function(data, status, headers, config){
            console.log(data);

        });
        server.get('/pageNotMine').success(function(data, status, headers, config){
            console.log( data );

            var list = data.pages;
            list.forEach( function( item, index ){
                item.cont = item.cont? JSON.parse( item.cont ) : "";
            });

            $scope.pagesNotMine = list;
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }
    $scope.updatePage = function(){
        server.get('/whaleMine').success(function(data, status, headers, config){

            var list = data.pages;
            list.forEach( function( item, index ){
                console.log( 'cont',''+item.cont );
                item.cont = item.cont? JSON.parse( item.cont ) : "";
            });

            $scope.pagesMine = list;
        }).error(function(data, status, headers, config){
            console.log(data);
        });
        server.get('/whaleNotMine').success(function(data, status, headers, config){
            console.log( data );

            var list = data.pages;
            list.forEach( function( item, index ){
                item.cont = item.cont? JSON.parse( item.cont ) : "";
            });

            $scope.pagesNotMine = list;
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }

    $scope.username = '';
    $scope.token = '';
    var workPath = null;

    $scope.server = server;


    $scope.config = new ConfigManager();
    $scope.ready = false;
    $scope.gpsModel = null;
    $scope.demoModel = null;

    // for java path ...
    $scope.sl = "/";
    $scope.java_home = "";
    $scope.java_tool = "";
    $scope.javac = "";
    $scope.java = "";
    $scope.pwd = "";






    $scope.logs = [
        { text:"test1", class: "normal", type:"normal", date : new Date() },
        { text:"test2", class: "warning", type:"normal", date : new Date() },
        { text:"test3", class: "normal", type:"normal", date : new Date() },
        { text:"test4", class: "warning", type:"normal", date : new Date() }
    ];

    $scope.filtereds = [];


    $scope.title = "Whales Management Tool"+" v "+TOOL_VERSION;
    $scope.logoStyle = {
        'color' : "#fff",
        'margin-right' : "10px"
    }

    $scope.fileMenus = [
        {"menuName":"새 프로젝트", "click": function(evt){
            $scope.addProject();
        }},
        {"menuName":"Workspace 변경", "click":""},
        {"menuName":"열기", "click":"" },
        {"menuName":"저장" },
        {"menuName":"샘플파일 불러오기", "click": ""}
    ];
    $scope.setToken = function(){

        server.setToken( $scope.token );
        var socket = server.getSocket();
        socket.emit( 'reg', $scope.token );
        socket.on('data', function( data ){
            console.log( String.fromCharCode.apply(null, new Uint8Array(data)) );

        });
        $scope.workspace = new WorkspaceManager( $scope, server );

        server.get('/dockerfile/trusted').success(function(data, status, headers, config){
            console.log( data );
            $scope.dockerfiles = data;

        }).error(function(data, status, headers, config){
            console.log(data);

        });

        //============== DRAG & DROP =============
        // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/


        $scope.setFiles = function(element) {

            $scope.$apply(function(scope) {
                console.log('files:', element.files);
                // Turn the FileList object into an Array
                if( !scope.files)
                    scope.files = [];
                for (var i = 0; i < element.files.length; i++) {
                    scope.files.push(element.files[i])
                }
                scope.progressVisible = false
            });
        };
        $scope.removeFile = function(file){
            $scope.files.splice( $scope.files.indexOf( file ),  1 );

        }



        $scope.uploadFile = function( uuid ) {

            var url = "http://localhost:8090/upload";
            for (var i in $scope.files) {
                var fd = new FormData();
                fd.append("uploadedFile", $scope.files[i])

                var xhr = new XMLHttpRequest()

                xhr.upload.addEventListener("progress", uploadProgress, false)
                xhr.addEventListener("load", uploadComplete, false)
                xhr.addEventListener("error", uploadFailed, false)
                xhr.addEventListener("abort", uploadCanceled, false)
                xhr.open("POST", url);
                xhr.setRequestHeader('access_token', $scope.token );
                xhr.setRequestHeader('uuid', uuid );
                $scope.progressVisible = true;
                console.log( fd, $scope.files  );
                xhr.send(fd);
            }

            /*
            var fd = new FormData();
            for (var i in $scope.files) {
                fd.append("uploadedFile", $scope.files[i])
            }
            var url = "http://localhost:8090/upload";
            var xhr = new XMLHttpRequest()
            xhr.upload.addEventListener("progress", uploadProgress, false)
            xhr.addEventListener("load", uploadComplete, false)
            xhr.addEventListener("error", uploadFailed, false)
            xhr.addEventListener("abort", uploadCanceled, false)
            xhr.open("POST", url);
            $scope.progressVisible = true;
            console.log( fd, $scope.files  );
            xhr.send(fd)*/
        }
        function upFiles(){

        }

        function uploadProgress(evt) {
            $scope.$apply(function(){
                if (evt.lengthComputable) {
                    $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    $scope.progress = 'unable to compute'
                }
            })
        }

        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
            alert(evt.target.responseText)
        }

        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file.")
        }

        function uploadCanceled(evt) {
            $scope.$apply(function(){
                $scope.progressVisible = false
            })
            alert("The upload has been canceled by the user or the browser dropped the connection.")
        }

    }
    $scope.ground = "none";

    $scope.setGround = function( ground ){
        $scope.$apply(function(){
            $scope.ground = ground;
        });
    }
    $scope.newMinion = function(){

    }
    $scope.experiment = function( index ){
        if( index <  4 ){
            var optsc = {
                index :index,
                'Hostname': '',
                "Domainname": "mongodb"+index,
                'User': '',
                'AttachStdin': true,
                'AttachStdout': true,
                'AttachStderr': true,
                'Tty': true,
                'OpenStdin': true,
                "Entrypoint":'mongod',
                'StdinOnce': false,
                'Env': [],
                'Cmd': ['—-rest','—-dbpath', '/data','—-replSet','mnod'],
                'Dns': ['8.8.8.8', '8.8.4.4'],
                'Image': 'kjunine/mongodb',
                'Volumes': ["/data"],
                //'VolumesFrom': 'storage:/data',
                'WorkDir':'/data',
                "PortBindings": {
                    "27017/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": (index + 27016).toString()
                        }
                    ]
                }
            };
            console.log('optsc', optsc );
            server.post('/mean', optsc ).success(function(data, status, headers, config){
                console.log( data );

            }).error(function(data, status, headers, config){
                console.log(data);
            });
        }else if( index == 4 ){
            var optsc = {
                index : index,
                'Hostname': '',
                "Domainname": "",
                'User': '',
                'AttachStdin': true,
                'AttachStdout': true,
                'AttachStderr': true,
                'Tty': true,
                'OpenStdin': true,
                'StdinOnce': false,
                'Env': ['MRSC_ID=mnod','MRSC_SERVERS=172.17.8.101:27017,172.17.8.101:27018' ,'MRSC_ARBITERS=172.17.8.102:27019'],
                'Cmd': ['MRSC_ID=mnod','MRSC_SERVERS=172.17.8.101:27017,172.17.8.101:27018' ,'MRSC_ARBITERS=172.17.8.102:27019'],
                'Dns': ['8.8.8.8', '8.8.4.4'],
                'Image': 'kjunine/mongodb-replset-configurator',
                'Volumes': ["/data"],
                //'VolumesFrom': 'storage:/data',
                'WorkDir':'/data'
            };
            mean2( optsc );


        }else if( index == 5 ){
            var optsc = {
                index : index,
                'Hostname': '',
                "Domainname": "mnod",
                'User': '',
                'AttachStdin': true,
                'AttachStdout': true,
                'AttachStderr': true,
                'Tty': true,
                'OpenStdin': true,
                'StdinOnce': false,
                'Env': ['MONGOHQ_URL=mongodb://172.17.8.101:27017,172.17.8.101:27018/mnod?replicaSet=mnod','NEW_RELIC_LICENSE_KEY=CHANGE_ME'],
                // 'Cmd': ['—rest','—dbpath', '/data','—replSet','mnod'],
                'Dns': ['8.8.8.8', '8.8.4.4'],
                'Image': 'kjunine/mnod',
                // 'Volumes': ["/data"],
                //'VolumesFrom': 'storage:/data',
                // 'WorkDir':'/data',
                "PortBindings": {
                    "8080/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": (8081).toString()
                        }
                    ]
                }
            }
            mean2( optsc );
        }else if( index == 6 ){
            server.get('/abcde').success(function(data, status, headers, config){
                console.log( data );

            }).error(function(data, status, headers, config){
                console.log(data);
            });

        }
        function mean2( optc ){
            server.post('/mean2', optsc ).success(function(data, status, headers, config){
                console.log( data );

            }).error(function(data, status, headers, config){
                console.log(data);
            });
        }
    }
    $scope.newPage = function(input, action){
        switch( action ){
            case 'create':
                var url = '/create/page'
                server.post(url).success(function(data, status, headers, config){
                    console.log( data.page );
                    url = '/pages/'+data.page.uuid;
                    input.cont = JSON.stringify( input.cont );
                    console.log( input.cont+data.page.uuid );
                    input.uuid = data.page.uuid;

                    //data.page = input;
                    server.put(url, {page:input} ).success(function(data, status, headers, config){
                        console.log( data );
                    }).error(function(data, status, headers, config){
                        console.log(data);
                    });

                }).error(function(data, status, headers, config){
                    console.log(data);
                });
                break;
            case 'commit':
                var url = '/pages/'+input.uuid;
                input.cont = JSON.stringify(input.cont);
                server.put(url, {page:input} ).success(function(data, status, headers, config){
                    console.log( data );
                    url = '/commit/page';
                    server.post(url, data.page ).success(function(data2, status, headers, config){
                        console.log( data2 );
                    }).error(function(data2, status, headers, config){
                        console.log(data2);
                    });
                }).error(function(data, status, headers, config){
                    console.log(data);
                });
                break;
            case 'branch':
                var url = '/branch/page';
                server.post(url, input ).success(function(data, status, headers, config){
                    console.log( data );
                    url = '/pages/'+data.page.uuid;

                    input.cont = JSON.stringify( input.cont );
                    server.put(url, {page:input} ).success(function(data2, status, headers, config){
                        console.log( data2 );
                    }).error(function(data2, status, headers, config){
                        console.log(data2);
                    });
                }).error(function(data, status, headers, config){
                    console.log(data);
                });
                break;
        }
    }
    $scope.newWhale = function(input, action){

        console.log( 'new whale', input,  action );


        var url = '/create/whale'
        server.post(url).success(function(data, status, headers, config){
            $scope.uploadFile( data.whale.uuid );
        }).error(function(data, status, headers, config){
            console.log(data);
        });

    }

    function logging( text, classType, type ){
        $scope.logs.push({
            text:text,
            class : classType,
            type : type,
            date : new Date()
        })
        $scope.$apply( function(){
            scrollToBottom();
        })
    }
    function loggingDivider( job ){
        var line = "-------------------------------------------------------------------";
        $scope.logs.push({
            text: line,
            class : "normal",
            type : "divider"
        })
        $scope.logs.push({
            text : job,
            class : "normal",
            type : "job",
            date : new Date()
        })
        $scope.$apply( function(){
            scrollToBottom();
        })
    }
    function scrollToBottom(){
        $('.estimate.log-box').scrollTop( $('.estimate.log-box').height()+35 );
    }



    function initWorkspace(){
        $scope.workspace.initialize( function( err ){
            if( !err ) {

                logging( "tool controller init", "success", "normal" );
            }else{

                logging( "error message : "+err, "error", "normal" );

            }
        });
    }

    function initConfig(){

        $scope.config.initialize( function(err){
            if( !err ) {
                buildJavaPath( $scope.config.getJavaHome(), $scope.config.getSlash() );
                getPwd( function( pwd ){
                    if( pwd ){
                        $scope.pwd = pwd.slice(0, -1);
                        workPath = $scope.config.getRecentWorkspace();
                        if( workPath && workPath.length > 0 ){
                            initWorkspace();
                        }else{
                            $('#workspaceDialog').trigger('click');
                        }
                    }
                });
            }else{
                alert("fail to initialize...");
            }
        });
        $scope.demoModel = new DemoModel();
    }
    function getPwd( callback ){

    }

    function buildJavaPath( java_home, sl ){
        $scope.sl = sl;
        $scope.java_home = java_home;
        $scope.java_tool = java_home+sl+"lib"+sl+"tools.jar";
        $scope.java = java_home+sl+"java";
        $scope.javac = $scope.java+"c";
    }
    function setFiteredLocation( naive, filterName ){
        try{
            var json = JSON.parse( naive );
            console.log( "json!", json );
            var filtered = new GPSModel();
            filtered.setFilteredList( json.result );

            var color = getColor( $scope.filtereds.length );

            filtered.getLine().setStyle({color:color});
            $scope.map.addLayer( filtered.getLine() );
            $scope.map.fitBounds( filtered.getFilteredBounds() );

            var model = {
                filterName : filterName,
                points : filtered.getFilteredBounds().length,
                show : true,
                object:filtered,
                setBounds : function(){
                    $scope.map.fitBounds( filtered.getFilteredBounds() );

                },
                remove : function(){
                    if( model.show ){
                        $scope.map.removeLayer( filtered.getLine() );
                    }
                    var index = $scope.filtereds.indexOf( model );

                    if (index > -1) {
                        $scope.filtereds.splice(index, 1);
                    }
                },
                toggle : function(){
                    if( model.show ){
                        $scope.map.removeLayer( filtered.getLine() );
                    }else{
                        $scope.map.addLayer( filtered.getLine() );
                    }
                    model.show = !model.show;
                },
                color : color


            };
            $scope.filtereds.push( model );
        }catch( e ){
            console.log( e, naive );
        }
    }
    function getColor( index){
        var primary = "#428bca";
        var success = "#5cb85c";
        var info = "#5bc0de";
        var warning = "#f0ad4e";
        var danger = "#d9534f";
        console.log("index", index );

        switch(index){
            case 0:
                return primary;
            case 1:
                return success;
            case 2:
                return info;
            case 3:
                return warning;
            default:
                return "#000";
        }

    }

    this.openWorkspace = function( path ){
        workPath = path;
        initWorkspace();
    }

    this.openFile = function(path){

    }

    this.setJavaPath = function( path ){
        var end = path.lastIndexOf("/");
        var sl = "/";
        var java_home = path.substring(0, path.lastIndexOf("java")-1 );

        if( end < 0 ) {
            sl = "\\";
            java_home = java_home.replaceAll("/", "\\");
        }
        console.log("java_home", java_home, sl );
        buildJavaPath( java_home, sl );
        $scope.config.setJavaHome( java_home, sl );

        $scope.$apply( function(){

        });
    }


    $scope.toolbar = function(){
        $('#sensorDialog').trigger("click");
    };
    $scope.play = function(){
        console.log( $scope.polyline.toGeoJSON() );
        var refJson = null;
        var srcJson = null;
        //var refJson = toJsonArry( latlngs );
        if( $scope.gpsModel ) {
            srcJson = $scope.gpsModel.getPointList();
            //console.log('src', srcJson, JSON.stringify( srcJson ) );
        }else{
            return;
        }

        refJson = $scope.polyline.getLatLngs();
        if (refJson.length < 1 ) {
            return;
        }

    };

    $scope.compile = function( callback ){
        loggingDivider( "filter source code compile" );

        var code = $scope.editor.getValue();
    };

    $scope.filtering = function( callback ){
        loggingDivider( "filtering" );
        var srcJson = null;
        if( $scope.gpsModel ) {
            srcJson = JSON.stringify( $scope.gpsModel.getPointList() );
        }else{
            logging("source model is undefined ", "error", "msg");
            return;
        }


        var filterName = "Default Filter"
        var class_path =  $scope.pwd+$scope.sl+"filter"
        var cmd = "\""+$scope.java+"\" -cp "+class_path+" Filters \""+srcJson+"\"";

    }
    function showEstimateResult( naive ){
        var json = JSON.parse( naive );
        //json.location = JSON.parse( json.location );
        console.log( json );

        logging("평균오차 : "+json.avg, "success", "result" );
        logging("총 오차 : "+json.total, "success", "result" );
        logging("표준편차 : "+json.sdv, "success", "result" );
        logging("json"+json.location, "result", "result");
        alert( "평굔오차 : "+json.avg+", 총 오차 : "+json.total );

    }

    $scope.estimate = function(){
        loggingDivider( "estimate" );
        console.log( $scope.polyline.toGeoJSON() );
        var refJson = null;
        var srcJson = null;
        //var refJson = toJsonArry( latlngs );
        if( $scope.gpsModel ) {
            srcJson = $scope.gpsModel.getPointList();
            srcJson = JSON.stringify( srcJson );
            //console.log('src', srcJson, JSON.stringify( srcJson ) );
        }else{
            logging("source model is undefined ", "error", "msg");
            return;
        }

        refJson = $scope.polyline.getLatLngs();
        if (refJson.length < 1 ) {
            logging("reference model is undefined", "error", "msg" );
            return;
        }
        refJson = JSON.stringify( refJson );

        //console.log( 'ref', refJson, JSON.stringify( refJson ));
        if( refJson) {
            var java_home = "\""+$scope.java;
            var class_path =  $scope.pwd+$scope.slash+"LineD"
            var cmd = java_home + "\" -cp "+class_path+" kr.sth.LineD ";

            var class_path =  $scope.pwd+$scope.sl+"LineD"
            var cmd = "\""+$scope.java+"\" -cp "+class_path+" kr.sth.LineD \""+srcJson+"\""+" \""+refJson+"\"";

        }

        logging("exec - "+cmd, "normal", "msg");



    }
    $scope.export = function(){
        loggingDivider( "estimate" );
        //console.log( $scope.polyline2.getLatLngs() );
        var refJson = $scope.polyline2.getLatLngs();
        if ( !refJson || refJson.length < 1 ) {
            logging("reference model is undefined", "error", "msg" );
            return;
        }
        $scope.demoModel.export( refJson, $('#saveName').val(), $scope.sl );

        $('#myModal').modal('hide');

        console.log(  refJson );

        //refJson = JSON.stringify( refJson );
    }
    $scope.setJava = function(){
        $('#javaDialog').trigger('click');
    }

    $scope.$on('$includeContentLoaded', function(event) {
        $('div.split-pane').splitPane();
        $.SlidePanel();
        $('.side.btn-group').on('click', 'a', function () {
            $(this).siblings().removeClass('active').end().addClass('active');
        });
        $('.button-checkbox').each(function () {

            // Settings
            var $widget = $(this),
                $button = $widget.find('button'),
                $checkbox = $widget.find('input:checkbox'),
                color = $button.data('color'),
                settings = {
                    on: {
                        icon: 'glyphicon glyphicon-check'
                    },
                    off: {
                        icon: 'glyphicon glyphicon-unchecked'
                    }
                };

            // Event Handlers
            $button.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                $button.blur();
                updateDisplay();
            });
            $checkbox.on('change', function () {
                updateDisplay();
            });

            // Actions
            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');

                // Set the button's state
                $button.data('state', (isChecked) ? "on" : "off");

                // Set the button's icon
                $button.find('.state-icon')
                    .removeClass()
                    .addClass('state-icon ' + settings[$button.data('state')].icon);

                // Update the button's color
                if (isChecked) {
                    $button
                        .removeClass('btn-default')
                        .addClass('btn-' + color + ' active');
                }
                else {
                    $button
                        .removeClass('btn-' + color + ' active')
                        .addClass('btn-default');
                }
            }

            // Initialization
            function init() {

                updateDisplay();

                // Inject the icon if applicable
                if ($button.find('.state-icon').length == 0) {
                    $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
                }
            }
            init();
        });

        $("#slidein-panel-btn").click();


        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $scope.map._onResize();
            $scope.map2._onResize();
        })



        var source = $scope.workspace.getTree();






        var map = L.map('map').setView([37.3, 127.0], 13);
        var map2 = L.map('map2').setView([37.3, 127.0], 13);

        window.map = map;
        window.map2 = map2;

        $scope.map = map;
        $scope.map2 = map2;
        // add an OpenStreetMap tile layer
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 25,
            id: 'examples.map-i875mjb7'
        }).addTo(map);


        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 25,
            id: 'examples.map-i875mjb7'
        }).addTo(map2);


        function arrange(){
            if( true   ) return;
            $("#topPane").css({
                height:"none"
            })
            setTimeout( function(){

                $("#topPane").css({
                    height:"100%"
                })
            }, 0);
        }
        var markers = [];
        var markers2 = [];
        var polyline = L.polyline([]).addTo(map);
        var polyline2 = L.polyline([]).addTo(map2);

        $scope.markers = markers;
        $scope.markers2 = markers2;
        $scope.polyline = polyline;
        $scope.polyline2 = polyline2;


        map.on('click', function(e){

        })
        map.on('contextmenu', function(e){
            console.log('context')
            addMarker( e, map, markers, polyline );
        });
        map.on('dragstart', function(e){

        });



        map2.on( 'contextmenu', function(e){
            addMarker(e, map2, markers2, polyline2);
        });



        function addMarker(e, target, markers, polyline){
            if( !target )
                target = map;
            console.log( markers.last() );
            var marker = L.marker(e.latlng,{
                draggable:true
            }).addTo(target);

            polyline.addLatLng(e.latlng);
            markers.push( marker );



            marker.on('dblclick', function(e){
                console.log('click', markers[marker], e);
                var index = markers.indexOf(marker);
                polyline.spliceLatLngs( index, 1 );
                markers.splice(index, 1);

                map.removeLayer(marker);
            });
            marker.on('dragstart', function(e){
                //console.log("drag start", e );

            });
            marker.on('drag', function(e){
                //console.log("drag", e.target._latlng  );
                var index = markers.indexOf(marker);
                polyline.spliceLatLngs( index, 1, L.latLng(e.target._latlng));
            });
            marker.on('dragend', function(e){
                //console.log("drag end", e );
            });

        }
        //map.on('click', onMapClick );


        function onMapClick(e) {
            console.log("You clicked the map at ",e )


            addMarker( e );


            // add
            // pre post
            // clear line
            // draw line

        }


        //map.on('click', onMapClick);


    });
    initConfig();



    // fixme
    $scope.addProject = function(){
        $scope.workspace.addProject();
    }



}]);

app.controller('ModalDemoCtrl', ['$scope', '$modal', '$log',function ($scope, $modal, $log) {

    $scope.items = [];

    $scope.open = function (size) {
        console.log('open', size);

        var modalInstance = $modal.open({
            templateUrl: 'app/partials/editor/newMinionModal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                minions : function(){
                    return $scope.minions;
                }
            }
        });

        modalInstance.opened.then(function(){

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl',
    ['$scope', '$modalInstance', 'server', 'items', 'minions',
    function ($scope, $modalInstance, server, items, minions) {

        $scope.items = items;
        $scope.minions = minions;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            var params = {
                name : $scope.minion_name,
                cpu : $scope.minion_cpu,
                ram : $scope.minion_ram

            }
            server.post('/egg', params)
                .success(function(data, status, headers, config){
                    $scope.minions.push( data );
                    $modalInstance.close($scope.selected.item);
                })
                .error(function(data, status, headers, config){
                    $modalInstance.dismiss('cancel');

                });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);

app.controller('TitlebarController', function($scope, toolService){

    $scope.title = "알고리즘 평가 툴";
    $scope.logoStyle = {
        'color' : "#fff",
        'margin-right' : "10px"
    }
    $scope.barStyle = {
        'box-shadow' : "0 -1px 2px #bbb",
        'background' : "#38403D"
    }
    $scope.fileMenus = [
        {"menuName":"새 프로젝트", "click": function(evt){
            $scope.addProject();
        }},
        {"menuName":"Workspace 변경", "click":""},
        {"menuName":"열기", "click":"" },
        {"menuName":"저장" },
        {"menuName":"샘플파일 불러오기", "click": ""}
    ];


});
app.controller('pageslideCtrl',['$scope',function($scope){
    $scope.checked; // This will be binded using the ps-open attribute
}]);
angular.element(document).ready(function(){
    c = angular.element(document.querySelector('#controller-demo')).scope();
});
