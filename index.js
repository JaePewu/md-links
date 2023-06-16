const path = require('path');

function isAbsoluteRoute(route) {
  try {
    return path.isAbsolute(route);
  } catch (error) {
    console.log('Error: ', error);
  }
  
}
// crear replace()
// console.log(isAbsolute('C:/Users/onesw/OneDrive/Escritorio/Laboratoria/MD L/md-links/README.md'))

module.exports = {
  isAbsoluteRoute

};
