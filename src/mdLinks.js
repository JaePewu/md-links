const { isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    fileOrDirectory } = require('./index.js');

function mdLinks(route) {
    return isAbsoluteRoute(route)
}

console.log(mdLinks('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'));