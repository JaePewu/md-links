const path = require('path'); //path es un modulo de Node.js
const fs = require('fs'); //file system lee los archivos, fs para usar funciones síncronas
//const fsPromises = fs.promises; // promises para usar funciones asincronas
const { promisify } = require('util');

function isAbsoluteRoute(route) {
  try {
    return path.isAbsolute(route); //.isAbsolute una propiedad de Node.js
  } catch (error) {
    console.log('Error: ', error);
  }
}
// console.log(isAbsoluteRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'))


/************** Funcion para transformar ruta relativa ***************/
function relativeToAbsolute(route) {
  try {
    return path.resolve(route); // convierte de relativa a absolute
  } catch (error) {
    console.log('Error: Is Relative ', error);
  }
}
// console.log(relativeToAbsolute('README.md'));

/****** Funcion para Validar ruta ******/
function isValidRoute(route) {
  try {
    const isAbsolute = isAbsoluteR(route);
    const isRel = isRelative(route);
    const resolvedRoute = isAbsolute ? route : isRel;
    fs.accessSync(resolvedRoute); // Verificar la existencia del archivo o directorio
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}
// console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));
// console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\LD')); //false
  
/********* funtion para saber si es un archivo o un directorio ***********/
function fileOrDirectory(route) { // 
  try {
  const inspectRoute = path.resolve(route);
  const stats = fs.statSync(inspectRoute); // Obtener información sobre el archivo o directorio especificado (inspectRoute)
   // devuelve un objeto stats, contiene detalles sobre el archivo o directorio.
  if (stats.isFile()) {
    return 'Es un Archivo';
  } else if(stats.isDirectory()){
    return 'Es un Directorio';
  }else{
    return 'Desconocido';
  }
    } catch (error) {
        console.log('Error: Archivo/directorio roto o no encontrado', error); 
  }
}
// console.log(fileOrDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));
// console.log(fileOrDirectory('https://nodejs.dev/learn/an-introduction-to-the-npm-package-manager'));
// console.log(fileOrDirectory('S:\\'));

/*********** Funcion para sacra los archivos del directorio ****************/
function getFilesInDirectory(directoryRoute) {// promisify es una funcion de modulo util, convierte en una funcion callback a funcion que devulve una promesa
  const readdir = promisify(fs.readdir);
  return readdir(directoryRoute)
  .then(files => {
    console.log(files)
    files.forEach(file => {
        console.log(file);
    });
  })
  .catch(error => {
    console.log('Error al obtener los archivos:', error);
  });
}
// console.log(getFilesInDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria'));// devuelve los archivos
console.log(getFilesInDirectory('https://github.com/JaePewu/md-links#10-achicando-el-problema'));

module.exports = {
  isAbsoluteRoute,
  relativeToAbsolute,
  isValidRoute,
  fileOrDirectory

};
