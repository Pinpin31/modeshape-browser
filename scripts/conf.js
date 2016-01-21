/**
 * Configuration of ModeShape Browser
 * @type {{title: string, url: string, icons: {folder: string, file: string, workspace: string, repository: string}}}
 */

var modeShapeBrowserConf = {
  title: "ModeShape Browser",
  url: "http://localhost:8080/ofs/rest/",
  copyright : "Ministère de l'Agriculture - BMSQ/PRO+ - 2016",
  icons: {
    folder: "fa-folder-open",
    file: "fa-file",
    workspace: "fa-book",
    repository: "fa-database"
  },
  authentication : {
    type : "basic",
    login : "useradmin",
    pwd : "secret3"
  }
};
