const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { setupSwagger } = require('./controllers/swaggerController');

const app = express();

app.use(express.json());
setupSwagger(app);
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
