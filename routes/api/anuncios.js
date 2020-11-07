var express = require('express');
const multer = require('multer');
var router = express.Router();
const Anuncio = require('../../models/Anuncio');
const jimp = require('jimp');
const path = require('path');
const cote = require('cote');


const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/images/');
    },
    filename: function(req, file, callback){
        const myFilename = `${Date.now()}_${file.originalname}`;
        callback(null, myFilename);
    }
});
const upload = multer({ storage: storage });


/* GET /api/anuncios */
router.get('/', async function(req, res, next) {
    try {
        
        const name = req.query.name;
        const tags = req.query.tags;
        const onSale = req.query.onSale;
        const price = req.query.price;
        const limit = parseInt(req.query.limit || 15);
        const start = parseInt(req.query.start);
        const sort = req.query.sort;

        
        const filtro = {};

        if (name) {
            filtro.name = new RegExp ('^' + name,'i');
        }
        if (tags) {
            filtro.tags = tags;
        }
        if (onSale === 'true' || onSale === 'false') { 
            filtro.onSale = onSale;
        }
        if (price){
            var arrayPrice = price.split('-');

            if (arrayPrice.length < 2) {
                // precio igual a
                filtro.price = parseInt(arrayPrice[0]);
            } else if (arrayPrice[0] == ''){
                // precio menor que
                filtro.price = {$lt: parseInt(arrayPrice[1])};
            } else if (arrayPrice[1] == '') {
                // precio mayor que
                filtro.price = {$gt: parseInt(arrayPrice[0])};                
            } else {
                // rango de precios
                filtro.price = {$gt: parseInt(arrayPrice[0]), $lt: parseInt(arrayPrice[1])};    
            }
        }

        res.locals.anuncios = await Anuncio.lista(filtro, sort, limit, start);

        res.render('anuncios');        

    } catch (err) {
        next(err);
    }
  
});

/* POST /api/anuncios */
router.post('/',  upload.single('photo'), async (req, res, next) => {
    try{
        const anuncioDatos = req.body;

        // set the photo on the correct url
        anuncioDatos.photo = `/images/${req.file.filename}`;
        anuncioDatos.thumbnail = `/images/thumbnails/thumbnail-${req.file.filename}`
       
        // create a new advice
        const anuncio = new Anuncio(anuncioDatos);

        // save the new advice on the BD
        const anuncioGuardado = await anuncio.save();

        res.json({ result: anuncioGuardado });

        
        // call the thumbnail microservice      
        const requester = new cote.Requester({ name: 'thumbnail client'});
        requester.send({
            type: 'crear thumbnail',
            rutaOriginal: `/images/${req.file.filename}`,
            nombreArchivo: req.file.filename            
        });

    }catch(err) {
        next(err);
    }
});

/* GET /api/anuncios/<_id> */
router.get('/:_id', async (req, res, next) => {
    try{
        const _id = req.params._id;
    
        const anuncio = await Anuncio.findOne({_id: _id});

        res.json({ result: anuncio }); 


    } catch(err){
        next(err);
    }
    
});




module.exports = router;
