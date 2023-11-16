import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const verifyUserToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, TOKEN_SECRET);
        req.userToken = verified
        next()
    } catch (error) {
        res.status(400).json({error: 'token invalido'})
    }
}