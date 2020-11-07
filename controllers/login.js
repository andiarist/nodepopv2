'use strict';

const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {

    /**
     * GET /login
     */
    /*index(req, res, next) {        
        res.send('ok');
    }*/

    /**
     * POST /authenticate
     */
    async post(req, res, next) {
        try {
             // take values
            const email = req.body.email;
            const password = req.body.pass;

            console.log(email, password);

            // find user on BD
            const usuario = await Usuario.findOne({ email: email });

            // if user doesnt exists or password doesnt match
            if (!usuario || !(await bcrypt.compare(password, usuario.pass))) {
                var error = '';
                if (!usuario) {
                    error = new Error('No existe ningún usuario con este email');
                } else {
                    error = new Error('Password incorrecta');
                }
                error.status = 401;
                next(error);
                return;            
            }            

            // if user and password ok
            jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '2d'}, (err, tokenJWT) => {
                if (err) return next(err); 
                
                res.json({ tokenJWT: tokenJWT });
            });


        } catch (err) {
            next(err);
        }
       

        
    }
}

module.exports = new LoginController();