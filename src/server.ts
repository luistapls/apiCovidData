import express, { Application } from 'express';
import helmet from 'helmet';
import { config } from './config';
import api from './routes/api';

import {
  logErrors,
  notFoundHandler,
  errorHandler,
  wrapErrors,
} from './utils/middleware/errorsHandlers.js';

const app: Application = express();

// body parser
app.use(express.json());

// Middleware
app.use(helmet());

// Future routes
app.use('/', api);

// Redirect
// app.get('/', function (_req, res) {
//   res.redirect('/api');
// });

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// Server
app.listen(config.puerto);
