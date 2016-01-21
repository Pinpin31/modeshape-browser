'use strict';

angular.module('modeshapeBrowserApp')
  .controller('MainCtrl', function ($scope, $log, cmisService, $q) {


    /**
     * Upload file to current user navigation path
     */
    $scope.uploadFile = function () {
      var fileInput = document.getElementById('fileinput');

      // In case if user is currently navigating in file view
      if ($scope.currentNode.type != cmisService.FOLDER && $scope.currentNode.type != cmisService.WORKSPACE) {
        window.alert("Please navigate to folder");
        return;
      }

      // Upload multiple files
      if ('files' in fileInput) {
        if (fileInput.files.length == 0) {
          window.alert("Select one or more files.");
        } else {
          for (var i = 0; i < fileInput.files.length; i++) {
            var file = fileInput.files[i];
            var url = cmisService.getUploadPath($scope.currentNode.path) + "/" + file.name;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            xhr.open("POST", url, true);
            xhr.onreadystatechange = function () {
              var currentFile = file;
              console.log(xhr.responseText); // handle response.
              document.getElementById("fileinput").value = "";
              if (xhr.readyState == 4 && ( xhr.status == 200 || xhr.status == 201)) {
                window.alert("Upload successfull " + currentFile.name);
                $scope.explore($scope.currentNode);
              } else if (xhr.readyState == 4 && (xhr.status == 400 || xhr.status == 401)) {
                window.alert("Not allowed to upload in " + $scope.currentNode.path);
              }
            };
            fd.append("file", file);
            xhr.send(fd);

          }
        }
      }

    };

    /**
     * Go back to Root
     */
    $scope.goToRoot = function () {
      init();
    };

    /**
     * Navigation with breadcrumb
     */
    $scope.breadcrumb = function (index) {
      var selected = $scope.parents[index];
      if (index == 0) {
        selected.type = cmisService.ROOT;
      }
      $scope.parents = $scope.parents.slice(0, index);
      $scope.explore(selected);
    };

    /**
     * Navigation with folders
     */
    $scope.explore = function (node) {

      if (node.type === cmisService.ROOT) {
        $scope.currentNode = node;
        $scope.nodes = [];
        constructRepositoriesList();
      } else if (node.type === cmisService.REPOSITORY) {
        $scope.currentNode = node;
        $scope.nodes = [];
        constructWorkspacesList(node);
      } else if (node.type === cmisService.FILE) {
        window.open(cmisService.getBinaryPath(node.path));
      } else {
        $scope.currentNode = node;
        $scope.nodes = [];
        constructNodesList(node, function () {
        });
      }

      // ADD ELEMENTS TO SCOPE
      if (!contains($scope.parents, node) && node.type != cmisService.FILE) {
        $scope.parents.push(node);
      }
    }; // end function explore

    /**
     * Construct list of repositories
     */
    function constructRepositoriesList() {
      var deferred = $q.defer();
      var promise = cmisService.getRepositories();
      promise.then(function (repositories) {
        var nodeRepo = [];
        angular.forEach(repositories, function (repository, key) {
          this.push(getRepositoryObject(repository));
        }, nodeRepo);
        deferred.resolve(nodeRepo);
      });
      deferred.promise.then(function (result) {
        $scope.nodes = result;
      });
    }

    /**
     * Construct list of Workspace from repository
     * @param repository
     */
    function constructWorkspacesList(repository) {
      var deferred = $q.defer();
      var promise = cmisService.getWorkspaces(repository.path);
      promise.then(function (workspaces) {
        var nodeWk = [];
        angular.forEach(workspaces, function (workspace, key) {
          this.push(getWorkspaceObject(workspace, repository));
        }, nodeWk);
        deferred.resolve(nodeWk);
      });
      deferred.promise.then(function (result) {
        $scope.nodes = result;
      });
    }

    /**
     * Construct list of nodes from workspace or node
     * @param node
     * @param callback
     */
    function constructNodesList(node, callback) {
      var deferred = $q.defer();
      var promise = cmisService.getChildren(node.path);
      promise.then(function (children) {
        var prom = [];
        angular.forEach(children, function (child, key) {

          prom.push(cmisService.getNode(node.path + "/" + key, function (childInfo) {
            $scope.nodes.push(getNodeObject(childInfo, node, key));
          }));

        });
        $q.all(prom).then(function () {
          callback();
        });
      });

    }

    /**
     * Construct repository Node
     *
     * @param repository
     * @returns {{}}
     */
    function getRepositoryObject(repository) {
      var obj = {};
      obj['name'] = repository.name;
      obj['type'] = cmisService.REPOSITORY;
      obj['path'] = repository.name;
      obj['classCss'] = modeShapeBrowserConf.icons.repository;
      return obj;
    }

    /**
     * Construct Workspace Node
     * @param workspace
     * @param node
     * @returns {{}}
     */
    function getWorkspaceObject(workspace, node) {
      var obj = {};
      obj['name'] = workspace.name;
      obj['type'] = cmisService.WORKSPACE;
      obj['path'] = node.name + "/" + workspace.name + "/items";
      obj['classCss'] = modeShapeBrowserConf.icons.workspace;
      return obj;
    }

    /**
     * Construct Node
     *
     * @param chldInfo
     * @param node
     * @param key
     * @returns {{}}
     */
    function getNodeObject(chldInfo, node, key) {
      var obj = {};
      obj['name'] = key;
      obj['path'] = node.path + "/" + key;
      obj['primaryType'] = chldInfo['jcr:primaryType'];

      if (chldInfo['jcr:created'] != null) {
        var date = new Date(chldInfo['jcr:created']);
        obj['created'] = date.format("dd/mm/yyyy HH:MM:ss");
      } else {
        obj['created'] = "";
      }
      if (obj['primaryType'] === "nt:file") {
        obj['path'] = obj['path'] + '/jcr:content/jcr:data';
        obj['classCss'] = modeShapeBrowserConf.icons.file;
        obj['type'] = cmisService.FILE;
      } else {
        obj['classCss'] = modeShapeBrowserConf.icons.folder;
        obj['type'] = cmisService.FOLDER;
      }
      return obj;
    }

    function contains(a, obj) {
      var i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    }

    /**
     * Init on load
     */
    function init() {
      var obj = {};
      obj['name'] = cmisService.ROOT;
      obj['path'] = '';
      obj['type'] = cmisService.ROOT;

      $scope.title = modeShapeBrowserConf.title;
      $scope.copyright = modeShapeBrowserConf.copyright;
      $scope.parents = [];
      $scope.currentNode = obj;
      $scope.explore(obj);
    }

    init();

  }
)
;
