/*************************************************
 SlidePanel JS v2.0
 @author Fabio Mangolini
 http://www.responsivewebmobile.com
 **************************************************/

    $.SlidePanel = function(options) {
        //default status is closed
        var status = 'open';

        //initialize the panel show/hide button
        $('#slidein-panel-btn').css({
            'position': 'absolute',
            'top': 0,
            'left':-$('#slidein-panel-btn').outerWidth()+'px'
        });

        //initialize the panel
        $('#slidein-panel').css({
            'position': 'absolute',
            'top': 0,
            'right': -$('#slidein-panel').outerWidth(),
            'height': "100%"
        });
        console.log("oh?", $('#slidein-panel').outerWidth(), $('#slidein-panel-btn').outerWidth() );

        //show and hide the panel depending on status
        $('#slidein-panel-btn').click(

            function() {
                console.log("oh?", $('#slidein-panel').outerWidth(), $('#slidein-panel-btn').outerWidth() );
                if(status == 'close') {
                    status = 'open';
                    $('#slidein-panel').animate({'right':0}, 150);
                }
                else if(status == 'open') {
                    status = 'close';
                    $('#slidein-panel').animate({'right':-$('#slidein-panel').outerWidth()}, 150);
                }
            }
        );
    };
