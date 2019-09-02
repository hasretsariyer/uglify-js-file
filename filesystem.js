const fs = require("fs");
const path = require("path");

const fileSystem = {
    getAllFiles: getFilePaths,
    getAbsolutePath,
    getParentFolder,
    getListOfFolders
};
module.exports = fileSystem;

fileSystem.scriptsPath = "/home/ubuntu/workspace/scripts/";
fileSystem.node_modules = "/home/ubuntu/workspace/scripts/node_modules/";
fileSystem.indexPaths = ["/index.js", "/index.d.ts"];

// If file is a directory, this function tries to find index file.
function getAbsolutePath(file, requiredPath) {
    if (requiredPath.includes("./") || requiredPath.includes("../")) {
        let resolvedPath = path.resolve(getParentFolder(file), requiredPath);
        return getRequiredRealPath(resolvedPath);
    }

    let absPath = fileSystem.scriptsPath + requiredPath;
    let realRequiredPath = getRequiredRealPath(absPath);
    if (fs.existsSync(realRequiredPath)) {
        return realRequiredPath;
    }

    absPath = fileSystem.node_modules + requiredPath;
    realRequiredPath = getRequiredRealPath(absPath);
    return realRequiredPath;
}

function getListOfFolders(folderPath, excludeFolders) {
    let files = [];
    fs.readdirSync(folderPath).forEach((file) => {
        if ((excludeFolders.indexOf(file) === -1) && isDirectory(file)) {
            files.push(file);
        }
    });
    return files;
}

function getRequiredRealPath(path) {
    let isDir = fs.existsSync(path) && isDirectory(path);

    if (!isDir)
        return path + ".js";

    let realPath = "";
    for (var i = 0; i < fileSystem.indexPaths.length; i++) {
        realPath = path + fileSystem.indexPaths[i];
        if (fs.existsSync(realPath))
            break;
    }

    return realPath;
}

function getParentFolder(file) {
    return path.dirname(file);
}

function getFilePaths(folderPath, filePaths = []) {
    fs.readdirSync(folderPath).forEach((file) => {
        let absolutePath = path.resolve(folderPath, file);

        if (isDirectory(absolutePath)) {
            return getFilePaths(absolutePath, filePaths);
        }
        else {
            filePaths.push({ fileName: file, absolutePath: absolutePath });
        }
    });
    return filePaths;
}

function isDirectory(filePath) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}
