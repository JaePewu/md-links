const { isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    isFileOrDirectory, 
    readDirectory} = require('./index.js');

function mdLinks(path) {

    if (isAbsoluteRoute(path) !== true){
    path = relativeToAbsolute(path);
    }

    if (isValidRoute(path) !== true) {
        // Error: La ruta no es Valida
        return;
    }

    if (isFileOrDirectory(path) !== true) {
        path = readDirectory(path)
    }

 // Devolver la matriz de objetos
return path.map((filePath) => {
    return {
    file: filePath,
      // Otras propiedades que desees agregar
    };
});
    //return matriz=[{},{}]

}

//console.log(mdLinks('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'));
console.log(mdLinks('archivosDeEjemplo'));