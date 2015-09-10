angular.module("GoodPhood.Services", [])

.factory("appService", function ($http, $q) {
    var baseUrl = "http://dev.goodphood.in/api/";
    /*
    
    
    RestAPIPath: "http://dev.goodphood.in/api",
    validateMobilePath: "http://dev.goodphood.in/api/validatemobile",
    addguestPath: "http://dev.goodphood.in/api/addguest",
    menuPath: "http://dev.goodphood.in/api/create",
    orderSummeryPath: "http://dev.goodphood.in/api/ordersummary/",
    userCountPath: "http://dev.goodphood.in/api/usercount/",
    addOrUpdateItemsPath: "http://dev.goodphood.in /api/addorupdate",
    vieworderPath: "http://dev.goodphood.in/api/vieworder/",
    confirmorderPath: "http://dev.goodphood.in/api/confirmorder",
    getUsersPath: "http://dev.goodphood.in/api/getusers/",
    authorizeuserPath: "http://dev.goodphood.in/api/authorizeuser",
    invoicePath: "http://dev.goodphood.in/api/getinvoice/",
    getPreferences: "http://dev.goodphood.in/api/getpreferences/",
    savePreferences: "http://dev.goodphood.in/api/savepreferences",
    getFeedback: "http://dev.goodphood.in/api/getfeedback/",
    saveFeedback: "http://dev.goodphood.in/api/savefeedback",
    likeItemPath: "http://dev.goodphood.in/api/addorupdatelike",
    deleteItemPath : "http://dev.goodphood.in/api/delete" 
    
    
    */

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    var get = function (url) {
        var defer = $q.defer(); 
        $http.get(baseUrl + url).success(function (data) {
            
            defer.resolve(data);
        }).error(function (error) {
            alert("get Errorrrrrr");
            defer.reject(error);
        });
        return defer.promise;

    };
    var post = function (url, data) {
        console.log(data);
        var deferred = $q.defer();
        /*$http.post(baseUrl+url, data).success(function(data){
            alert(data)
            deferred.resolve(data);
        }).error(function(error){ 
            alert("erorrrrrrrrrr");
            deferred.reject(error);
        });*/

        //TODO:  SHOULD WORK FOR ANULAR POST
        $.ajax({
            url: baseUrl + url,
            type: "POST",
            data: data,
            //contentType: "application/json",
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: function (data) {
                alert("posting done....");
                console.log(data);
                deferred.resolve(data);
            },
            error: function (error) {
                alert("posting failed");
                deferred.reject(error);
            }
        });
        return deferred.promise;

    }
    var baseServiceCall = function (url, type, data) {
        var deferred = $q.defer();

        $http({
            url: baseUrl + url,
            method: type,
            data: data,
            cache: true,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
        }).then(function (resp) {
            deferred.resolve(resp.data);
        }, function (err) {
            alert("error");
            deferred.reject(err);
        });
        return deferred.promise;
    }

    return {
        gpService: baseServiceCall,
        get: get,
        post: post
    }

}).factory('AccessScope', function ($rootScope) {
    var scopeObj = {};
    return {
        store: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            scopeObj[key] = value;
        },
        get: function (key) {
            return scopeObj[key];
        },
        changeValue : function(key, param, value){
            if(param == null || param == undefined)
            scopeObj[key] = value;
            else if(param != null && param != undefined){
                scopeObj[key][param] = value;
            }
            return;
        }

    }

})