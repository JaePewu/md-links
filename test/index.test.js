const { 
    isAbsoluteRoute/*,
    relativeToAbsolute,
    isValidRoute,
    isFileInRoute, 
    readDirectory,
    isMarkdown,
    readFile,
    getLinks,
validateLink*/} = require('../src/index');

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