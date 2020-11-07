'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    pass: String,
});

usuarioSchema.statics.hashPassword = function(clearPass) {
    return bcrypt.hash(clearPass, 8);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);


module.exports = Usuario;