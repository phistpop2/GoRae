/**
 * Created by shinsungho on 2014. 9. 22..
 */

DemoModel = function(){


    var raws = []

    function save( items, name ){
        var content;
        var header = "\"latitude\",\"longitude\"\n";
        var sl = "/"
        if( navigator.appVersion.indexOf("Win") != -1 )
            sl = "\\";
        var filename = "csv"+sl+(name? name+".csv" : "default.csv");

        // write header
        content = header;

        // write item;
        items.forEach( function( item, index ){
            content += ""+(item.lat*100).toFixed( 7 )+","+(item.lng*100).toFixed(7)+"\n";
        });


        // write to file
        console.log("export data", content.toString(), content );
        var fs = require("fs");
        fs.open(filename, "w+", function (err, fd) {
            if (!err) {
                var buffer = new Buffer( content.toString() );
                fs.write(fd, buffer, 0, buffer.length, null, function (err, written, buffer) {
                    if( !err ){
                        console.log("!error", written, buffer);

                    }else{
                        console.log('export err1', err);
                    }

                });
                fs.close(fd);
            }else{
                console.log('export error', error);
            }
        });
    }
    //var fs = require('fs');

    return{
        saveToCSV : function( items ){

        },
        export : function( latlngs, name ){
            save( latlngs, name );
        }
    }
}