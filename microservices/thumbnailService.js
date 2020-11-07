'use strict';

const jimp = require('jimp');
const path = require('path');
const cote = require('cote');
const { nextTick } = require('process');

// declarar el microsevicio
const responder = new cote.Responder({ name: 'thumbnail microservice'});


// lógica del microservicio
responder.on('crear thumbnail', async (req, done) => {
    try {
        
        const image = await jimp.read(path.join(__dirname, '../public', req.rutaOriginal));

        // Resize the image to width 100 and auto height.
        image.resize(100, jimp.AUTO);
    
        // Save and overwrite the image
        await image.writeAsync(path.join(__dirname, `../public/images/thumbnails/thumbnail-${req.nombreArchivo}`) );
    
        console.log('Done!');

        done();


    } catch(err) {
        console.log('Error: ', err);
        next(err);
    }
    
});

