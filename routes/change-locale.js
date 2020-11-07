var express = require('express');
var router = express.Router();

/* GET /change-locale/:lang */
router.get('/:lang', function(req, res, next) {

  const lang = req.params.lang;
  console.log(lang);

  const volver = req.get('referer');

  res.cookie('nodepop-lang', lang, { maxAge: 900000 });
  res.redirect(volver);

});

module.exports = router;
