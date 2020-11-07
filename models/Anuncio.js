'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    name: { type: String, index: true },
    onSale: { type: Boolean, index: true },
    price: { type: Number, index: true },
    photo: String,
    tags: { type: [String], index: true },
    thumbnail: String
});

// método estático
anuncioSchema.statics.lista = function(filtro, sort, limit, start) {
    const query = Anuncio.find(filtro);
    query.sort(sort);
    query.limit(limit);
    query.skip(start);
    return query.exec(); // para devolver la promesa cuando está todo añadido
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema);


module.exports = Anuncio;
