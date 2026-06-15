const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, '../../swagger.yaml'), 'utf8')
);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = {
  setupSwagger,
  swaggerDocument,
};
