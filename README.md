# Modeshape-Browser
ModeShape Browser is a lightweight client to browse a ModeShape JCR repository : https://raw.githubusercontent.com/ModeShape/modeshape/

ModeShape Browser is a project from BMSQ/PrO+, a departement of french ministry of Agriculture. It's written in Angular and use Rest interface of ModeShape.

You need to activate Rest in ModeShape. See documentation : https://docs.jboss.org/author/display/MODE40/ModeShape's+REST+Service

## Installation
* Install npm
* Install bower
```
npm install -g bower
```
* Install bower-installer
```
npm install -g bower-installer
```
* Install dependencies in libs dir
```
bower-installer
```


## Configuration
Configuration is simple. Change the file scripts/conf.js

```javascript
var modeShapeBrowserConf = {
  title: "ModeShape Browser",
  url: "http://localhost:8080/ofs/rest/",
  copyright : "BMSQ/PRO+ - 2016",
  icons: {
    folder: "fa-folder-open",
    file: "fa-file",
    workspace: "fa-book",
    repository: "fa-database"
  }
};
```

* title : Title in main browser page
* url : url rest of ModeShape Webapp
* copyright : message in browser footer

### Authentication
Only basic authentication is supported in configuration :
```javascript
var modeShapeBrowserConf = {
  title: "ModeShape Browser",
  ...
  authentication : {
    type : "basic",
    login : "login",
    pwd : "pwd"
  }
};
```


## Simply test
To test, you can use http-server package
```
npm install http-server -g
```
and
```
http-server $path/modeshape-browser
```

## CORS
If client and server aren't in the same domain, you sould experience CORS problem.
Configure server to allow client origin in server ModeShape:
http://stackoverflow.com/questions/29388937/problems-resteasy-3-09-corsfilter
