const mdLinks = require('../src/mdLinks');

const route = '../mock-archivosDeEjemplo/mock-jae.md';
const options = { validate: true };

describe('mdLinks', () => {
  it('debería retornar una promesa que se resuelve con un array de objeto', (done) => {
    const result = mdLinks(route, options);
    expect(result).resolves.toEqual([
      {
        href: 'https://github.com/Laboratoria/DEV006-md-links',
        text: 'README MD LINKS',
        file: 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md',
        status: 200,
        ok: 'OK'
      },
      {
        href: 'https://nodejs.dev/learn/the-package-json-guide',
        text: 'Link roto desde Node',
        file: 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-lnks\\mock-archivosDeEjemplo\\mock-jae.md',
        status: 404,
        ok: 'fail'
      },
      {
        href: 'https://www.goooogle.com/',
        text: 'Link mal escrito',
        file: 'C:\\Users\\onesw\\OneDrive\\Escritorio\\Laboratoria\\MD L\\md-links\\mock-archivosDeEjemplo\\mock-jae.md',
        status: null,
        ok: 'fail'
      }
    ]).then(done);
  });
});