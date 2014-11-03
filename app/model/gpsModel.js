/**
 * Created by shinsungho on 2014. 9. 18..
 */
GPSModel = function( data ){
    var jsonArray = null;
    var locationArray = [];
    var filterArray = null;
    var line = null;

    function toJsonArray( src ){
        console.log("source", src)
        var lines = src.split('\n');
        var column = lines[0].split(',');
        var jsonArray = [];

        lines.splice(0,1);
        lines.forEach( function(line, index ){
            if( line.length > 0 ){

                var items = line.split(',');

                var json = {};
                var location = {};
                column.forEach( function( col, index ){
                    col = col.replaceAll('"', '');
                    console.log("col", col);
                    if( col == 'latitude' || col == 'longitude'){
                        location[col] = parseFloat( items[index] )/100;
                    }
                    json[col] = items[index];
                });
                if( location.latitude > 0 )
                    locationArray.push( location );
                jsonArray.push( json );
            }
        });
        console.log("JSON", jsonArray);
        return jsonArray;
    }
    if( data )
        jsonArray = toJsonArray(data);
    console.log('location array', locationArray );

    //map.setView([locationArray[0].latitude, locationArray[0].longitude], 13);

    return {
        getPointList : function(){
            var list = [];
            locationArray.forEach( function( location, index ){
                list.push( new L.LatLng( location.latitude, location.longitude ));

            });
            return list;
        },
        getBounds : function(){
            var bounds = [];

            locationArray.forEach( function( location, index ){
                bounds.push( [location.latitude, location.longitude]);

            });
            return bounds;
        },
        getFilteredBounds : function(){
            var bounds = [];

            filterArray.forEach( function( location, index ){
                bounds.push( [location.lat, location.lng]);

            });
            return bounds;
        },
        setFilteredList : function( jsonArray ){
            filterArray = JSON.parse( jsonArray );
            filterArray.forEach( function( location, index ){
                locationArray.push( new L.LatLng( location.lat, location.lng ));
            });
            line = new L.Polyline(locationArray, {
                color: '#ff0000',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
        },
        getFilteredList : function(){
            var list = [];
            filterArray.forEach( function( location, index ){
                list.push( new L.LatLng( location.lat, location.lng ));

            });
            return list;
        },
        setLine : function( input ){
            line = input;
        },
        getLine : function(){
            return line;
        }

    }

};