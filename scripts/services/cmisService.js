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
});
