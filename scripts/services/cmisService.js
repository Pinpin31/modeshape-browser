'use strict';

angular.module('modeshapeBrowserApp').factory('cmisService', function ($http, $q) {
  if(modeShapeBrowserConf.url.substring(0, 4) === "http"){
    var baseUrl = modeShapeBrowserConf.url;
  }else{
    var baseUrl = window.location.origin + modeShapeBrowserConf.url;
  }

  return {
    ROOT: "root",
    REPOSITORY: "repository",
    WORKSPACE: "workspace",
    FOLDER: "folder",
    FILE: "file",

    getChildren: function (path) {
      var deferred = $q.defer();
      $http.get(baseUrl + path).then(function (response) {
        var children = response.data.children;
        deferred.resolve(children);
      });
      return deferred.promise;
    },

    getNode: function (path, callback) {
      return $http.get(baseUrl + path).then(function (response) {
        return callback(response.data);
      });
    },

    getBaseUrl: function () {
      return baseUrl;
    },

    getBinaryPath: function (path) {
      return baseUrl + path.replace("items", "binary");
    },

    getUploadPath: function (path) {
      return baseUrl + path.replace("items", "upload");
    },

    getRepositories: function () {
      var deferred = $q.defer();
      $http.get(baseUrl).then(function (response) {
        var repositories = response.data.repositories;
        deferred.resolve(repositories);
      });
      return deferred.promise;
    },

    getWorkspaces: function (workspace) {
      var deferred = $q.defer();
      $http.get(baseUrl + workspace).then(function (response) {
        var workspaces = response.data.workspaces;
        deferred.resolve(workspaces);

      });
      return deferred.promise;
    }

  };
}).factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
}).factory('authService', ['Base64', function (Base64) {
  return {
    getAuthData:function(){
      return Base64.encode(modeShapeBrowserConf.authentication.login + ':' + modeShapeBrowserConf.authentication.pwd);
    }
  };
}]).config(function($httpProvider) {

  $httpProvider.interceptors.push(function(authService) {
    return {
      request: function(req) {
        // Set the `Authorization` header for every outgoing HTTP request
        var authdata = authService.getAuthData();
        req.headers.Authorization = 'Basic '+authdata;
        return req;
      }
    };
  });
});
