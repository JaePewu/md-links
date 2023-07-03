const path = require('path'); //path es un modulo de Node.js
const fs = require('fs'); //file system lee los archivos, fs para usar funciones síncronas
const { log } = require('console');// funcion log de node.js, los mensajes se imprimirán en la consola estándar cuando se ejecute tu programa
const axios = require('axios')


function isAbsoluteRoute(route) {
  try {
    return path.isAbsolute(route); //.isAbsolute una propiedad de Node.js
  } catch (error) {
    log('Error: ', error);
  }
}
// console.log(isAbsoluteRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'))


/************** Funcion para transformar ruta relativa ***************/
function relativeToAbsolute(route) {
  try {
    return path.resolve(route); // convierte de relativa a absolute
  } catch (error) {
    log('Error: Is Relative ', error);
  }
}
// console.log(relativeToAbsolute('README.md'));


/****** Funcion para Validar ruta ******/
function isValidRoute(route) {
  try {
    // const isAbsolute = isAbsoluteRoute(route);
    // const isRelative = relativeToAbsolute(route);
    // const resolvedRoute = isAbsolute ? route : isRelative;
    fs.accessSync(route); // Verificar la existencia del archivo o directorio
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}
  //console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));
  //console.log(isValidRoute('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\LD')); //false
  

/********* funtion para saber si es un archivo o un directorio ***********/
function fileOrDirectory(route) { // cambiar NOMBRE
  try {
  const inspectRoute = path.resolve(route);
  const stats = fs.statSync(inspectRoute); // Obtener información sobre el archivo o directorio especificado (inspectRoute)
   // devuelve un objeto stats, contiene detalles sobre el archivo o directorio.
  if (stats.isFile()) { // comprueba si es un archivo
    log('Es un Archivo');
    return true;
  }else{
    log('Es un Directorio');
    return false;
  }
    } catch (error) {
        log('Error: Archivo/directorio roto o no encontrado', error); 
  }
}
  // console.log(fileOrDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));
  // console.log(fileOrDirectory('https://nodejs.dev/learn/an-introduction-to-the-npm-package-manager'));
    // console.log(fileOrDirectory('C:\\'));



/*********** Funcion para leer el directorio ****************/
function readDirectory(directoryRoute) {
  let files = []; // Arreglo para almacenar los archivos encontrados

  try {
    const items = fs.readdirSync(directoryRoute); // Obtiene los elementos del directorio
    items.forEach((item) => {
      const itemPath = directoryRoute + '/' + item; // Ruta completa del elemento
      const stats = fs.statSync(itemPath); // Obtiene información sobre el elemento

      if (stats.isDirectory()) {
        // Si es una carpeta
        files = files.concat(readDirectory(itemPath)); // Llamada recursiva para analizar subcarpetas 
        //Se utiliza concat para combinar esos archivos con los archivos ya encontrados
      } else {
        // Si es un archivo
        files.push(item); // Agrega el archivo al arreglo de archivos
      }
    });
  } catch (error) {
    log('Error: No se encuentran archivos', error); // Muestra un mensaje de error en caso de fallo
  }

  return files; // Retorna el arreglo con los archivos encontrados
}
// function readDirectory(directoryRoute) {
//   try {
//     return fs.readdirSync(directoryRoute);
//   } catch (error) {
//     log('Error: No se encuentran archivos ', error);
//   }
// }
console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\JAESSTORE PROJECT\\jaesStore'));// devuelve los archivos
// console.log(readDirectory('https://github.com/JaePewu/md-links#10-achicando-el-problema'));
// console.log(readDirectory('C:\\'));


/* *********     funcion para extencion .md    ******************/
function isMarkdown(route) {
  try {
    const extension = path.extname(route); // extname para obtener la extensión del archivo en la ruta especificada
    return extension.toLowerCase() === '.md'; // se compara si la extensión convertida a minúsculas es igual a ".md"
    } catch (error) {
    console.log('Error: ', error);
    }
}
 //  console.log(isMarkdown('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));


/***********   Funcion para leer archivos   ********/
function readFile(route) {
  return new Promise((resolve, reject) => {
    fs.readFile(route, 'utf8', (error, content) => {
            if (error) return reject(error);
            return resolve(content);
        })
  })
  .then ((content) => {
    log('Muestra el contenido del archivo', content);
    // const links = getLinks(content);
    // log('Enlaces encontrados:', links);
  })
  .catch ((error) => {
    log('Error al leer el archivo ', error);
  });
}

// console.log(readFile('C:\\'));
//console.log(readFile('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\archivosDeEjemplo\\jae.md'));
//console.log(readFile('c:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));


/**************** Funcion para extraer los LINKS   ************ */
function getLinks(content){
  const links = content.match(/https?:\/\/\S*/g);// match devuelve todas las expresionesregulares entregadas como parametros
  return links;
}

/**************** Funcion para verificar links   ************ */
function validateLinks(url) {
  return axios.get(url) // Realizar una solicitud GET a la URL utilizando axios
    .then((response) => {
      const isValid = response.status === 200;
      // Verificar si el código de estado de la respuesta es 200 (OK)
      return { isValid, status: response.status }; // Devolver el estado de validez y el código de estado de la respuesta
    })
    .catch((error) => {// Capturar cualquier error que ocurra durante la solicitud y retornar false
      if (error.response) {
        return { isValid: false, status: error.response.status }; // Devolver el estado de validez y el código de estado del error de respuesta
      } else {
        return { isValid: false, error: error.message }; // Devolver el estado de validez y el mensaje de error
      }
    });
}
// console.log(validateLinks('https://bluuweb.github.io/node/01-fundamentos/#npm-node-package-manager'));
// console.log(validateLinks('https://nodejs.dev/learn/the-package-json-guide'));


module.exports = {
  isAbsoluteRoute,
  relativeToAbsolute,
  isValidRoute,
  fileOrDirectory,
  readDirectory,
  isMarkdown,
  readFile,
  getLinks,
  validateLinks
};
