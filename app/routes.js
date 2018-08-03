const express = require('express');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');

const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

routes.use('/app', authMiddleware);

routes.get('/', guestMiddleware, authController.signIn);
routes.get('/signup', guestMiddleware, authController.signUp);
routes.get('/signout', authController.signout);

routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

routes.get('/app/dashboard', dashboardController.index);

routes.use((req, res) => res.render('errors/404'));

routes.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: err,
  });
  
});

module.exports = routes;