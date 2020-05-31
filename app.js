const express = require('express');
const app = express();

const routes = require('./routes.js');
app.use('/', routes);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(5000);
