const Uglify = require("./uglify");
const fileSystem = require("./filesystem");

const prefix = "handm-";
const excludingFolders = ["node_modules", "themes"];

let listOfFolders = fileSystem.getListOfFolders("/home/ubuntu/workspace/scripts", excludingFolders);
Uglify({ paths: listOfFolders, prefix });