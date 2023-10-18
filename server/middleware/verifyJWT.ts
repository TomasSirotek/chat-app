import { StatusCodes } from "http-status-codes";

const jwt = require('jsonwebtoken');

const verifyJWT = (req: { headers: { authorization: any; Authorization: any; }; user: any; roles: any; }, res: { sendStatus: (arg0: number) => any; }, next: () => void) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log("my token " + token)
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err: Error, decoded : any) => {
            if (err) return res.sendStatus(StatusCodes.FORBIDDEN); //invalid token
            req.user = decoded.UserInfo.username;
            next();
        }
    );
}

module.exports = verifyJWT