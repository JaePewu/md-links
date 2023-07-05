const path = require('path'); //path es un modulo de Node.js
const fs = require('fs'); //file system lee los archivos, fs para usar funciones síncronas
const { log } = require('console');// funcion log de node.js, los mensajes se imprimirán en la consola estándar cuando se ejecute tu programa
const axios = require('axios');


const isAbsoluteRoute = (route) => path.isAbsolute(route);


/************** Funcion para transformar ruta relativa ***************/
const relativeToAbsolute = (route) => {
  if (!path.isAbsolute(route)) {
    return path.resolve(route);
  }
  throw new Error('Es una ruta relativa');
};


/****** Funcion para Validar ruta ******/
const isValidRoute = (route) => {
  const exists = fs.existsSync(route); // Verificar la existencia del archivo o directorio
  if (exists) {
    return true;
  } else {
    log('La ruta No es válida');
    return false;
    
  }
};

// function isValidRoute(route) {
//   try {
//     fs.accessSync(route); // Verificar la existencia del archivo o directorio
//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }


/********* funtion para saber si es un archivo o un directorio ***********/
const isFileInRoute = (route) => {
  const inspectRoute = path.resolve(route);
  if (fs.existsSync(inspectRoute)) {
    const stats = fs.statSync(inspectRoute);
    if (stats.isFile()) {
      log('Es un Archivo');
      return true;
    } else {
      log('Es un Directorio');
      return false;
    }
  } else {
    log('Error: Archivo/directorio roto o no encontrado');
    return false;
  }
};


/*********** Funcion para leer el directorio ****************/
const readDirectory = (directoryRoute) => {
  const files = [];

  const items = fs.readdirSync(directoryRoute);

  if (items.length === 0) {
    throw new Error('No se encuentran archivos en el directorio');
  }

  items.forEach((item) => {
    const itemPath = path.join(directoryRoute, item);

    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      try {
        const subdirectoryFiles = readDirectory(itemPath);
        files.push(...subdirectoryFiles);
      } catch (error) {
        // Manejar el error si ocurre al leer el subdirectorio
        console.error(`Error al leer el subdirectorio: ${itemPath}`, error);
      }
    } else if (path.extname(itemPath) === '.md') {
      files.push(itemPath);
    }
  });

  if (files.length === 0) {
    throw new Error(`No se encontraron archivos Markdown en: ${directoryRoute}`);
  }

  return files;
};
console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\archivosDeEjemplo'));
// function readDirectory(directoryRoute) {
//   try {
//     return fs.readdirSync(directoryRoute);
//   } catch (error) {
//     log('Error: No se encuentran archivos ', error);
//   }
// }

//console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\JAESSTORE PROJECT\\jaesStore'));// devuelve los archivos
// console.log(readDirectory('https://github.com/JaePewu/md-links#10-achicando-el-problema'));
//console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\archivosDeEjemplo' ));
// console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\archivosDeEjemplo\\Carpeta-Vacia'));


/* *********     funcion para extencion .md    ******************/
const isMarkdown = (route) => {
  const extension = path.extname(route); // Obtiene la extensión del archivo en la ruta especificada
  if (extension.toLowerCase() !== '.md') { // se compara si la extensión convertida a minúsculas es igual a ".md"
    throw new Error('La extensión del archivo no es .md: ' + extension);
  }

  return true;
};


/***********   Funcion para leer archivos   ********/
const readFile = (route) =>{
  return new Promise((resolve, reject) => {
    fs.readFile(route, 'utf8', (error, content) => {
            if (error) return reject(error);
            return resolve(content);
        })
  })
  .then ((content) => {
    log('Muestra el contenido del archivo', content);
  // const links = getLinks(route, content);
  //   log('Enlaces encontrados:', links);
  })
  .catch ((error) => {
    log('Error al leer el archivo ', error);
  });
}

//console.log(readFile('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\README.md'));


/**************** Funcion para extraer los LINKS   ************ */
const getLinks = (route, content) => {
// La función `getLinks` recibe dos parámetros: `route` (ruta del archivo) y `content` (contenido del archivo)
  const regex = content.matchAll(/\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g);  // Se utiliza `matchAll` en `content` con una expresión regular para encontrar todos los enlaces en formato [texto](url)
  const results = [...regex];  // Se utiliza el operador spread (...) para convertir el iterador `regex` en un array
  const links = results.map((result) => ({  // MAP para iterar a través de los elementos dentro de un arreglo
    
    text : result[1], // - `text`: el texto del enlace encontrado (capturado por el grupo 1 en la expresión regular)

    href: result[2],    // - `href`: la URL del enlace encontrado (capturada por el grupo 2 en la expresión regular)

    file: route    // - `file`: la ruta del archivo `route` proporcionada como parámetro

    }))

  return links;
}

/**************** Funcion para verificar links   ************ */
const validateLinks = (links) => {
  return new Promise((resolve, reject) => {
    axios.get(links)
      .then((response) => {
        const status = response.status; // Estado de la respuesta HTTP
        // Determinar el estado del enlace según el código de estado de la respuesta
        const statusText = response.statusText; //

        console.log( status, statusText);
        resolve({ status: status, message: statusText }); // Resolver la promesa con el estado del enlace
      })
      .catch((error) => {
        console.log(error + ' ERRRRORRRR');
        // const status = '404'; // Not Found (No encontrado)
        // const statusText = "Fail";

        reject({ status, statusText, error }); // Rechazar la promesa con el estado del enlace y el error
      });
  });
};

  // console.log(validateLinks('https://curriculum.laboratoria.la/es/topics/javascript/arrays/array-proto')); // bueno
  // console.log(validateLinks('https://nodejs.dev/learn/the-package-json-guide')); // malo


module.exports = {
  isAbsoluteRoute,
  relativeToAbsolute,
  isValidRoute,
  isFileInRoute,
  readDirectory,
  isMarkdown,
  readFile,
  getLinks,
  validateLinks
};
