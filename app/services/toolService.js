/**
 * Created by shinsungho on 2014. 9. 18..
 */
app.service('toolService', function () {
    this.getCustomers = function () {
        return customers;
    };

    this.insertCustomer = function (firstName, lastName, city) {
        var topID = customers.length + 1;
        customers.push({
            id: topID,
            firstName: firstName,
            lastName: lastName,
            city: city
        });
    };

    this.deleteCustomer = function (id) {
        for (var i = customers.length - 1; i >= 0; i--) {
            if (customers[i].id === id) {
                customers.splice(i, 1);
                break;
            }
        }
    };

    this.getCustomer = function (id) {
        for (var i = 0; i < customers.length; i++) {
            if (customers[i].id === id) {
                return customers[i];
            }
        }
        return null;
    };
    this.fileChoose =  function(){
        var $dialog = $('#fileDialog');

    }
});

app.factory('server', ['$http', function ($http) {
    var SERVER = "http://localhost:8090";
    var socket = io.connect(SERVER);





    return {
        get: function(url) {
            return $http.get(SERVER+url);
        },
        post: function(url, params) {
            return $http.post(SERVER+url, params);
        },
        put : function(url, params){
            return $http.put(SERVER+url, params);
        },
        setToken : function( token ){
            $http.defaults.headers.common.access_token = token;
        },
        getSocket : function(){
            return socket;
        }
    };
}]);