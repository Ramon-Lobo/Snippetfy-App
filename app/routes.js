const express = require('express');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');

const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const categoryController = require('./controllers/categoryController');
const snippetController = require('./controllers/snippetController');

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

/* Auth */

routes.get('/', guestMiddleware, authController.signIn);
routes.get('/signup', guestMiddleware, authController.signUp);
routes.get('/signout', authController.signout);

routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

/* Dashboard */
routes.use('/app', authMiddleware);
routes.get('/app/dashboard', dashboardController.index);

 /* Category */
routes.post('/app/categories/create', categoryController.store);
routes.get('/app/categories/:id', categoryController.show);

/* Snippet */
routes.get('/app/categories/:categoryId/snippets/:id', snippetController.show);
routes.post('/app/categories/:categoryId/snippets/create', snippetController.create);
routes.put('/app/categories/:categoryId/snippets/:id', snippetController.update);
routes.delete('/app/categories/:categoryId/snippets/:id', snippetController.destroy);

routes.use((req, res) => res.render('errors/404'));

routes.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: err,
  });
  
});

module.exports = routes;