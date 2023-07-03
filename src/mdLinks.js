const { isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    fileOrDirectory } = require('./index.js');

function mdLinks(path) {
    if (isAbsoluteRoute(path) !== true){
        path = relativeToAbsolute(path);
    }

    if (isValidRoute(path) !== true) {
        // Error: La ruta no es Valida
        return;
    }


    fileOrDirectory();

    //return matriz=[{},{}]

}

//console.log(mdLinks('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'));