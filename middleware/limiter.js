//da correggere ma necessaria per la registrazione e login
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // limite di 100 richieste per IP
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;
