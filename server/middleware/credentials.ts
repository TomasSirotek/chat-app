const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req: { headers: { origin: any; }; } , res: { header: (arg0: string, arg1: boolean) => void; }, next: () => void) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials