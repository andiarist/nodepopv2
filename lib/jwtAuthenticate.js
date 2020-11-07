'use strict';

const jwt = require("jsonwebtoken");

module.exports = function() {
    return (req, res, next) => {

        // get the token on the header or the query string
        const tokenJWT = req.get('Authorization') || req.query.token;


        // if there is no token
        if (!tokenJWT) {
            const error = new Error('no se ha propuesto token');
            error.status = 401;
            next(error);
            return;
        }

        // verify the token
        jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, tokenContent) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    const error = new Error('el token ha expirado');
                    error.status = 401;
                    next(error);
                    return;
                }

                return next(err);
            }
            
           

            // take de user _id in case we need to know whitch user it is
            req.apiAuthUserId = tokenContent._id;

            next();
        });

        
    };
};