const { 
    isAbsoluteRoute,
    relativeToAbsolute,
    isValidRoute,
    isFileInRoute, 
    readDirectory,
    isMarkdown,
    readFile/*,
    getLinks,
validateLink*/} = require('../src/index');
const path = require('path');
const fs = require('fs');

describe('isAbsoluteRoute', () => {
    it('debería devolver "true", si la ruta es absoluta ', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo';
        return expect(isAbsoluteRoute(route)).toBe(true);
    });

    it('debería devolver "false" si la ruta es relativa', () => {
        const route = 'mock-archivosDeEjemplo';
        return expect(isAbsoluteRoute(route)).toBe(false);
    });
    });


describe('relativeToAbsolute', () => {
    it('debería resolver la ruta relativa a absoluta', () => {
        const route = 'mock-archivosDeEjemplo\\mock-jae.md';
        const expected = path.resolve(route);
        return expect(relativeToAbsolute(route)).toBe(expected);
    });

    it('debería lanzar un error si la ruta ya es absoluta', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md';
        expect(() => relativeToAbsolute(route)).toThrowError('La ruta ya es absoluta');
    });
    });

    
describe('isValidRoute', () => {
    it('debería resolver con "true" si la ruta existe/es valida', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md';
        expect(isValidRoute(route)).toBe(true);
    });

    it('debería devolver "false" si la ruta no existe', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-No-esxiste';
        expect(isValidRoute(route)).toBe(false);
    });
    });


describe('isFileInRoute', () => {
    it('debería devolver "true" si la ruta es un Archivo', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md';
        expect(isFileInRoute(route)).toBe(true);
    });

    it('debería devolver "false" si la ruta es un Directorio', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo';
        expect(isFileInRoute(route)).toBe(false);
    });
    });


describe('readDirectory', () => {
    // it('debería devolver un arreglo con los archivos encontrados en el directorio o lanzar un error si no se encuentran archivos', () => {
    //     const directoryRouteWithFiles = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo';
    //     const expectedFiles = ['mock-jae.md', 'Archivo-Vacio.md', 'algo.md']; // Suponiendo que estos son los archivos encontrados en el directorio
    
    //     const directoryRouteWithoutFiles = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\carpeta-vacia';
    
    //     const resultWithFiles = readDirectory(directoryRouteWithFiles);
    //     expect(resultWithFiles).toEqual(expectedFiles);
    
    //     expect(() => {
    //     readDirectory(directoryRouteWithoutFiles);
    //     }).toThrowError('No se encuentran archivos en el directorio');
    // });

    
    it('debería lanzar un error si no se encuentran archivos en el directorio', () => {
        const directoryRoute = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\carpeta-vacia';

        expect(() => {
        readDirectory(directoryRoute);
        }).toThrowError('No se encuentran archivos en el directorio');
    });

    it('debería lanzar un error si no se encuentran archivos Markdown en el directorio', () => {
        const directoryRoute = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\subcarpeta';

        expect(() => {
        readDirectory(directoryRoute);
        }).toThrow('No se encontraron archivos Markdown en: ' + directoryRoute);
    });
    });


describe('isMarkdown', () => {
    it('debería devolver "true" si la ruta es extensión .md', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md';
        expect(isMarkdown(route)).toBe(true);
    });

    it('debería devolver "false" si la ruta es cualquier otra extensión', () => {
        const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\subcarpeta\\noMD.txt';
        expect(isMarkdown(route)).toBe(false);
    });
    });


    describe('readFile', () => {
        it('debería devolver el contenido del archivo en formato Markdown', () => {
            const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-mini.md';
            const expectedContent = '[GitHub-Jae](https://github.com/JaePewu?tab=repositories)';
    
            return readFile(route).then(content => {
            expect(content).toBe(expectedContent);
            });
        });
    
        it('debería rechazar con un mensaje de error si ocurre algún error al leer el archivo', () => {
            const route = 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\Archivo-Vacio.md';
    
            return readFile(route).catch(error => {
            expect(error).toMatch('error');
            });
        });
        });