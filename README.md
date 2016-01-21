# Modeshape-Browser
ModeShape Browser is a lightweight client to browse a ModeShape JCR repository : https://raw.githubusercontent.com/ModeShape/modeshape/

ModeShape Browser is a project from BMSQ/PrO+, a departement of french ministry of Agriculture. It's written in Angular and use Rest interface of ModeShape.

You need to activate Rest in ModeShape. See documentation : https://docs.jboss.org/author/display/MODE40/ModeShape's+REST+Service

## Configuration
Configuration is simple. Change the file scripts/conf.js

```javascript
var modeShapeBrowserConf = {
  title: "Orion-File-Service Browser",
  url: "/ofs/rest/",
  copyright : "OFS Made by BMSQ/PRO+ - 2016",
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

