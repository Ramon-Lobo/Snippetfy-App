const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  signIn(req, res){
    return res.render('auth/signin');
  },

  signUp(req, res){
    return res.render('auth/signup');
  },

  async register(req, res, next){
    try{
      const { email } = req.body;

      if(await User.findOne({ where: { email } })){
        req.flash('error', 'Email já cadastrado');
        return res.redirect('back');
      }

      const password = await bcrypt.hash(req.body.password, 5);

      await User.create({ ... req.body, password});
      req.flash('success', 'Usuario cadastrado com sucesso');
      return res.redirect('/');
    } catch(err){
      return next();
    }
  },

  async authenticate(req, res, next) {
    try{
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      
      if(!user){
        req.flash('error', 'Usuário inexistente');
        return res.redirect('back');
      }

      if(!await bcrypt.compare(password, user.password)){
        req.flash('error', 'Senha incorreta');
        return res.redirect('back');
      }

      req.session.user = user;

      return req.session.save(() => {
        res.redirect('app/dashboard');
      });

    } catch(err){
      return next();
    }
  },

  signout(req, res) {
    req.session.destroy(() => {
      return res.redirect('/');
    });
  }
}