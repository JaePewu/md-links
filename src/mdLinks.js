const { isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    isFileInRoute, 
    readDirectory,
    isMarkdown,
    readFile,
    getLinks,
    validateLinks} = require('./index.js');

function mdLinks(path) {

    if (isAbsoluteRoute(path) !== true){
    path = relativeToAbsolute(path);
    }

    if (isValidRoute(path) !== true) {
        // Error: La ruta no es Valida
        return;
    }

    if ( isFileInRoute(path) !== true) {
        path = readDirectory(path);
    }

    // if (isMarkdown(path) === true) {
    //     const content = readFile(path);
    //     return getLinks(path, content);
    // }

    // if () {
        
    // }

return path.map((filePath) => {
    return {
    file: filePath,
    };
});
    //return matriz=[{},{}]

}

//console.log(mdLinks('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'));
//console.log(mdLinks('archivosDeEjemplo'));