const { 
    isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    isFileInRoute, 
    readDirectory,
    isMarkdown,
    readFile,
    getLinks,
    validateLinks} = require('./index.js');


const mdLinks = (route, options = {}) => {
    let filePath; // Variable global para almacenar la ruta del archivo

    return new Promise((resolve, reject) => {
        if (!isAbsoluteRoute(route)) {
        try {
          filePath = relativeToAbsolute(route); // Convertir ruta relativa a absoluta
        } catch (error) {
            reject(error);
        }
    } else {
        filePath = route;
    }
    
    if (!isValidRoute(filePath)) {
        reject('Ruta no válida');
}

        if (isFileInRoute(filePath)) {
            try {
                isMarkdown(filePath); // Verificar si es un archivo Markdown
            } catch (error) {
            reject(error);
        }

        readFile(filePath) // Leer el archivo
        .then((content) => {
            const links = getLinks(filePath, content); // Extraer los enlaces del contenido del archivo

            if (options.validate) {
              validateLinks(links, true) // Validar los enlaces
                .then((validatedLinks) => resolve(validatedLinks))
                .catch((error) => reject(error));
            } else {
                resolve(links);
            }
        })
        .catch((error) => reject(error));
    } else {
        try {
          const files = readDirectory(filePath); // Leer el directorio y obtener los archivos Markdown
    
            const promises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    readFile(file)
                .then((content) => {
                  const links = getLinks(file, content); // Extraer los enlaces de cada archivo
                    
                    if (options.validate) {
                    validateLinks(links, true) // Validar los enlaces
                    .then((validatedLinks) => resolve(validatedLinks))
                    .catch((error) => reject(error));
                } else {
                    resolve(links);
                }
            })
            .catch((error) => reject(error));
        }); 
    });
    
    Promise.all(promises)
            .then((results) => {
              const allLinks = results.flat(); // Aplanar el arreglo de enlaces de múltiples archivos
                resolve(allLinks);
            })
            .catch((error) => reject(error));
        } catch (error) {
            reject(error);
        }
}
    });
};

mdLinks('archivosDeEjemplo', { validate: true })
  .then(links => {
    console.log(links);
  })
  .catch(error => {
    console.error(error);
  });