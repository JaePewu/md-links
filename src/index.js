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

  const items = fs.readdirSync(directoryRoute);// Obtiene los elementos del directorio

  if (items.length === 0) {// Verifica si no hay archivos en el directorio
    throw new Error('No se encuentran archivos en el directorio');
  }

  items.forEach((item) => {// Recorre cada elemento del directorio
    const itemPath = path.join(directoryRoute, item); // Obtiene la ruta completa del elemento

    const stats = fs.statSync(itemPath); // Obtiene información sobre el elemento (archivo o directorio)

    if (stats.isDirectory()) {// Verifica si el elemento es un directorio
      try {
        files.push(readDirectory(itemPath));// Llamada recursiva para analizar el subdirectorio y obtener los archivos
      } catch (error) {
        // Maneja el error si ocurre al leer el subdirectorio(carpeta dentro de carpeta)
        console.error(`Error al leer el Directorio: ${itemPath}`, error);
      }
    } else if (path.extname(itemPath) === '.md') {// Verifica si el elemento es un archivo Markdown
      files.push(itemPath);// Agrega el archivo al arreglo de archivos encontrados
    }
  });

  if (files.length === 0) { // Verifica si no se encontraron archivos Markdown en el directorio
    throw new Error(`No se encontraron archivos Markdown en: ${directoryRoute}`);
  }

  return files; // Retorna el arreglo con los archivos encontrados
};
// console.log(readDirectory('C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L'));

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
    fs.readFile(route, 'utf8', (error, content) => {// Lee el archivo con la codificación 'utf8'
            if (error) return reject(error);// Rechaza la promesa si ocurre un error al leer el archivo
            return resolve(content);// Resuelve la promesa con el contenido del archivo
        })
  })
  .then ((content) => {
    log('Muestra el contenido del archivo', content);// Imprime el contenido del archivo si la promesa se resuelve
    // const links = getLinks(route, content);
    // log('Enlaces encontrados:', links);
  })
  .catch ((error) => {
    log('Error al leer el archivo ', error);// Imprime un mensaje de error si la promesa es rechazada
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
        const status = error.response.status; // Estado de la respuesta HTTP en caso de error
        const statusText = error.response.statusText; // Mensaje de estado en caso de error

        reject({ status, statusText, error }); // Rechazar la promesa con el estado del enlace y el error
      });
  });
};

   // console.log(validateLinks('https://curriculum.laboratoria.la/es/topics/javascript/arrays/array-proto')); // bueno
  // console.log(validateLinks('https://nodejs.dev/learn/the-package-json-guide')); // malo

  /**---------------- Funcion para tomar lo que necesito de los links validados     --------------------- */
  const getFormattedLinks = (links, validate) => {
    return Promise.all( //dentro de Promise.all, se realiza un mapeo de cada enlace en links utilizando el método map
      links.map(link => {
        if (validate) {
          // Validar el enlace si validate es true
          return validateLinks(link.href)
            .then(({ status, message }) => ({// => ({ ... }): Define una función de flecha que retorna un nuevo objeto. El objeto resultante es el objeto formateado con las propiedades deseadas.
              // ({ status, message }): Utiliza la desestructuración de objetos para extraer las 
              //propiedades status y message del objeto pasado como argumento
              href: link.href,
              text: link.text,
              file: link.file,
              status: status,
              message: message,
              ok: status >= 200 && status < 400 ? "OK" : "Fail"
              //si el código de respuesta está en el rango 200-399, se establece como "OK"; de lo contrario, se establece como "Fail".
            }))
            .catch(error => ({
              // Capturar el error de validación y crear el objeto con el enlace y el estado de error
              href: link.href,
              text: link.text,
              file: link.file,
              status: error.status,
              ok: "Fail"
            }));
        } else {
          // No validar el enlace, solo crear el objeto básico con la información del enlace
          return Promise.resolve({
            href: link.href,
            text: link.text,
            file: link.file
          });
        }
      })
    );
  };

module.exports = {
  isAbsoluteRoute,
  relativeToAbsolute,
  isValidRoute,
  isFileInRoute,
  readDirectory,
  isMarkdown,
  readFile,
  getLinks,
  validateLinks,
  getFormattedLinks
};
