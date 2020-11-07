var express = require('express');
var router = express.Router();
const Anuncio = require('../models/Anuncio');

/* GET home page => listado de anuncios */
router.get('/', async function(req, res, next) {
  try {

    const name = req.query.name;
    const sort = req.query.sort;

    const filtro = {};

    if (name) {
      filtro.name = new RegExp ('^' + name,'i');
    } 

    res.locals.anuncios = await Anuncio.lista(filtro, sort);

    res.render('index');

  } catch (err) {
      next(err);
  }
});

module.exports = router;
