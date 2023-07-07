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
  })
  .catch ((error) => {
    throw new Error('Error al leer el archivo ', error);// Imprime un mensaje de error si la promesa es rechazada
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
const validateLinks = (links, validate) => {
  return new Promise((resolve, reject) => {
     // Crear un array de promesas para cada enlace
    const linkPromises = links.map(link => {
      // Validar el enlace si validate es true
      if (validate) {
        // Validar el enlace si validate es true
        return axios.get(link.href)// Realizar una solicitud HTTP al enlace
          .then(response => {
            // Crear un objeto con la información del enlace y el estado de respuesta
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              status: response.status,
              ok: response.statusText
            };
          })
          .catch(error => {
            // Capturar el error de la solicitud y crear un objeto con el estado de error correspondiente
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              status: error.response ? error.response.status : null,// Asigna el código de estado HTTP si está disponible en la respuesta de error, de lo contrario, asigna null
              ok: 'fail'
            };
          });
      } else {
         // No validar el enlace, crear un objeto básico con la información del enlace
        return Promise.resolve({
          href: link.href,
          text: link.text,
          file: link.file
        });
      }
    });

    Promise.all(linkPromises)// Esperar a que todas las promesas se resuelvan
      .then(formattedLinks => {
         // Resolver la promesa externa con la matriz de enlaces formateados
        resolve(formattedLinks);
      })
      .catch(error => {
        // Rechazar la promesa externa con el error correspondiente
        reject(error);
      });
  });
};

// Ejemplo de uso de la función validateLinks
/*const links = [
  { href: 'https://www.google.com', text: 'Google', file: '/path/to/file.md' },
  { href: 'https://www.example.com', text: 'Example', file: '/path/to/file.md' }
];

validateLinks(links, false)
  .then(formattedLinks => {
    console.log(formattedLinks);
  })
  .catch(error => {
    console.error(error);
  });

  validateLinks(links, true)
  .then(validatedLinks => {
    console.log(validatedLinks);
  })
  .catch(error => {
    console.error(error);
  });*/

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
};
