const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDep = [
    ['_', 'lodash']
];

simpleDep.forEach(function(dep) {
    container.register(dep[0], function() {
        return dep[1]
    })
})

container.load(path.join(__dirname, '/controllers'))
container.load(path.join(__dirname, '/helpers'))

container.register('container', function() {
  return container  
});

module.exports = container