const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));
const swaggerSetup = swaggerUi.setup(swaggerDocument);

module.exports = { swaggerSetup, swaggerDocument };
