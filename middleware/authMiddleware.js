//da correggere ma necessaria per la registrazione e login
const jwt = require('jsonwebtoken');

// Middleware per verificare il token JWT
const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ error: 'Accesso negato, nessun token fornito' });
    }

    try {
        // Assicurati che la chiave segreta sia sicura e in variabili d’ambiente
        req.user = jwt.verify(token, 'segreto');
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token non valido' });
    }
};

// Middleware per verificare il ruolo 'artigiano'
const isArtigiano = (req, res, next) => {
    if (req.user && req.user.ruolo === 'artigiano') {
        next();
    } else {
        res.status(403).json({ error: 'Accesso negato: ruolo artigiano richiesto' });
    }
};

// Middleware per verificare il ruolo 'admin'
const isAdmin = (req, res, next) => {
    if (req.user && req.user.ruolo === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Accesso negato: ruolo admin richiesto' });
    }
};

module.exports = {
    authenticate,
    isArtigiano,
    isAdmin,
};
