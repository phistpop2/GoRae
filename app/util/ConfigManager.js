/**
 * Created by shinsungho on 2014. 9. 19..
 */
/**
 * Created by shinsungho on 2014. 9. 19..
 */

ConfigManager = function(){
    var json = null;

    function init( callback ) {

    }
    function save(){

    }
    return {
        save : save,
        initialize : init,
        setJavaHome : function( java_home, slash ){
            json.java_home = java_home;
            json.slash = slash;
            save();
        },
        getSlash : function(){
            return json.slash;
        },
        getJavaHome : function(){
            return json.java_home;
        },
        getRecentWorkspace : function(){
            return json.workspace_recent;
        },
        setRecentWorkspace : function( workspace ){
            // fixme - push workspace list
            json.workspace_recent = workspace;
            save();
        }
    }
}