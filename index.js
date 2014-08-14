var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  return filename.indexOf('magrathea-mongo/lib') !== -1 ||
    filename.indexOf('node_modules') === -1;
});

module.exports = require('./lib/magrathea-mongo')
