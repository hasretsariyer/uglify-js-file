const fs = require("fs");
const uuidv4 = require('uuid/v4');
const fileSystem = require("./filesystem");
const { execSync } = require('child_process');
// stderr is sent to stderr of parent process
// you can set options.stdio if you want it to go elsewhere
// execSync('rm -rf scripts/*');

const regexPattern = /(require\([\'\"])(.+)([\'\"]\))/gm; // .js de olabilir

const uglifier = ({
    paths,
    keeps,
    prefix
}) => {
    let files = {};
    for(var inputFolder in paths) {
        console.log("=============== " + paths[inputFolder] + " ===============");
        fileSystem.getAllFiles(fileSystem.scriptsPath + paths[inputFolder]).forEach(function(file){
            files[file.absolutePath] = prefix + uuidv4();
            console.log(file.absolutePath + " === " + files[file.absolutePath]);
        });
    }
    
    findAndReplaceAllRequiredPages(files, keeps);
    writeMappingFile(files);
    removeInputFolders(paths);
};

module.exports = uglifier;

function removeInputFolders(paths) {
    for(var inputFolder in paths) {
        execSync(`rm -rf ${paths[inputFolder]}`);
    }
}

function writeMappingFile(files){
    let fileName = "file_mapping.json";
    
    if(fs.existsSync(fileName)){
        fs.unlinkSync(fileName);
    }
    fs.appendFileSync(fileName, JSON.stringify(files));
}

function findAndReplaceAllRequiredPages(files, keeps){
    Object.keys(files).forEach(function (fileAbsPath) {
        let fileContent = fs.readFileSync(fileAbsPath).toString();
                
        let result = fileContent.replace(regexPattern, function(str, prefix, requiredPage, postfix){
            if(requiredPage.endsWith(".js")) {
                requiredPage = requiredPage.slice(0, requiredPage.length-3);
            }
            let fullPath = fileSystem.getAbsolutePath(fileAbsPath, requiredPage);
            
            // console.fileContentlog(a, b, c, d);
            if(files[fullPath]) {
                // console.log(`${requiredPage} ---> ${fullPath}`);
                let uuid = prefix + files[fullPath] + postfix;
                if(requiredPage.includes("pdpDummys")) {
                    
                    console.log("\n" + fileAbsPath);
                    console.log(`${requiredPage} ---> ${uuid}`);
                }
                return prefix + files[fullPath] + postfix;
            }
            return str;
        });
        
        if(!keeps[fileAbsPath.replace(".js", "")]) {
            // console.log("Overrides: " + fileAbsPath);
            fs.writeFile(files[fileAbsPath] + ".js", result);
        } else {
            fs.writeFile(fileAbsPath, result);
            // console.log("Keeps: " + fileAbsPath);
        }
    }); 
}