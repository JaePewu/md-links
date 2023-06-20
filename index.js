const path = require('path'); //path es un modulo de Node.js
const fs = require('fs') //sile system lee los archivos

function isAbsoluteRoute(route) {
  try {
    return path.isAbsolute(route); //.isAbsolute una propiedad de Node.js
  } catch (error) {
    console.log('Error: ', error);
  }
}
console.log(isAbsoluteRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'))

/************** Funcion para transformar ruta relativa ***************/
function relativeToAbsolute(route) {
  try {
    return path.resolve(route); // convierte de relativa a absolute
  } catch (error) {
    console.log('Error: Is Relative ', error);
  }
}
console.log(relativeToAbsolute('README.md'));

/****** Funcion para Validar ruta ******/
function isValidRoute(route){
  try {
    return fs.existsSync(route); // si en la ruta que le dimos existe un archivo, se valida
  } catch (error) {
    console.log('Error:  ', error);
  }
}
console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));
console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\LD')); //false
  
/********* funtion para saber si es un archivo o un directorio ***********/
function fileOrDirectory(route) {
  try {

  let inspectRoute = path.resolve(route);
  const stats = fs.statSync(inspectRoute);

  if (stats.isFile()) {
    return 'Archivo';
  } else if(stats.isDirectory()){
    return 'Directorio';
  }else{
    return 'Desconocido';
  }
  } catch (error) {
    console.log('Error: Archivo o directorio roto ', error); 
  }
}
console.log(fileOrDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));

module.exports = {
  isAbsoluteRoute,
  relativeToAbsolute,
  isValidRoute

};
