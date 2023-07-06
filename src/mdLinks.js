const { isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    isFileInRoute, 
    readDirectory,
    isMarkdown,
    readFile,
    getLinks,
    validateLinks} = require('./index.js');


const mdLinks = (path) => {
    if (!isAbsoluteRoute(path)) {
        path = relativeToAbsolute(path);
}
if (!isValidRoute(path)) {
         // Error: La ruta no es válida
        return;
}
    if (isFileInRoute(path)) {
        const content = readFile(path);
        return getLinks(path, content);
} else {
        const files = readDirectory(path);
        return files.map((filePath) => {
    return {
        file: filePath,
            };
        });
    }
};

//console.log(mdLinks('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'));
//console.log(mdLinks('archivosDeEjemplo'));